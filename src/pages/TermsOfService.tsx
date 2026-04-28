import { useEffect, useState } from 'react'
import '../pages/Legal.css'

function TermsOfServicePage() {
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
          <h1>Terms of Service</h1>
          <p className="legal-updated">Last updated: April 2026</p>

          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using MFTPlus ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the Service.</p>
            <p>These Terms constitute a legally binding agreement between you and CoolMinds Software (Pty) Ltd., the provider of MFTPlus.</p>
          </section>

          <section className="legal-section">
            <h2>2. Description of Service</h2>
            <p>MFTPlus is a secure file transfer management service that enables:</p>
            <ul>
              <li>Scheduled and on-demand file transfers via SFTP, FTP, FTPS, and local protocols.</li>
              <li>Complete audit trails and transfer logging.</li>
              <li>CLI and GUI interfaces for job management.</li>
              <li>Web-based dashboard for monitoring and configuration.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Account Responsibilities</h2>
            <p>As a user of MFTPlus, you are responsible for:</p>
            <ul>
              <li><strong>Account Security:</strong> Maintaining confidentiality of your password and API keys.</li>
              <li><strong>Authorized Use:</strong> Ensuring all activity under your account is authorized.</li>
              <li><strong>Accurate Information:</strong> Providing truthful and complete registration details.</li>
              <li><strong>Compliance:</strong> Using the service in compliance with applicable laws.</li>
              <li><strong>Notification:</strong> Promptly informing us of unauthorized access or security breaches.</li>
            </ul>
            <p>You are liable for any damage resulting from failure to meet these responsibilities.</p>
          </section>

          <section className="legal-section">
            <h2>4. Acceptable Use</h2>
            <p>You agree not to use MFTPlus to:</p>
            <ul>
              <li>Transfer illegal, harmful, threatening, abusive, or defamatory content.</li>
              <li>Violate intellectual property rights or privacy of others.</li>
              <li>Transmit malware, viruses, or malicious code.</li>
              <li>Engage in fraudulent or unauthorized financial activities.</li>
              <li>Circumvent usage limits or attempt unauthorized access to our systems.</li>
              <li>Interfere with or disrupt the Service or servers connected to the Service.</li>
              <li>Use the Service to compete directly with CoolMinds Software.</li>
            </ul>
            <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
          </section>

          <section className="legal-section">
            <h2>5. Payment and Billing</h2>
            <p><strong>Subscription Plans:</strong> MFTPlus offers monthly subscriptions as listed on our pricing page. Prices are subject to change with 30 days notice.</p>
            <p><strong>Billing:</strong> Charges occur monthly on the anniversary of your subscription. You authorize us to charge your payment method automatically.</p>
            <p><strong>Refunds:</strong> Refunds are handled on a case-by-case basis. Contact support for refund requests within 7 days of billing.</p>
            <p><strong>Free Trial:</strong> New users may access a free trial period. Trial limitations and duration are specified at signup.</p>
          </section>

          <section className="legal-section">
            <h2>6. Data and Content</h2>
            <p><strong>Your Data:</strong> You retain ownership of all files and data transferred through MFTPlus.</p>
            <p><strong>Logs and Metadata:</strong> Transfer logs and audit trails are stored according to our retention policy and used to provide the Service.</p>
            <p><strong>Backups:</strong> While we maintain backups, we do not guarantee data recovery. Implement appropriate backup strategies for critical transfers.</p>
          </section>

          <section className="legal-section">
            <h2>7. Service Availability</h2>
            <p>We strive for high availability but do not guarantee uninterrupted service. Scheduled maintenance will be announced when possible.</p>
            <p><strong>Service Level:</strong> Pro and Enterprise plans may include SLA commitments. See your plan details for specifics.</p>
          </section>

          <section className="legal-section">
            <h2>8. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, CoolMinds Software shall not be liable for:</p>
            <ul>
              <li>Indirect, incidental, special, or consequential damages.</li>
              <li>Loss of data, revenue, profits, or business opportunities.</li>
              <li>Damages exceeding the amount paid in the last 12 months.</li>
            </ul>
            <p>Use of the Service is at your own risk. The Service is provided "as is" without warranties of any kind.</p>
          </section>

          <section className="legal-section">
            <h2>9. Termination</h2>
            <p><strong>By You:</strong> You may terminate your account at any time via the dashboard or by contacting support.</p>
            <p><strong>By Us:</strong> We may suspend or terminate access for violation of these Terms, suspicious activity, or discontinuation of the Service.</p>
            <p>Upon termination, your right to use the Service ceases immediately. We may retain account data as required by law or for legitimate business purposes.</p>
          </section>

          <section className="legal-section">
            <h2>10. Intellectual Property</h2>
            <p>The Service, including all software, designs, text, graphics, and logos, is owned by CoolMinds Software and protected by intellectual property laws.</p>
            <p>MFTPlus trademarks may not be used without prior written permission.</p>
          </section>

          <section className="legal-section">
            <h2>11. Modifications to Service and Terms</h2>
            <p>We reserve the right to modify or discontinue the Service (or features) at any time.</p>
            <p>We may update these Terms with reasonable notice. Material changes will be communicated via email or prominent notice. Continued use after changes constitutes acceptance.</p>
          </section>

          <section className="legal-section">
            <h2>12. Governing Law and Dispute Resolution</h2>
            <p>These Terms are governed by the laws of <strong>South Africa</strong>. Any disputes arising under these Terms shall be resolved in the courts of South Africa.</p>
            <p>If a provision is found unenforceable, the remaining provisions remain in full force.</p>
          </section>

          <section className="legal-section">
            <h2>13. General Provisions</h2>
            <ul>
              <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and CoolMinds Software.</li>
              <li><strong>Waiver:</strong> Failure to enforce any provision does not constitute a waiver.</li>
              <li><strong>Assignment:</strong> You may not assign these Terms without our consent.</li>
              <li><strong>Severability:</strong> If any provision is invalid, the rest of the Terms remain valid.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>14. Contact Information</h2>
            <p>For questions about these Terms, contact us at:</p>
            <p>
              <strong>Email:</strong>{' '}
              <a href={'mailto:' + ['legal','mftplus.co.za'].join('@')}>{['legal','mftplus.co.za'].join('@')}</a>
            </p>
            <p>
              <strong>Company:</strong> CoolMinds Software (Pty) Ltd.<br />
              <strong>Country:</strong> South Africa
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

export default TermsOfServicePage
