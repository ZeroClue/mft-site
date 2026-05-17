import { useState, useEffect } from 'react'

const CONSENT_KEY = 'mftplus-analytics-consent'

function getConsent(): boolean | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    return stored === 'true' ? true : stored === 'false' ? false : null
  } catch {
    return null
  }
}

function enableTracking() {
  try {
    const umami = (window as any).umami
    if (umami) umami.track()
  } catch {}
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = getConsent()
    if (consent === true) enableTracking()
    else if (consent === null) setVisible(true)
  }, [])

  const respond = (accepted: boolean) => {
    setVisible(false)
    try {
      localStorage.setItem(CONSENT_KEY, String(accepted))
    } catch {}
    if (accepted) enableTracking()
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#1a1a2e',
      borderTop: '1px solid #2a2a4a',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
      zIndex: 9999,
      fontFamily: 'system-ui, sans-serif',
      fontSize: '14px',
      color: '#e0e0e0',
    }}>
      <span>
        We use privacy-friendly analytics to understand how visitors use our site. No cookies are used for advertising. <a href="/privacy" style={{ color: '#d4a017', textDecoration: 'underline' }}>Privacy Policy</a>
      </span>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={() => respond(false)}
          style={{
            background: 'transparent',
            border: '1px solid #555',
            color: '#ccc',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Decline
        </button>
        <button
          onClick={() => respond(true)}
          style={{
            background: '#d4a017',
            border: 'none',
            color: '#000',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Accept
        </button>
      </div>
    </div>
  )
}
