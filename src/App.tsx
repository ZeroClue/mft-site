import { useEffect, useState } from 'react'
import './App.css'

function Terminal({ children, title = "terminal@mftplus" }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-button close"></span>
          <span className="terminal-button minimize"></span>
          <span className="terminal-button maximize"></span>
        </div>
        <div className="terminal-title">{title}</div>
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  )
}

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

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="nav-logo">
            <span className="logo-text">MFTPlus</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="/releases">Releases</a>
            <a href="#contact" className="cta-button">Get Started</a>
          </div>
        </div>
      </nav>

      <section id="hero" className="hero-section">
        <div className="hero-content">

          <h1 className="hero-title">
            Modern File Transfer for DevOps Teams
          </h1>

          <p className="hero-subtitle">
            Secure, scheduled file transfers with complete audit trails.
            A 5MB desktop agent that replaces $50,000 MFT servers.
          </p>

          <div className="hero-cta">
            <a href="#contact" className="cta-primary">
              Get Started
              <span className="cta-arrow">→</span>
            </a>
            <a href="#how-it-works" className="cta-secondary">
              How It Works
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">5MB</span>
              <span className="stat-label">Bundle Size</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">&lt;5 min</span>
              <span className="stat-label">Setup Time</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">4+</span>
              <span className="stat-label">Protocols</span>
            </div>
          </div>
        </div>

        <div className="hero-terminal">
          <Terminal title="mftplus@demo:~">
            <div className="terminal-line">
              <span className="prompt">$</span>
              <span className="command">mftctl jobs create \</span>
            </div>
            <div className="terminal-line">
              <span className="command indent">  --agent abc123 \</span>
            </div>
            <div className="terminal-line">
              <span className="command indent">  --name "partner-sync" \</span>
            </div>
            <div className="terminal-line">
              <span className="command indent">  --source sftp://partners.example.com/incoming \</span>
            </div>
            <div className="terminal-line">
              <span className="command indent">  --dest /local/processed \</span>
            </div>
            <div className="terminal-line">
              <span className="command indent">  --schedule "0 2 * * *"</span>
            </div>
            <div className="terminal-line output">
              <span className="success">✓</span>
              <span> Job created successfully</span>
            </div>
            <div className="terminal-line">
              <span className="prompt">$</span>
              <span className="command">mftctl jobs list</span>
            </div>
            <div className="terminal-output">
              <table className="transfer-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>SCHEDULE</th>
                    <th>ENABLED</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>job_abc123</td>
                    <td>partner-sync</td>
                    <td>0 2 * * *</td>
                    <td><span className="status success">true</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Terminal>
        </div>
      </section>

      <section id="problem" className={`problem-section ${visibleSections.has('problem') ? 'visible' : ''}`}>
        <div className="section-header">
          <span className="section-tag">// THE PROBLEM</span>
          <h2>File Transfers Shouldn't Be This Hard</h2>
          <p>Most teams are stuck between expensive legacy software and fragile scripts.</p>
        </div>

        <div className="problem-grid">
          <div className="problem-card">
            <div className="problem-icon">🏛️</div>
            <h3>Legacy MFT Servers</h3>
            <ul className="problem-list">
              <li>$50,000+ in licensing fees</li>
              <li>Weeks to deploy and configure</li>
              <li>Complex maintenance overhead</li>
              <li>Requires dedicated infrastructure</li>
            </ul>
          </div>

          <div className="problem-card">
            <div className="problem-icon">🔧</div>
            <h3>DIY Scripts</h3>
            <ul className="problem-list">
              <li>Fragile and error-prone</li>
              <li>No built-in audit trail</li>
              <li>Breaks silently</li>
              <li>Hard to maintain at scale</li>
            </ul>
          </div>

          <div className="problem-card">
            <div className="problem-icon">👤</div>
            <h3>Manual Clients</h3>
            <ul className="problem-list">
              <li>No automation capability</li>
              <li>Security and compliance risks</li>
              <li>Repetitive manual work</li>
              <li>Easy to make mistakes</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="solution" className={`solution-section ${visibleSections.has('solution') ? 'visible' : ''}`}>
        <div className="section-header">
          <span className="section-tag">// THE SOLUTION</span>
          <h2>Meet MFTPlus</h2>
          <p>A modern desktop agent for secure, scheduled file transfers. No central server required.</p>
        </div>

        <div className="solution-comparison">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Legacy MFT</th>
                <th>DIY Scripts</th>
                <th className="highlight">MFTPlus</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>$50,000+ licensing</td>
                <td>Fragile, error-prone</td>
                <td className="highlight">Affordable pricing</td>
              </tr>
              <tr>
                <td>Weeks to deploy</td>
                <td>No audit trail</td>
                <td className="highlight">5-minute setup</td>
              </tr>
              <tr>
                <td>Complex maintenance</td>
                <td>Breaks silently</td>
                <td className="highlight">Self-healing</td>
              </tr>
              <tr>
                <td>Dedicated infra</td>
                <td>Hard to scale</td>
                <td className="highlight">Cloud-native</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="features" className={`features-section ${visibleSections.has('features') ? 'visible' : ''}`}>
        <div className="section-header">
          <span className="section-tag">// FEATURES</span>
          <h2>Everything You Need to Transfer Files with Confidence</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Scheduled Transfers</h3>
            <p>Set up recurring transfers with cron syntax. Jobs persist across restarts with full run history and error details.</p>
            <CodeBlock code={`mftctl jobs create --agent <agent-id> \\
  --schedule '0 2 * * *' \\
  --source ./data --dest sftp://backup/`} />
          </div>

          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Complete Audit Trail</h3>
            <p>Every transfer logged with source, destination, protocol, bytes, duration, and SHA-256 checksum verification.</p>
            <CodeBlock code="mftctl transfers list --status completed --limit 50" />
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Enterprise Security</h3>
            <p>AES-256-GCM encryption, OS keychain integration, private keys never transmitted, zero-knowledge architecture.</p>
            <CodeBlock code="# Credentials stored in OS keychain\n# Never transmitted or stored in plaintext" />
          </div>

          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Cross-Platform</h3>
            <p>Windows, macOS, Linux parity. ~5MB native bundle. System tray background operation. CLI + GUI interfaces.</p>
            <CodeBlock code={`# Download pre-built binary from
# https://github.com/ZeroClue/MFTxyz/releases
./mftctl login <api-key> --server http://localhost:3001`} />
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Multiple Protocols</h3>
            <p>SFTP, FTP, FTPS, and local file sync. One tool for all your transfer needs. Automatic retry on failure.</p>
            <CodeBlock code={`mftctl jobs create --agent <agent-id> \\
  --source sftp://files.example.com \\
  --dest ./local --protocol sftp`} />
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Self-Healing</h3>
            <p>Automatic retry with exponential backoff. Network interruptions don't mean failed transfers. Resume partial transfers.</p>
            <CodeBlock code="# Automatically retries on failure\n# Configurable max attempts and delays" />
          </div>
        </div>
      </section>

      <section id="how-it-works" className={`how-section ${visibleSections.has('how-it-works') ? 'visible' : ''}`}>
        <div className="section-header">
          <span className="section-tag">// HOW IT WORKS</span>
          <h2>Up and Running in Minutes</h2>
        </div>

        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Download</h3>
              <p>Get the 5MB installer for your platform. No server setup required.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Configure</h3>
              <p>Create transfers with our CLI or GUI. Set sources, destinations, and schedules.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Transfer</h3>
              <p>Let MFTPlus handle the rest. Monitor progress and review logs anytime.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className={`pricing-section ${visibleSections.has('pricing') ? 'visible' : ''}`}>
        <div className="section-header">
          <span className="section-tag">// PRICING</span>
          <h2>Simple, Transparent Pricing</h2>
          <p>Per-seat pricing that scales with your team. No per-server fees.</p>
        </div>

        <div className="pricing-container">
          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Community</h3>
              <div className="pricing-status">Free</div>
            </div>
            <div className="pricing-price">
              <span className="price-value">$0</span>
              <span className="price-period">forever</span>
            </div>
            <ul className="pricing-features">
              <li>✓ Up to 5 managed transfers</li>
              <li>✓ SFTP, FTP, FTPS protocols</li>
              <li>✓ Complete audit trail</li>
              <li>✓ Command-line interface</li>
              <li>✓ Community support</li>
            </ul>
            <a href="#contact" className="pricing-cta">Get Started</a>
          </div>

          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Starter</h3>
              <div className="pricing-status">Popular</div>
            </div>
            <div className="pricing-price">
              <span className="price-value">$150</span>
              <span className="price-period">/month</span>
            </div>
            <ul className="pricing-features">
              <li>✓ Everything in Community</li>
              <li>✓ Unlimited managed transfers</li>
              <li>✓ Scheduled transfers (cron)</li>
              <li>✓ Web dashboard</li>
              <li>✓ Email support</li>
            </ul>
            <a href="#contact" className="pricing-cta">Start Free Trial</a>
          </div>

          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Pro</h3>
              <div className="pricing-status">Best Value</div>
            </div>
            <div className="pricing-price">
              <span className="price-value">$499</span>
              <span className="price-period">/month</span>
            </div>
            <ul className="pricing-features">
              <li>✓ Everything in Starter</li>
              <li>✓ Team management</li>
              <li>✓ Centralized monitoring</li>
              <li>✓ API access</li>
              <li>✓ Priority support</li>
            </ul>
            <a href="#contact" className="pricing-cta">Start Free Trial</a>
          </div>

          <div className="pricing-card coming-soon">
            <div className="pricing-header">
              <h3>Enterprise</h3>
              <div className="pricing-status">Custom</div>
            </div>
            <div className="pricing-price">
              <span className="price-value">Custom</span>
            </div>
            <ul className="pricing-features">
              <li>✓ Everything in Pro</li>
              <li>✓ On-premise deployment</li>
              <li>✓ SSO/SAML integration</li>
              <li>✓ Custom integrations</li>
              <li>✓ Dedicated support & SLA</li>
            </ul>
            <a href="mailto:enterprise@mftplus.co.za" className="pricing-cta">Contact Sales</a>
          </div>
        </div>
      </section>

      <section id="contact" className={`contact-section ${visibleSections.has('contact') ? 'visible' : ''}`}>
        <div className="contact-container">
          <h2>Ready to Modernize Your File Transfers?</h2>
          <p>Get started with MFTPlus today and experience reliable, secure file transfers.</p>

          <a href="mailto:info@mftplus.co.za?subject=MFTPlus Inquiry" className="cta-large">
            Get Started
            <span className="cta-arrow">→</span>
          </a>

          <div className="contact-meta">
            <p>Questions? Email us at <a href="mailto:info@mftplus.co.za">info@mftplus.co.za</a></p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="mailto:info@mftplus.co.za">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="footer-copy">
            <p>© 2026 MFTPlus. Built with Rust + Tauri.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
