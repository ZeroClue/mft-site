#!/usr/bin/env node
/**
 * Pre-render script for MFTPlus landing page
 * Generates static HTML for each route for SEO
 */
import puppeteer from 'puppeteer';
import { createServer as createHttpServer } from 'http';
import { createReadStream, existsSync, mkdirSync, copyFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const routes = ['/', '/releases'];
const PORT = 3010;
// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
};
// Start a simple HTTP server with SPA fallback
function startServer() {
    return new Promise((resolve) => {
        const server = createHttpServer((req, res) => {
            // Normalize URL, remove query string
            let url = req.url?.split('?')[0] || '/';
            // SPA fallback: serve index.html for non-file routes
            if (!extname(url)) {
                url = '/';
            }
            // Determine file path
            let filePath = join(distDir, url === '/' ? 'index.html' : url);
            // Check if file exists
            if (!existsSync(filePath)) {
                // For SPA routes, serve index.html
                filePath = join(distDir, 'index.html');
            }
            // Get content type
            const ext = extname(filePath);
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            // Stream file
            const stream = createReadStream(filePath)
                .on('open', () => {
                res.writeHead(200, { 'Content-Type': contentType });
                stream.pipe(res);
            })
                .on('error', () => {
                res.writeHead(404);
                res.end('Not found');
            });
        });
        server.listen(PORT, () => {
            resolve({
                close: () => server.close(),
            });
        });
    });
}
async function prerender() {
    console.log('🚀 Starting pre-render...');
    const server = await startServer();
    console.log(`  Server running at: http://localhost:${PORT}/`);
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        for (const route of routes) {
            console.log(`  Pre-rendering: ${route}`);
            const page = await browser.newPage();
            // Log console messages for debugging
            page.on('console', msg => {
                const text = msg.text();
                if (msg.type() === 'error') {
                    console.error(`    [Console Error] ${text}`);
                }
            });
            // Also log page errors
            page.on('pageerror', (error) => {
                const message = error instanceof Error ? error.message : String(error);
                console.error(`    [Page Error] ${message}`);
            });
            await page.goto(`http://localhost:${PORT}${route}`, {
                waitUntil: 'networkidle0',
            });
            // Wait for React to hydrate and render
            await new Promise(resolve => setTimeout(resolve, 3000));
            const html = await page.content();
            // Verify we got actual content
            const hasMainContent = html.includes('Modern File Transfer') || html.includes('MFTPlus');
            if (!hasMainContent) {
                console.warn(`    ⚠ Warning: Pre-rendered HTML may not contain expected content for ${route}`);
            }
            else {
                console.log(`    ✓ Content verified: Found "Modern File Transfer" or "MFTPlus"`);
            }
            // Determine output path
            const outputPath = route === '/'
                ? join(distDir, 'index.html')
                : join(distDir, route, 'index.html');
            // Create directory if needed
            const outputDir = join(outputPath, '..');
            if (!existsSync(outputDir)) {
                mkdirSync(outputDir, { recursive: true });
            }
            // Write the pre-rendered HTML
            writeFileSync(outputPath, html, 'utf-8');
            console.log(`    ✓ Generated: ${outputPath}`);
            await page.close();
        }
        await browser.close();
    }
    finally {
        server.close();
    }
    // Copy public files (sitemap.xml, robots.txt)
    const publicDir = join(rootDir, 'public');
    const filesToCopy = ['sitemap.xml', 'robots.txt'];
    for (const file of filesToCopy) {
        const src = join(publicDir, file);
        if (existsSync(src)) {
            const dest = join(distDir, file);
            copyFileSync(src, dest);
            console.log(`  ✓ Copied: ${file}`);
        }
    }
    console.log('✅ Pre-render complete!');
}
prerender().catch(console.error);
