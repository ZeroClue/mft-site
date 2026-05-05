import { useEffect, useState } from 'react'
import '../pages/Legal.css'

function PrivacyPolicyPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="legal-page">
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
            <a href="/releases">Releases</a>
            <a href="https://dashboard.mftplus.co.za/signup" className="nav-cta-signup">Sign Up</a>
          </div>
        </div>
      </nav>

      <main className="legal-content">
        <div className="legal-container">
          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last updated: April 2026</p>

          <section className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>MFTPlus collects the following information to provide our secure file transfer services:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, and company details provided during registration.</li>
              <li><strong>Transfer Metadata:</strong> Source/destination endpoints, file transfer timestamps, transfer status, and file sizes.</li>
              <li><strong>Usage Data:</strong> Number of transfers, protocols used, and API activity logs.</li>
              <li><strong>Technical Data:</strong> IP address, device information, and browser type for security purposes.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and maintain the MFTPlus service.</li>
              <li>Process and log file transfers with complete audit trails.</li>
              <li>Send service notifications and security alerts.</li>
              <li>Respond to support inquiries and technical issues.</li>
              <li>Comply with legal obligations and protect against fraud.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Data Sharing and Sale</h2>
            <p><strong>We do not sell your personal data.</strong> Your information is never sold, rented, or traded to third parties for marketing purposes.</p>
            <p>We may share data only when necessary to operate our service, such as:</p>
            <ul>
              <li><strong>Subprocessors:</strong> Cloud infrastructure providers (e.g., Vercel for hosting) under data processing agreements.</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Data Security</h2>
            <p>We implement industry-standard security measures:</p>
            <ul>
              <li>TLS encryption for all data in transit.</li>
              <li>SHA-256 checksums for file integrity verification.</li>
              <li>API key authentication for secure access.</li>
              <li>Private keys never stored in plaintext.</li>
              <li>Regular security audits and updates.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Cookies and Analytics</h2>
            <p>We use privacy-friendly analytics tools (Umami Analytics and Vercel Analytics) to:</p>
            <ul>
              <li>Understand how users interact with our service.</li>
              <li>Monitor performance and diagnose technical issues.</li>
              <li>Improve features and user experience.</li>
            </ul>
            <p>You can disable cookies in your browser settings, though this may affect some functionality. We respect your Do Not Track preference and only collect analytics data with your consent (shown via a consent banner on your first visit).</p>
          </section>

          <section className="legal-section">
            <h2>6. Data Retention</h2>
            <p>Transfer logs and audit trails are retained according to your subscription plan:</p>
            <ul>
              <li><strong>Community:</strong> 30 days</li>
              <li><strong>Starter:</strong> 90 days</li>
              <li><strong>Pro and Enterprise:</strong> 1 year (configurable)</li>
            </ul>
            <p>Account data is retained until account deletion. Upon request, we can export or delete your data.</p>
          </section>

          <section className="legal-section">
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data.</li>
              <li><strong>Correct:</strong> Update inaccurate or incomplete information.</li>
              <li><strong>Delete:</strong> Request deletion of your account and associated data.</li>
              <li><strong>Object:</strong> Opt out of non-essential data processing.</li>
              <li><strong>Export:</strong> Receive your data in a structured, machine-readable format.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Children's Privacy</h2>
            <p>MFTPlus is not intended for users under 16. We do not knowingly collect data from children. If we become aware of inadvertent collection, we will delete it promptly.</p>
          </section>

          <section className="legal-section">
            <h2>9. International Data Transfers</h2>
            <p>Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.</p>
          </section>

          <section className="legal-section">
            <h2>10. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. Significant changes will be notified via email or prominent site notice. Continued use of MFTPlus after changes constitutes acceptance.</p>
          </section>

          <section className="legal-section">
            <h2>11. Contact Us</h2>
            <p>For privacy-related inquiries, requests, or complaints, contact us at:</p>
            <p>
              <strong>Email:</strong>{' '}
              <a href={'mailto:' + ['privacy','mftplus.co.za'].join('@')}>{['privacy','mftplus.co.za'].join('@')}</a>
            </p>
          </section>
        </div>
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

export default PrivacyPolicyPage
