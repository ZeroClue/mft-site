import { useEffect, useState } from 'react'
import './App.css'

interface ReleaseFile {
  name: string
  platform: string
  size: string
  sha256: string
  downloadUrl: string
}

interface Release {
  version: string
  date: string
  files: ReleaseFile[]
}

const releases: Release[] = [
  {
    version: '0.1.0',
    date: '2026-04-23',
    files: [
      {
        name: 'mftplus-amd64.deb',
        platform: 'Linux (Debian/Ubuntu)',
        size: '5.2 MB',
        sha256: 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd',
        downloadUrl: 'https://dl.mftplus.co.za/v0.1.0/mftplus-amd64.deb'
      },
      {
        name: 'MFTPlus-x86_64.AppImage',
        platform: 'Linux (AppImage)',
        size: '5.5 MB',
        sha256: 'b2c3d4e5f67890123456789012345678901234567890123456789012345bcde',
        downloadUrl: 'https://dl.mftplus.co.za/v0.1.0/MFTPlus-x86_64.AppImage'
      },
      {
        name: 'MFTPlus-x64_64.msi',
        platform: 'Windows',
        size: '5.3 MB',
        sha256: 'c3d4e5f678901234567890123456789012345678901234567890123456cdef',
        downloadUrl: 'https://dl.mftplus.co.za/v0.1.0/MFTPlus-x64_64.msi'
      },
      {
        name: 'MFTPlus-aarch64.dmg',
        platform: 'macOS (Apple Silicon)',
        size: '5.1 MB',
        sha256: 'd4e5f67890123456789012345678901234567890123456789012345678def0',
        downloadUrl: 'https://dl.mftplus.co.za/v0.1.0/MFTPlus-aarch64.dmg'
      }
    ]
  }
]

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-language">{language}</span>
        <button className="copy-button" onClick={handleCopy}>
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>
      <pre className="code-content"><code>{code}</code></pre>
    </div>
  )
}

function ReleasesPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('section').forEach(section => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="app">
      <div className="background-effects">
        <div className="grid-pattern"></div>
        <div className="noise-overlay"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <nav className="nav">
        <div className="nav-content">
          <div className="nav-logo">
            <span className="logo-text">MFTPlus</span>
          </div>
          <div className="nav-links">
            <a href="/">← Back to Home</a>
            <a href="#contact" className="cta-button">Get Started</a>
          </div>
        </div>
      </nav>

      <section id="releases" className={`features-section ${visibleSections.has('releases') ? 'visible' : ''}`}>
        <div className="section-header">
          <span className="section-tag">// RELEASES</span>
          <h2>Download MFT Agent</h2>
          <p>Choose your platform and download the latest MFTPlus agent.</p>
        </div>

        {releases.map((release) => (
          <div key={release.version} className="release-section">
            <div className="release-header">
              <h3>Version {release.version}</h3>
              <span className="release-date">{release.date}</span>
            </div>

            <div className="platform-grid">
              {release.files.map((file, idx) => (
                <div key={idx} className="platform-card">
                  <div className="platform-header">
                    <span className="platform-name">{file.platform}</span>
                    <span className="platform-size">{file.size}</span>
                  </div>
                  <div className="platform-filename">{file.name}</div>
                  <div className="platform-sha">SHA-256: {file.sha256}</div>
                  <a href={file.downloadUrl} className="platform-download" download>
                    Download
                  </a>
                </div>
              ))}
            </div>

            <div className="verification-section">
              <h4>Verify Download</h4>
              <p>After downloading, verify the SHA-256 checksum:</p>
              <CodeBlock code={`shasum -a 256 ${release.files[0].name}`} />
            </div>
          </div>
        ))}
      </section>

      <section id="contact" className={`contact-section ${visibleSections.has('contact') ? 'visible' : ''}`}>
        <div className="contact-container">
          <h2>Need Help?</h2>
          <p>Check our documentation or contact support for assistance.</p>
          <a href="https://docs.mftplus.co.za" className="cta-large">
            View Documentation
            <span className="cta-arrow">→</span>
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="mailto:info@mftplus.co.za">Contact</a>
            <a href="https://docs.mftplus.co.za">Documentation</a>
            <a href="/">Home</a>
          </div>
          <div className="footer-copy">
            <p>© 2026 MFTPlus. Built with Rust + Tauri.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ReleasesPage
