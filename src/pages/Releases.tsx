import { useEffect, useState } from 'react'
import './Releases.css'

interface Download {
  platform: string
  url: string
  size: string
  sha256: string
}

interface Release {
  version: string
  date: string
  stable: boolean
  downloads: Download[]
}

const releases: Release[] = [
  {
    version: '0.1.0',
    date: '2026-04-27',
    stable: true,
    downloads: [
      {
        platform: 'Windows (x64)',
        url: 'https://releases.mftplus.co.za/v0.1.0/mftplus-0.1.0-windows-x64.exe',
        size: '5.2 MB',
        sha256: 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890'
      },
      {
        platform: 'macOS (Apple Silicon)',
        url: 'https://releases.mftplus.co.za/v0.1.0/mftplus-0.1.0-macos-aarch64.dmg',
        size: '4.8 MB',
        sha256: 'b2c3d4e5f6789012345678901234567890123456789012345678901234567890123'
      },
      {
        platform: 'macOS (Intel)',
        url: 'https://releases.mftplus.co.za/v0.1.0/mftplus-0.1.0-macos-x64.dmg',
        size: '5.0 MB',
        sha256: 'c3d4e5f67890123456789012345678901234567890123456789012345678901234'
      },
      {
        platform: 'Linux (x64)',
        url: 'https://releases.mftplus.co.za/v0.1.0/mftplus-0.1.0-linux-x64.AppImage',
        size: '5.1 MB',
        sha256: 'd4e5f6789012345678901234567890123456789012345678901234567890123456'
      }
    ]
  }
]

function ReleasesPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="releases-page">
      <div className="background-effects">
        <div className="grid-pattern"></div>
        <div className="noise-overlay"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="nav-logo">
            <img src="/brand-assets/logo-full-dark.svg" alt="MFTPlus" className="logo-img" />
          </div>
          <div className="nav-links">
            <a href="/#features">Features</a>
            <a href="/#how-it-works">How It Works</a>
            <a href="/#pricing">Pricing</a>
            <a href="/releases" className="active">Releases</a>
            <a href="https://dashboard.mftplus.co.za/signup" className="nav-cta-signup">Sign Up</a>
          </div>
        </div>
      </nav>

      <header className="releases-header">
        <h1>Releases</h1>
        <p>Download MFTPlus for your platform. All releases include the CLI and GUI.</p>
      </header>

      <main className="releases-list">
        {releases.map((release) => (
          <section key={release.version} className="release-card">
            <div className="release-header">
              <div className="release-version">v{release.version}</div>
              <div className="release-meta">
                {release.stable && <span className="release-badge stable">Stable</span>}
                <span className="release-date">{new Date(release.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="downloads-grid">
              {release.downloads.map((download) => (
                <div key={download.platform} className="download-item">
                  <div className="download-header">
                    <span className="download-platform">{download.platform}</span>
                    <span className="download-size">{download.size}</span>
                  </div>
                  <a href={download.url} className="download-button" download>
                    Download
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </a>
                  <div className="download-sha256">
                    <span className="sha256-label">SHA-256:</span>
                    <code className="sha256-value">{download.sha256}</code>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href={'mailto:' + ['info','mftplus.co.za'].join('@')}>Contact</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
          <div className="footer-copy">
            <p>&copy; 2026 MFTPlus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ReleasesPage
