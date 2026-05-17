import { useEffect, useState } from 'react'
import './App.css'
import { CookieConsent } from './CookieConsent'

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
    <>
    <div className="app">
      <div className="background-effects">
        <div className="grid-pattern"></div>
        <div className="noise-overlay"></div>
      </div>

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="nav-logo">
            <img src="/brand-assets/logo-full-dark.svg" alt="MFTPlus" className="logo-img" />
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="/blog">Blog</a>
            <a href="/releases">Releases</a>
            <a href="https://dashboard.mftplus.co.za/checkout?plan=community&amp;utm_source=mft-site&amp;utm_medium=cta&amp;utm_campaign=signup" className="nav-cta-signup" data-umami-event="nav-signup">Sign Up</a>
          </div>
        </div>
      </nav>

      <section id="hero" className="hero-section">
        <div className="hero-content">

          <h1 className="hero-title">
            Managed File Transfer for DevOps Teams
          </h1>

          <p className="hero-subtitle">
            MFTPlus is a managed file transfer platform that automates file transfers between servers, SFTP endpoints, and cloud storage. A Rust-based agent connects to our managed server — no infrastructure to maintain. Built for teams replacing IBM Sterling, Globalscape, or GoAnywhere — without the enterprise price tag.
          </p>

          <div className="hero-cta">
            <a href="https://dashboard.mftplus.co.za/checkout?plan=community&amp;utm_source=mft-site&amp;utm_medium=cta&amp;utm_campaign=get-started" className="cta-primary cta-goldenrod" data-umami-event="hero-get-started">
              Get Started Free
              <span className="cta-arrow">→</span>
            </a>
            <a href="#how-it-works" className="cta-secondary" data-umami-event="hero-how-it-works">
              How It Works
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">20MB</span>
              <span className="stat-label">Agent Binary</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">&lt;5 min</span>
              <span className="stat-label">Setup Time</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">4+</span>
              <span className="stat-label">Protocols</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">9</span>
              <span className="stat-label">Live Features</span>
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
          <span className="section-tag">The Problem</span>
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
          <span className="section-tag">The Solution</span>
          <h2>What MFTPlus Does</h2>
          <p>A modern agent for secure, scheduled file transfers. Managed server — no infrastructure to maintain.</p>
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
          <span className="section-tag">Features</span>
          <h2>Everything You Need to Transfer Files with Confidence</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Scheduled Transfers</h3>
            <p>Set up recurring transfers with cron syntax. Jobs persist across restarts with full run history and error details. Manage from CLI or web dashboard.</p>
            <CodeBlock code={`mftctl jobs create --agent <agent-id> \\
  --schedule '0 2 * * *' \\
  --source ./data --dest sftp://backup/`} />
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>Natural Language Job Creation</h3>
            <p>Describe what you want in plain English. The AI parses your intent, selects the right agent, and creates the job. No CLI syntax to remember.</p>
            <CodeBlock code={`"Transfer daily reports from server A to
SFTP backup every night at 2am"`} />
          </div>

          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Audit Trail</h3>
            <p>Every transfer logged with source, destination, protocol, bytes, duration, and SHA-256 checksum. Export to CSV or PDF for compliance.</p>
            <CodeBlock code="mftctl transfers list --status completed --limit 50" />
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Automatic Retry</h3>
            <p>Exponential backoff on transient failures. Configurable max retries and delays. Network interruptions don't mean lost transfers.</p>
            <CodeBlock code={`mftctl jobs create --agent <agent-id> \\
  --source sftp://files.example.com \\
  --dest ./local --max-retries 5`} />
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Web Dashboard</h3>
            <p>Monitor agents, manage jobs, review transfer history, and configure webhooks from a centralized dashboard. Admin and user views.</p>
            <CodeBlock code={`# Real-time agent heartbeat monitoring
# Transfer queue management
# Webhook notifications on events`} />
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>IP Allowlist</h3>
            <p>Restrict agent access to known IP addresses. Prevent unauthorized connections even with valid credentials.</p>
            <CodeBlock code="# IP allowlist configured per customer
# Agents outside allowlist are rejected" />
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Webhooks</h3>
            <p>Receive real-time notifications on transfer events — completed, failed, retried. Integrate with Slack, PagerDuty, or custom endpoints.</p>
            <CodeBlock code={`# Configure webhook URLs in dashboard
# Receive POST on transfer events`} />
          </div>

          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Transfer Templates</h3>
            <p>Save common transfer configurations as reusable templates. Standardize setups across agents and reduce configuration errors.</p>
            <CodeBlock code={`# Create templates for recurring patterns
# Apply to new jobs in one click`} />
          </div>

          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Cross-Platform Agent</h3>
            <p>Linux CLI available now. Windows and macOS coming soon. ~20MB Rust binary with heartbeat monitoring and background operation.</p>
            <CodeBlock code={`./mftctl login <api-key>
./mftctl jobs create --source ./data --dest sftp://server/`} />
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Network Discovery</h3>
            <p>Find shadow IT file transfers across your enterprise. Scans Linux and Windows machines for scheduled tasks, scripts, and saved credentials. Auto-detects SFTP, FTP, SCP, Rsync, and more. <a href="https://docs.mftplus.co.za/guide/network-discovery" target="_blank" rel="noopener noreferrer">Learn more →</a></p>
            <CodeBlock code={`# Scan enterprise networks for file transfer configurations
# Detects SFTP, FTP, SCP, Rsync across Linux and Windows`} />
          </div>

          <div className="feature-card">
            <div className="feature-icon">👁️</div>
            <h3>Transfer Triggers</h3>
            <p>Watch directories and automatically transfer files when they arrive. Glob patterns, debouncing, and dynamic destination templates.</p>
            <CodeBlock code={`mftctl trigger create --watch /data/incoming \\
  --glob "*.csv" \\
  --dest "sftp://partner/inbox/{{filename}}"`} />
          </div>
        </div>
      </section>

      <section id="how-it-works" className={`how-section ${visibleSections.has('how-it-works') ? 'visible' : ''}`}>
        <div className="section-header">
          <span className="section-tag">How It Works</span>
          <h2>Agent, Server, Dashboard</h2>
        </div>

        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Download</h3>
              <p>Get the agent binary for your platform. No server setup required — we manage the infrastructure.</p>
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
          <span className="section-tag">Pricing</span>
          <h2>Simple, Transparent Pricing</h2>
          <p>Flat monthly pricing. No per-server fees. Pick the plan that fits your needs.</p>
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
            <a href="https://dashboard.mftplus.co.za/checkout?plan=community&amp;utm_source=mft-site&amp;utm_medium=cta&amp;utm_campaign=pricing" className="pricing-cta cta-goldenrod" data-umami-event="pricing-community">Get Started</a>
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
            <a href="https://dashboard.mftplus.co.za/checkout?plan=starter&amp;utm_source=mft-site&amp;utm_medium=cta&amp;utm_campaign=pricing" className="pricing-cta cta-goldenrod" data-umami-event="pricing-starter">Start Free Trial</a>
          </div>

          <div className="pricing-card coming-soon">
            <div className="pricing-header">
              <h3>Pro</h3>
              <div className="pricing-status">Coming Soon</div>
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
            <span className="pricing-cta">Coming Soon</span>
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
            <a href="mailto:enterprise@mftplus.co.za" className="pricing-cta" data-umami-event="pricing-enterprise">Contact Sales</a>
          </div>
        </div>
      </section>

      <section id="comparison" className={`comparison-section ${visibleSections.has('comparison') ? 'visible' : ''}`}>
        <div className="section-header">
          <span className="section-tag">Comparison</span>
          <h2>MFTPlus vs Legacy MFT Vendors</h2>
          <p>See how MFTPlus compares to the leading managed file transfer platforms.</p>
        </div>

        <div className="comparison-table-wrapper">
          <table className="vendor-comparison-table">
            <thead>
              <tr>
                <th></th>
                <th className="highlight-col">MFTPlus</th>
                <th>IBM Sterling</th>
                <th>Globalscape EFT</th>
                <th>GoAnywhere</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Starting Price</td>
                <td className="highlight-col">$150/mo</td>
                <td>Custom (enterprise)</td>
                <td>~$3,000/yr</td>
                <td>~$2,500/yr</td>
              </tr>
              <tr>
                <td>Deployment</td>
                <td className="highlight-col">Managed server + agent</td>
                <td>Java server, weeks</td>
                <td>Windows server</td>
                <td>Java VM required</td>
              </tr>
              <tr>
                <td>Setup Time</td>
                <td className="highlight-col">~5 minutes</td>
                <td>2-4 weeks</td>
                <td>1-2 days</td>
                <td>1-3 days</td>
              </tr>
              <tr>
                <td>Language</td>
                <td className="highlight-col">Rust</td>
                <td>Java</td>
                <td>C# / .NET</td>
                <td>Java</td>
              </tr>
              <tr>
                <td>Hosting</td>
                <td className="highlight-col">Managed (self-hosted coming)</td>
                <td>On-prem</td>
                <td>On-prem</td>
                <td>On-prem</td>
              </tr>
              <tr>
                <td>Protocols</td>
                <td className="highlight-col">SFTP, FTP, FTPS, local</td>
                <td>SFTP, FTPS, HTTPS, AS2</td>
                <td>SFTP, FTPS, HTTPS</td>
                <td>SFTP, FTPS, HTTPS, AS2</td>
              </tr>
              <tr>
                <td>Agent Size</td>
                <td className="highlight-col">~20MB</td>
                <td>~2GB+</td>
                <td>~500MB</td>
                <td>~1GB+</td>
              </tr>
              <tr>
                <td>Audit Trail</td>
                <td className="highlight-col">Built-in, all plans</td>
                <td>Add-on module</td>
                <td>Built-in</td>
                <td>Built-in</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="faq" className={`faq-section ${visibleSections.has('faq') ? 'visible' : ''}`}>
        <div className="section-header">
          <span className="section-tag">FAQ</span>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="faq-list">
          <details className="faq-item">
            <summary>What is managed file transfer?</summary>
            <p>Managed file transfer (MFT) is software that automates, secures, and monitors file transfers between systems. Unlike manual FTP clients or custom scripts, MFT provides scheduling, retry logic, audit trails, and encryption — giving teams visibility and compliance without the operational overhead.</p>
          </details>

          <details className="faq-item">
            <summary>Is MFTPlus open source?</summary>
            <p>MFTPlus is not open source. It is a commercial product with a free Community tier that supports up to 5 managed transfers. The Starter plan ($150/month) adds unlimited transfers, scheduling, and the web dashboard. All plans include the full feature set — no gated security or protocol features.</p>
          </details>

          <details className="faq-item">
            <summary>How is MFTPlus different from IBM Sterling?</summary>
            <p>MFTPlus is a lightweight alternative to IBM Sterling. The Rust-based agent is ~20MB versus Sterling's 2GB+ Java stack. MFTPlus manages the server for you — no infrastructure to maintain. Setup takes minutes instead of weeks. MFTPlus starts at $150/month with flat pricing, while Sterling requires enterprise licensing negotiations. For teams that need reliable scheduled transfers with audit trails, MFTPlus covers the core use case at a fraction of the cost.</p>
          </details>

          <details className="faq-item">
            <summary>Can MFTPlus replace GoAnywhere?</summary>
            <p>For standard transfer automation — scheduled SFTP jobs, audit logging, multi-protocol support — yes. MFTPlus provides a managed server with a Rust agent, versus GoAnywhere's self-hosted Java VM requirement. MFTPlus starts at $150/month versus GoAnywhere's ~$2,500/year pricing. GoAnywhere has broader protocol support (AS2, HTTPS) for now; MFTPlus focuses on SFTP, FTP, and FTPS with more protocols on the roadmap.</p>
          </details>

          <details className="faq-item">
            <summary>How long does it take to deploy MFTPlus?</summary>
            <p>The agent is a single ~20MB binary — download, run the login command with your API key, and you're connected to our managed server. Most teams complete their first file transfer within 5 minutes. No Java runtime, no database setup, no server infrastructure to configure. Self-hosted server option coming soon for teams that need on-premise deployment.</p>
          </details>
        </div>
      </section>

      <section id="contact" className={`contact-section ${visibleSections.has('contact') ? 'visible' : ''}`}>
        <div className="contact-container">
          <h2>Ready to Modernize Your File Transfers?</h2>
          <p>Get started with MFTPlus today and experience reliable, secure file transfers.</p>

          <a href="mailto:info@mftplus.co.za?subject=MFTPlus Inquiry" className="cta-large" data-umami-event="contact-get-started">
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
            <a href="/blog">Blog</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
          <div className="footer-copy">
            <p>© 2026 MFTPlus. Built with Rust + Tauri.</p>
          </div>
        </div>
      </footer>
    </div>
    <CookieConsent />
    </>
  )
}

export default App
