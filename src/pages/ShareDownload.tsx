import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router'
import './ShareDownload.css'

const API_BASE = 'https://api.mftplus.co.za'

interface ShareMetadata {
  fileName: string
  fileSize: number
  hasPassword: boolean
  expiresAt: string | null
  downloadCount: number
  maxDownloads: number | null
}

type PageState = 'loading' | 'password' | 'ready' | 'downloading' | 'expired' | 'error' | 'rate_limited'

function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

function ShareDownloadPage() {
  const { token } = useParams<{ token: string }>()
  const [pageState, setPageState] = useState<PageState>('loading')
  const [metadata, setMetadata] = useState<ShareMetadata | null>(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [downloadToken, setDownloadToken] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [downloadedBytes, setDownloadedBytes] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch share metadata on mount
  useEffect(() => {
    if (!token) {
      setPageState('error')
      setErrorMessage('Invalid share link')
      return
    }

    const fetchMetadata = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/shares/${encodeURIComponent(token)}`)
        const body = await response.json()

        if (!response.ok) {
          if (response.status === 410) {
            setPageState('expired')
            return
          }
          if (response.status === 429) {
            setPageState('rate_limited')
            return
          }
          setPageState('error')
          setErrorMessage(body.error || 'Failed to load share information')
          return
        }

        const data = body.data as ShareMetadata
        setMetadata(data)

        if (data.hasPassword) {
          setPageState('password')
        } else {
          setPageState('ready')
        }
      } catch {
        setPageState('error')
        setErrorMessage('Unable to connect. Please check your connection and try again.')
      }
    }

    fetchMetadata()
  }, [token])

  const handlePasswordSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (!password.trim()) {
      setPasswordError('Password is required')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/api/shares/${encodeURIComponent(token!)}/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const body = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          setPageState('rate_limited')
          return
        }
        setPasswordError(body.error || 'Invalid password')
        return
      }

      setDownloadToken(body.data.downloadToken)
      setPageState('ready')
    } catch {
      setPasswordError('Unable to verify password. Please try again.')
    }
  }, [password, token])

  const handleDownload = useCallback(async () => {
    if (!token || !metadata) return

    setPageState('downloading')
    setDownloadProgress(0)
    setDownloadedBytes(0)

    try {
      const headers: Record<string, string> = {}
      if (downloadToken) {
        headers['Authorization'] = `Bearer ${downloadToken}`
      }

      const response = await fetch(`${API_BASE}/api/shares/${encodeURIComponent(token)}/download`, { headers })

      if (!response.ok) {
        if (response.status === 410) {
          setPageState('expired')
          return
        }
        if (response.status === 429) {
          setPageState('rate_limited')
          return
        }
        const body = await response.json().catch(() => ({}))
        setPageState('error')
        setErrorMessage(body.error || 'Download failed')
        return
      }

      // Stream the response and track progress
      const contentLength = response.headers.get('Content-Length')
      const totalBytes = contentLength ? parseInt(contentLength, 10) : metadata.fileSize

      if (!response.body) {
        // Fallback: use blob directly
        const blob = await response.blob()
        downloadBlob(blob, metadata.fileName)
        setDownloadProgress(100)
        return
      }

      const reader = response.body.getReader()
      const chunks: Uint8Array[] = []
      let receivedBytes = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        receivedBytes += value.length
        setDownloadedBytes(receivedBytes)
        setDownloadProgress(Math.round((receivedBytes / totalBytes) * 100))
      }

      // Combine chunks and trigger download
      const blob = new Blob(chunks as BlobPart[])
      downloadBlob(blob, metadata.fileName)
      setDownloadProgress(100)
    } catch {
      setPageState('error')
      setErrorMessage('Download failed. Please try again.')
    }
  }, [token, metadata, downloadToken])

  function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const fileSizeDisplay = metadata ? formatFileSize(metadata.fileSize) : ''

  // Progress display - show either percentage or downloaded/total
  const progressPercent = downloadProgress
  const downloadedDisplay = metadata ? formatFileSize(downloadedBytes) : ''

  return (
    <div className="share-download-page">
      <div className="background-effects">
        <div className="grid-pattern"></div>
        <div className="noise-overlay"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="nav-logo">
            <a href="/">
              <img src="/brand-assets/logo-full-dark.svg" alt="MFTPlus" className="logo-img" />
            </a>
          </div>
          <div className="nav-links">
            <a href="https://dashboard.mftplus.co.za/signup" className="nav-cta-signup" data-umami-event="share-signup">Sign Up</a>
          </div>
        </div>
      </nav>

      <main className="share-content">
        <div className="share-card">
          {/* Loading State */}
          {pageState === 'loading' && (
            <div className="share-loading">
              <div className="loading-spinner"></div>
              <p>Loading share information...</p>
            </div>
          )}

          {/* Password Gate */}
          {pageState === 'password' && metadata && (
            <div className="share-password-gate">
              <div className="share-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h1 className="share-title">Protected File</h1>
              <p className="share-subtitle">
                This file is password-protected. Enter the password to download.
              </p>
              <p className="share-file-info">
                {metadata.fileName} &mdash; {fileSizeDisplay}
              </p>
              <form className="password-form" onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  className="password-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                {passwordError && <p className="password-error">{passwordError}</p>}
                <button type="submit" className="submit-button">
                  Unlock &amp; Download
                </button>
              </form>
            </div>
          )}

          {/* Ready to Download */}
          {pageState === 'ready' && metadata && (
            <div className="share-ready">
              <div className="share-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <polyline points="9 15 12 18 15 15"></polyline>
                </svg>
              </div>
              <h1 className="share-title">Download File</h1>
              <p className="share-file-info-large">{metadata.fileName}</p>
              <p className="share-file-size">{fileSizeDisplay}</p>
              {metadata.maxDownloads !== null && (
                <p className="share-download-count">
                  {metadata.maxDownloads - metadata.downloadCount} of {metadata.maxDownloads} downloads remaining
                </p>
              )}
              <button className="download-button-main" onClick={handleDownload}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download
              </button>
            </div>
          )}

          {/* Download Progress */}
          {pageState === 'downloading' && metadata && (
            <div className="share-downloading">
              <div className="share-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
              <h1 className="share-title">Downloading</h1>
              <p className="share-file-info-large">{metadata.fileName}</p>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p className="progress-text">
                {downloadedDisplay} / {fileSizeDisplay} ({progressPercent}%)
              </p>
            </div>
          )}

          {/* Expired / Revoked */}
          {pageState === 'expired' && (
            <div className="share-expired">
              <div className="share-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h1 className="share-title error-title">This Link Has Expired</h1>
              <p className="share-subtitle">
                The file share link you're trying to access has expired or was revoked.
                Please ask the sender to share the file again.
              </p>
            </div>
          )}

          {/* Rate Limited */}
          {pageState === 'rate_limited' && (
            <div className="share-rate-limited">
              <div className="share-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h1 className="share-title warning-title">Too Many Requests</h1>
              <p className="share-subtitle">
                You've made too many requests. Please wait a while before trying again.
              </p>
            </div>
          )}

          {/* Error */}
          {pageState === 'error' && (
            <div className="share-error">
              <div className="share-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <h1 className="share-title error-title">Something Went Wrong</h1>
              <p className="share-subtitle">{errorMessage}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="mailto:info@mftplus.co.za">Contact</a>
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

export default ShareDownloadPage
