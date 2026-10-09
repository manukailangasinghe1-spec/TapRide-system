
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowRight,
  BusFront,
  Check,
  CircleHelp,
  CreditCard,
  Menu,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
  WifiOff,
  Users,
  BarChart3,
  ReceiptText,
  Database,
  Mail,
  Code2,
  Server,
  ScanLine,
  Banknote,
  CarFront,
} from 'lucide-react'

const features = [
  {
    icon: Wallet,
    title: 'Universal Stored-Value Wallet',
    text: 'One wallet across every registered private bus.',
  },
  {
    icon: QrCode,
    title: 'QR Entry & Exit Validation',
    text: 'Fast boarding and alighting with QR validation.',
  },
  {
    icon: RefreshCw,
    title: 'Maximum-Fare Hold & Reconciliation',
    text: 'Hold the maximum fare, then settle the actual fare.',
  },
  {
    icon: Database,
    title: 'Offline-First Operation',
    text: 'Store transactions locally and synchronize later.',
  },
  {
    icon: BusFront,
    title: 'Fleet & Crew Management',
    text: 'Manage buses, drivers, conductors and assignments.',
  },
  {
    icon: BarChart3,
    title: 'Revenue & Settlement Reports',
    text: 'Track fares, transactions and settlements.',
  },
]

const steps = [
  {
    number: '01',
    icon: Wallet,
    title: 'Top Up',
    text: 'Add funds securely to your wallet.',
  },
  {
    number: '02',
    icon: ScanLine,
    title: 'Scan to Board',
    text: 'Scan Entry QR and place a maximum-fare hold.',
  },
  {
    number: '03',
    icon: BusFront,
    title: 'Travel',
    text: 'Your journey remains valid during connectivity loss.',
  },
  {
    number: '04',
    icon: ReceiptText,
    title: 'Scan to Exit',
    text: 'Settle the actual fare and release the unused hold.',
  },
]

const fallbacks = [
  {
    title: 'Dynamic QR scan',
    detail: 'Normal operation',
    icon: QrCode,
  },
  {
    title: 'Static / printed QR',
    detail: 'When display fails',
    icon: Smartphone,
  },
  {
    title: 'Conductor-assisted scan',
    detail: 'Passenger needs help',
    icon: Users,
  },
  {
    title: 'Alternative validation',
    detail: 'When QR is unavailable',
    icon: ShieldCheck,
  },
  {
    title: 'Manual cash ticket',
    detail: 'System-wide fallback',
    icon: Banknote,
  },
]

const roles = [
  {
    number: '01',
    title: 'Passenger',
    text: 'Wallet, top-up, QR boarding, history',
    icon: Wallet,
  },
  {
    number: '02',
    title: 'Conductor',
    text: 'Assisted scans, cash tickets, sync',
    icon: QrCode,
  },
  {
    number: '03',
    title: 'Driver',
    text: 'Assigned bus and trip information',
    icon: CarFront,
  },
  {
    number: '04',
    title: 'Bus Owner',
    text: 'Fleet, crew and revenue reports',
    icon: BusFront,
  },
  {
    number: '05',
    title: 'Administrator',
    text: 'Routes, fares, users and oversight',
    icon: ShieldCheck,
  },
]

const technologies = [
  { icon: Code2, name: 'React + TypeScript PWA' },
  { icon: Server, name: 'FastAPI (Python)' },
  { icon: Database, name: 'PostgreSQL' },
  { icon: CreditCard, name: 'Stripe Sandbox' },
  { icon: QrCode, name: 'QR Generation & Scanning' },
  { icon: Database, name: 'IndexedDB Offline Queue' },
  { icon: Mail, name: 'Brevo Email Receipts' },
  { icon: Code2, name: 'Docker' },
]

function WalletPreview({
  onAction,
}: {
  onAction: (action: string) => void
}) {
  return (
    <div
      className="wallet-scene"
      aria-label="Interactive TapRide wallet preview"
    >
      <div className="float-note note-top">
        <span className="note-dot green" />
        <span>
          <b>Maximum fare hold</b>
          <small>Protected at boarding</small>
        </span>
      </div>

      <div className="wallet-card">
        <div className="wallet-head">
          <div className="mini-brand">
            <span className="brand-mark small">T</span>
            <span>TapRide</span>
          </div>

          <span className="active-pill">
            <i /> Active
          </span>
        </div>

        <p className="greeting">Good morning</p>
        <h3>Hello, Passenger</h3>

        <div className="balance-box">
          <span>AVAILABLE WALLET BALANCE</span>
          <strong>Rs. 2,450.00</strong>
          <div>
            <span className="balance-status">
              <i /> Available balance
            </span>
            <span className="balance-chip">LKR</span>
          </div>
        </div>

        <div className="wallet-actions">
          <button
            onClick={() =>
              onAction(
                'QR scanner demo opened. Camera access and live ticket validation will be connected later.',
              )
            }
          >
            <QrCode />
            <span>Scan QR</span>
          </button>

          <button
            onClick={() =>
              onAction(
                'Top-up demo selected. Payment processing will be connected later.',
              )
            }
          >
            <Wallet />
            <span>Top Up</span>
          </button>

          <button
            onClick={() =>
              onAction(
                'Your journey preview is ready. Live trip data will be connected later.',
              )
            }
          >
            <BusFront />
            <span>Travel</span>
          </button>

          <button
            onClick={() =>
              onAction(
                'Help centre preview selected. Support integration will be added later.',
              )
            }
          >
            <CircleHelp />
            <span>Help</span>
          </button>
        </div>

        <div className="activity-title">
          <b>Recent activity</b>
          <button
            onClick={() =>
              onAction(
                'Showing the three sample transactions in this prototype.',
              )
            }
          >
            View all <ArrowRight />
          </button>
        </div>

        <div className="activity-row">
          <span className="activity-icon fare">
            <BusFront />
          </span>
          <span className="activity-label">
            <b>Bus Fare · Route 138</b>
            <small>Today, 8:42 AM</small>
          </span>
          <strong className="negative">− Rs. 85.00</strong>
        </div>

        <div className="activity-row">
          <span className="activity-icon topup">
            <Wallet />
          </span>
          <span className="activity-label">
            <b>Wallet Top Up</b>
            <small>Today, 8:15 AM</small>
          </span>
          <strong className="positive">+ Rs. 1,000</strong>
        </div>

        <div className="activity-row">
          <span className="activity-icon released">
            <RefreshCw />
          </span>
          <span className="activity-label">
            <b>Hold Released</b>
            <small>Yesterday, 6:10 PM</small>
          </span>
          <strong className="positive">+ Rs. 148</strong>
        </div>
      </div>

      <div className="float-note note-bottom">
        <span className="sync-symbol">
          <RefreshCw />
        </span>
        <span>
          <b>Offline queue cleared</b>
          <small>
            <Check /> Journey completed · Rs. 52.00 settled
          </small>
        </span>
      </div>
    </div>
  )
}

export const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const showNotice = (message: string) => setNotice(message)
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="tapride-page">
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#home"
            onClick={closeMenu}
            aria-label="TapRide home"
          >
            <span className="brand-mark">T</span>
            <span>TapRide</span>
          </a>

          <nav
            className={`desktop-nav ${menuOpen ? 'nav-open' : ''}`}
            aria-label="Main navigation"
          >
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#how-it-works" onClick={closeMenu}>
              How it works
            </a>
            <a href="#offline" onClick={closeMenu}>Offline First</a>
            <a href="#roles" onClick={closeMenu}>About</a>

            <div className="mobile-nav-actions">
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Link
                to="/register"
                className="nav-cta"
                onClick={closeMenu}
              >
                Get Started
              </Link>
            </div>
          </nav>

          <div className="header-actions">
            <Link className="nav-login" to="/login">Login</Link>
            <Link className="nav-cta" to="/register">Get Started</Link>
          </div>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={
              menuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />

          <div className="hero-inner">
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow">
                <span className="live-dot" />
                ACADEMIC PROTOTYPE
              </div>

              <h1>
                One wallet.
                <br />
                Every bus.
                <br />
                <span>Zero cash hassle.</span>
              </h1>

              <p>
                TapRide replaces route-specific paper passes and cash
                ticketing with a universal stored-value wallet, QR
                validation and offline-first fare reconciliation for
                private bus networks.
              </p>

              <div className="hero-buttons">
                <Link className="button button-white" to="/register">
                  Get Started <ArrowRight />
                </Link>
                <a
                  className="button button-outline"
                  href="#how-it-works"
                >
                  See how it works <ArrowDownRight />
                </a>
              </div>

              <div className="hero-trust">
                <span><ShieldCheck /> Secure wallet</span>
                <span><WifiOff /> Offline-ready</span>
                <span><QrCode /> QR validation</span>
              </div>
            </div>

            <WalletPreview onAction={showNotice} />
          </div>

          <a className="scroll-cue" href="#features">
            <span /> Scroll to explore
          </a>
        </section>

        <section className="section features-section" id="features">
          <div className="section-heading">
            <span className="eyebrow">FEATURES</span>
            <h2>Everything a private bus network needs</h2>
            <p>
              From passenger wallets to owner settlements — one PWA,
              five roles, no app store required.
            </p>
          </div>

          <div className="feature-grid">
            {features.map(({ icon: Icon, title, text }) => (
              <article className="feature-card" key={title}>
                <span className="feature-icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="card-arrow"><ArrowRight /></span>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section journey-section"
          id="how-it-works"
        >
          <div className="section-heading">
            <span className="eyebrow">PASSENGER JOURNEY</span>
            <h2>From tap to receipt in four steps</h2>
            <p>
              A complete journey lifecycle designed for speed and
              accuracy.
            </p>
          </div>

          <div className="journey-grid">
            {steps.map(({ number, icon: Icon, title, text }) => (
              <article className="journey-card" key={number}>
                <div className="step-top">
                  <span className="step-icon"><Icon /></span>
                  <span className="step-number">{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="step-line" />
              </article>
            ))}
          </div>
        </section>

        <section className="section fares-section" id="fares">
          <div className="fares-inner">
            <div className="fares-copy">
              <span className="eyebrow">FAIR FARES</span>
              <h2>Never overpay for a short ride again</h2>
              <p>
                TapRide holds a configurable maximum fare at boarding
                and reconciles against the actual stage fare at exit.
              </p>

              <ul className="check-list">
                <li><Check /> Stage-based fare calculation</li>
                <li><Check /> Unused hold released automatically</li>
                <li><Check /> Digital receipt for every trip</li>
                <li><Check /> Administrator-controlled fare tables</li>
              </ul>
            </div>

            <div className="receipt-card">
              <div className="receipt-heading">
                <span className="receipt-icon"><ReceiptText /></span>
                <div>
                  <span>RECONCILIATION EXAMPLE</span>
                  <b>Your trip, settled fairly</b>
                </div>
                <span className="receipt-status"><Check /></span>
              </div>

              <div className="receipt-line">
                <span>Wallet before boarding</span>
                <strong>Rs. 1,250.00</strong>
              </div>

              <div className="receipt-line muted">
                <span>Maximum fare hold</span>
                <strong>− Rs. 300.00</strong>
              </div>

              <div className="receipt-line">
                <span>Actual fare</span>
                <strong>Rs. 244.00</strong>
              </div>

              <div className="receipt-line positive-line">
                <span>Unused balance released</span>
                <strong>+ Rs. 56.00</strong>
              </div>

              <div className="receipt-total">
                <span>Wallet after settlement</span>
                <strong>Rs. 1,056.00</strong>
              </div>

              <div className="receipt-success">
                <Check /> Hold released — receipt sent
              </div>
            </div>
          </div>
        </section>

        <section className="section offline-section" id="offline">
          <div className="offline-inner">
            <div className="offline-copy">
              <span className="eyebrow eyebrow-light">
                BUILT FOR RURAL ROADS
              </span>
              <h2>Offline-first, with fallback continuity</h2>
              <p>
                Weak signal should not stop a bus. TapRide queues
                transactions locally with unique IDs and synchronizes
                automatically when connectivity returns.
              </p>

              <div className="offline-points">
                <span><WifiOff /> Works through weak signal</span>
                <span><RefreshCw /> Syncs when connected</span>
              </div>
            </div>

            <div className="fallback-list">
              {fallbacks.map(({ title, detail, icon: Icon }, i) => (
                <div className="fallback-row" key={title}>
                  <span className="fallback-icon"><Icon /></span>
                  <span className="fallback-name">
                    <b>{title}</b>
                    <small>{detail}</small>
                  </span>
                  <span className="fallback-number">
                    0{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section roles-section" id="roles">
          <div className="section-heading">
            <span className="eyebrow">ONE PLATFORM, EVERY ROLE</span>
            <h2>Built for everyone on the road</h2>
            <p>
              Purpose-built tools for every part of the bus journey.
            </p>
          </div>

          <div className="roles-grid">
            {roles.map(({ number, title, text, icon: Icon }) => (
              <article className="role-card" key={title}>
                <span className="role-number">{number}</span>
                <span className="role-icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section technology-section"
          id="technology"
        >
          <div className="section-heading">
            <span className="eyebrow">TECHNOLOGY</span>
            <h2>A modern, practical stack</h2>
            <p>
              Built with proven technologies for a responsive,
              resilient transit experience.
            </p>
          </div>

          <div className="technology-grid">
            {technologies.map(({ icon: Icon, name }) => (
              <div className="technology-item" key={name}>
                <Icon />
                <span>{name}</span>
                <Check className="tech-check" />
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-glow" />
          <div className="cta-content">
            <span className="eyebrow eyebrow-light">
              READY TO RIDE SMARTER?
            </span>
            <h2>
              Your next ride,
              <br className="mobile-break" /> made simpler.
            </h2>
            <p>
              Digital wallet <span>·</span> QR validation <span>·</span>
              Offline-first <span>·</span> Fleet management
            </p>

            <div className="cta-buttons">
              <Link className="button button-white" to="/register">
                Try the Prototype <ArrowRight />
              </Link>
              <a className="button button-outline" href="#technology">
                View Documentation <ArrowDownRight />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <a className="brand brand-footer" href="#home">
              <span className="brand-mark">T</span>
              <span>TapRide</span>
            </a>
            <p>Digital Wallet &amp; Bus Management System</p>
            <small>
              Academic Prototype · Group 04 · OUSL · EER4189
            </small>
          </div>

          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#technology">Technology</a>
            <Link to="/login">Login</Link>
          </div>

          <span className="footer-copyright">
            © 2026 TapRide · Group 04
          </span>
        </div>
      </footer>

      {notice && (
        <div className="demo-notice" role="status">
          <span className="notice-icon"><Check /></span>
          <p>{notice}</p>
          <button
            onClick={() => setNotice('')}
            aria-label="Dismiss message"
          >
            <X />
          </button>
        </div>
      )}
    </div>
  )
}

export default LandingPage
