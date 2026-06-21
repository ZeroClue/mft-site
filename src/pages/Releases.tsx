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

interface ArchivedRelease {
  version: string
  date: string
  url: string
}

type LoadingState = 'loading' | 'success' | 'error'

const ARCHIVED_RELEASES: ArchivedRelease[] = [
  { version: '0.3.0', date: 'May 19, 2026', url: 'https://releases.mftplus.co.za/archive/v0.3.0/' },
  { version: '0.2.0', date: 'May 8, 2026', url: 'https://releases.mftplus.co.za/archive/v0.2.0/' },
  { version: '0.1.0', date: 'April 26, 2026', url: 'https://releases.mftplus.co.za/archive/v0.1.0/' },
]

function groupDownloadsByBinary(downloads: Download[]) {
  const groups = {
    gui: [] as Download[],
    mftctl: [] as Download[],
    agentCli: [] as Download[],
    discover: [] as Download[],
  }

  downloads.forEach(dl => {
    if (dl.platform.startsWith('MFT.Agent')) groups.gui.push(dl)
    else if (dl.platform.startsWith('mftctl')) groups.mftctl.push(dl)
    else if (dl.platform.startsWith('mft-agent-cli')) groups.agentCli.push(dl)
    else if (dl.platform.startsWith('mft-discover')) groups.discover.push(dl)
  })

  return groups
}

function ReleasesPage() {
  const [scrolled, setScrolled] = useState(false)
  const [releases, setReleases] = useState<Release[]>([])
  const [loadingState, setLoadingState] = useState<LoadingState>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showInstallUnix, setShowInstallUnix] = useState(true)
  const [showInstallWindows, setShowInstallWindows] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch('https://releases.mftplus.co.za/release-info.json')
        if (!response.ok) {
          throw new Error(`Failed to fetch releases: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        setReleases(data)
        setLoadingState('success')
      } catch (error) {
        console.error('Error fetching releases:', error)
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
        setLoadingState('error')
      }
    }

    fetchReleases()
  }, [])

  const latestRelease = releases[0]
  const previousRelease = releases[1]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

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
            <a href="https://dashboard.mftplus.co.za/signup?utm_source=mft-site&amp;utm_medium=cta&amp;utm_campaign=signup" className="nav-cta-signup" data-umami-event="releases-signup">Sign Up</a>
          </div>
        </div>
      </nav>

      <header className="releases-header">
        <h1>Releases</h1>
        {loadingState === 'success' && latestRelease && (
          <p>
            Download MFTPlus for your platform. Latest release: <strong>v{latestRelease.version}</strong> —
            mftctl CLI, mft-agent-cli, mft-discover, and MFT.Agent desktop app available now.
          </p>
        )}
      </header>

      <main className="releases-list">

        {/* Installation Instructions */}
        <div className="install-section">
          <h2>Quick Install</h2>

          <div className="install-tabs">
            <button
              className={`install-tab ${showInstallUnix ? 'active' : ''}`}
              onClick={() => setShowInstallUnix(true)}
            >
              Linux / macOS
            </button>
            <button
              className={`install-tab ${!showInstallUnix ? 'active' : ''}`}
              onClick={() => setShowInstallUnix(false)}
            >
              Windows
            </button>
          </div>

          {showInstallUnix ? (
            <div className="install-content">
              <p>Install the default binary (mftctl):</p>
              <div className="install-command">
                <code>curl -fsSL https://releases.mftplus.co.za/install.sh | sh</code>
                <button className="copy-install-btn" onClick={() => copyToClipboard('curl -fsSL https://releases.mftplus.co.za/install.sh | sh')}>
                  Copy
                </button>
              </div>

              <p className="install-note">Install a specific binary:</p>
              <div className="install-examples">
                <div className="install-example">
                  <span>mft-agent-cli:</span>
                  <code>curl -fsSL https://releases.mftplus.co.za/install.sh | sh -s -- --binary mft-agent-cli</code>
                </div>
                <div className="install-example">
                  <span>mft-discover:</span>
                  <code>curl -fsSL https://releases.mftplus.co.za/install.sh | sh -s -- --binary mft-discover</code>
                </div>
              </div>

              <p className="install-note">
                <strong>Platforms:</strong> Linux (x64, aarch64), macOS (Universal, Intel, Apple Silicon)
              </p>
            </div>
          ) : (
            <div className="install-content">
              <p>Install the default binary (mftctl):</p>
              <div className="install-command">
                <code>irm https://releases.mftplus.co.za/install.ps1 | iex</code>
                <button className="copy-install-btn" onClick={() => copyToClipboard('irm https://releases.mftplus.co.za/install.ps1 | iex')}>
                  Copy
                </button>
              </div>

              <p className="install-note">Install a specific binary:</p>
              <div className="install-examples">
                <div className="install-example">
                  <span>mft-agent-cli:</span>
                  <code>irm https://releases.mftplus.co.za/install.ps1 | iex; install -Binary mft-agent-cli</code>
                </div>
                <div className="install-example">
                  <span>mft-discover:</span>
                  <code>irm https://releases.mftplus.co.za/install.ps1 | iex; install -Binary mft-discover</code>
                </div>
              </div>

              <p className="install-note">
                <strong>Platform:</strong> Windows x64
              </p>
            </div>
          )}
        </div>

        {loadingState === 'loading' && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading releases...</p>
          </div>
        )}

        {loadingState === 'error' && (
          <div className="error-state">
            <h2>Unable to load releases</h2>
            <p>{errorMessage || 'Please check your connection and try again later.'}</p>
            <a href="https://releases.mftplus.co.za" className="error-fallback-link">
              Visit releases.mftplus.co.za directly
            </a>
          </div>
        )}

        {loadingState === 'success' && !latestRelease && (
          <div className="empty-state">
            <h2>No releases available</h2>
            <p>Check back soon for the latest MFTPlus releases.</p>
          </div>
        )}

        {/* Latest Release */}
        {loadingState === 'success' && latestRelease && (() => {
          const groups = groupDownloadsByBinary(latestRelease.downloads)
          const hasDownloads = groups.gui.length > 0 || groups.mftctl.length > 0 || groups.agentCli.length > 0 || groups.discover.length > 0

          return (
            <section className="release-card latest-release">
              <div className="release-header">
                <div className="release-version">Latest Release: v{latestRelease.version}</div>
                <div className="release-meta">
                  {latestRelease.stable && <span className="release-badge stable">Stable</span>}
                  <span className="release-date">{new Date(latestRelease.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              {hasDownloads && (
                <div className="downloads-section">
                  {groups.gui.length > 0 && (
                    <div className="binary-group">
                      <h3>MFT.Agent (Desktop App)</h3>
                      <p className="binary-description">Graphical desktop application for managing file transfers.</p>
                      <div className="downloads-grid">
                        {groups.gui.map((download) => (
                          <div key={download.platform} className="download-item">
                            <div className="download-header">
                              <span className="download-platform">{download.platform}</span>
                              <span className="download-size">{download.size}</span>
                            </div>
                            <a href={`${download.url}${download.url.includes('?') ? '&' : '?'}utm_ref=mft-site`} className="download-button" download data-umami-event={`download-${download.platform.toLowerCase().replace(/\s+/g, '-')}`}>
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
                    </div>
                  )}

                  {groups.mftctl.length > 0 && (
                    <div className="binary-group">
                      <h3>mftctl (Admin CLI)</h3>
                      <p className="binary-description">Command-line interface for managing transfers, agents, and jobs.</p>
                      <div className="downloads-grid">
                        {groups.mftctl.map((download) => (
                          <div key={download.platform} className="download-item">
                            <div className="download-header">
                              <span className="download-platform">{download.platform}</span>
                              <span className="download-size">{download.size}</span>
                            </div>
                            <a href={`${download.url}${download.url.includes('?') ? '&' : '?'}utm_ref=mft-site`} className="download-button" download data-umami-event={`download-${download.platform.toLowerCase().replace(/\s+/g, '-')}`}>
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
                    </div>
                  )}

                  {groups.agentCli.length > 0 && (
                    <div className="binary-group">
                      <h3>mft-agent-cli (Agent CLI)</h3>
                      <p className="binary-description">Lightweight CLI for running on agent machines.</p>
                      <div className="downloads-grid">
                        {groups.agentCli.map((download) => (
                          <div key={download.platform} className="download-item">
                            <div className="download-header">
                              <span className="download-platform">{download.platform}</span>
                              <span className="download-size">{download.size}</span>
                            </div>
                            <a href={`${download.url}${download.url.includes('?') ? '&' : '?'}utm_ref=mft-site`} className="download-button" download data-umami-event={`download-${download.platform.toLowerCase().replace(/\s+/g, '-')}`}>
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
                    </div>
                  )}

                  {groups.discover.length > 0 && (
                    <div className="binary-group">
                      <h3>mft-discover (Discovery Tool)</h3>
                      <p className="binary-description">Network discovery tool for finding MFT agents.</p>
                      <div className="downloads-grid">
                        {groups.discover.map((download) => (
                          <div key={download.platform} className="download-item">
                            <div className="download-header">
                              <span className="download-platform">{download.platform}</span>
                              <span className="download-size">{download.size}</span>
                            </div>
                            <a href={`${download.url}${download.url.includes('?') ? '&' : '?'}utm_ref=mft-site`} className="download-button" download data-umami-event={`download-${download.platform.toLowerCase().replace(/\s+/g, '-')}`}>
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
                    </div>
                  )}
                </div>
              )}
            </section>
          )
        })()}

        {/* Previous Release (v0.6.1 with warning) */}
        {loadingState === 'success' && previousRelease && previousRelease.version === '0.6.1' && (
          <section className="release-card partial-release">
            <div className="release-header">
              <div className="release-version">v{previousRelease.version}</div>
              <div className="release-meta">
                <span className="release-badge warning">Partial Release</span>
                <span className="release-date">{new Date(previousRelease.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            <div className="partial-release-note">
              <p>
                <strong>This release is incomplete.</strong> Missing mftctl binaries and some platform builds.
                For the complete experience, please use v{latestRelease?.version || '0.7.0'}.
              </p>
              <a href={`https://releases.mftplus.co.za/v${previousRelease.version}/`} className="view-files-link" target="_blank" rel="noopener">
                View available files →
              </a>
            </div>
          </section>
        )}

        {/* Archive Section */}
        <details className="archive-section">
          <summary className="archive-summary">
            Archive ({ARCHIVED_RELEASES.length} releases)
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </summary>
          <div className="archive-content">
            <p className="archive-note">
              Older releases are provided as-is. Some may be incomplete or use different structures.
              For production use, we recommend the latest release.
            </p>
            <div className="archive-list">
              {ARCHIVED_RELEASES.map((release) => (
                <div key={release.version} className="archive-item">
                  <span className="archive-version">v{release.version}</span>
                  <span className="archive-date">{release.date}</span>
                  <a href={release.url} className="archive-link" target="_blank" rel="noopener">
                    View files →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </details>

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
