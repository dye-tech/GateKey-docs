import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/quickstart">
            Get Started →
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="https://github.com/dye-tech/GateKey">
            View on GitHub
          </Link>
        </div>
        <div className={styles.installCommand}>
          <code>brew tap dye-tech/gatekey && brew install gatekey</code>
        </div>
      </div>
    </header>
  );
}

type FeatureItem = {
  title: string;
  icon: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Zero Trust Security',
    icon: '🔐',
    description: (
      <>
        Every connection is authenticated and authorized. Short-lived certificates
        auto-expire, and per-user firewall rules enforce least-privilege access.
      </>
    ),
  },
  {
    title: 'SSO Integration',
    icon: '🔑',
    description: (
      <>
        Integrate with Okta, Azure AD, Google Workspace, or any OIDC/SAML provider.
        No separate VPN passwords—users authenticate with their existing credentials.
      </>
    ),
  },
  {
    title: 'Dual Protocol Support',
    icon: '🌐',
    description: (
      <>
        Choose between OpenVPN for maximum compatibility or WireGuard for peak
        performance. Both protocols use the same zero-trust security model.
      </>
    ),
  },
  {
    title: 'Multi-Gateway',
    icon: '🔗',
    description: (
      <>
        Connect to multiple VPN gateways simultaneously with automatic interface
        management. Access resources across different networks without reconnecting.
      </>
    ),
  },
  {
    title: 'Mesh Networking',
    icon: '🕸️',
    description: (
      <>
        Hub-and-spoke topology for site-to-site connectivity. Connect remote offices
        through a central mesh hub with zero-trust access controls.
      </>
    ),
  },
  {
    title: 'Kubernetes Native',
    icon: '☸️',
    description: (
      <>
        Deploy with Helm in minutes. GateKey integrates seamlessly with your
        Kubernetes infrastructure and can store secrets natively in the cluster.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="feature-card">
        <div className={styles.featureIcon}>{icon}</div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

// CLI Demo with animated terminal
const cliDemoLines = [
  { prompt: true, text: 'gatekey login', delay: 0 },
  { prompt: false, text: 'Authenticating with GateKey server...', delay: 800 },
  { prompt: false, text: 'Opening browser for authentication...', delay: 1400 },
  { prompt: false, text: 'Waiting for authentication...', delay: 2000 },
  { prompt: false, text: '', delay: 3500 },
  { prompt: false, text: '\x1b[32mAuthentication successful!\x1b[0m', delay: 3600, success: true },
  { prompt: false, text: 'Logged in as: jesse@example.com', delay: 3800 },
  { prompt: true, text: 'gatekey list', delay: 5000 },
  { prompt: false, text: 'Available Gateways:', delay: 5400 },
  { prompt: false, text: '-------------------', delay: 5500 },
  { prompt: false, text: '✓ gateway [openvpn]', delay: 5600, success: true },
  { prompt: false, text: '  Public IP:   203.0.113.45', delay: 5700 },
  { prompt: false, text: '  Status:      online', delay: 5800, success: true },
  { prompt: false, text: '', delay: 5900 },
  { prompt: false, text: '✓ hub [wireguard-mesh]', delay: 6000, success: true },
  { prompt: false, text: '  Public IP:   198.51.100.22', delay: 6100 },
  { prompt: false, text: '  Status:      online', delay: 6200, success: true },
  { prompt: true, text: 'gatekey connect hub', delay: 7500 },
  { prompt: false, text: 'Found mesh hub \'hub\', connecting...', delay: 7900 },
  { prompt: false, text: 'Connecting to WireGuard mesh hub hub...', delay: 8200 },
  { prompt: false, text: '[#] ip link add dev wg0 type wireguard', delay: 8600, dim: true },
  { prompt: false, text: '[#] wg setconf wg0 /dev/fd/63', delay: 8800, dim: true },
  { prompt: false, text: '[#] ip -4 address add 172.30.0.4/32 dev wg0', delay: 9000, dim: true },
  { prompt: false, text: '[#] ip link set mtu 1420 up dev wg0', delay: 9200, dim: true },
  { prompt: false, text: '[#] ip -4 route add 192.168.50.0/23 dev wg0', delay: 9400, dim: true },
  { prompt: false, text: 'Connected to mesh hub hub (Interface: wg0)', delay: 9800, success: true },
  { prompt: false, text: 'WireGuard mesh VPN connection established.', delay: 10000 },
  { prompt: true, text: 'gatekey status', delay: 11500 },
  { prompt: false, text: 'Status: Connected', delay: 11900, success: true },
  { prompt: false, text: 'Gateway:      mesh:hub', delay: 12000 },
  { prompt: false, text: 'Type:         wireguard', delay: 12100 },
  { prompt: false, text: 'Interface:    wg0', delay: 12200 },
  { prompt: false, text: 'Local IP:     172.30.0.4', delay: 12300 },
  { prompt: false, text: 'Transfer:     ↓ 12.9 KB  ↑ 12.1 KB', delay: 12400 },
];

function CLIDemo(): JSX.Element {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [currentChar, setCurrentChar] = useState<number>(0);

  useEffect(() => {
    if (visibleLines >= cliDemoLines.length) {
      // Reset after a pause
      const resetTimer = setTimeout(() => {
        setVisibleLines(0);
        setCurrentChar(0);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }

    const currentLine = cliDemoLines[visibleLines];
    const delay = visibleLines === 0 ? 1000 : (cliDemoLines[visibleLines]?.delay - (cliDemoLines[visibleLines - 1]?.delay || 0));

    const timer = setTimeout(() => {
      setVisibleLines(v => v + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [visibleLines]);

  return (
    <section className={styles.cliDemo}>
      <div className="container">
        <Heading as="h2">See It In Action</Heading>
        <p className={styles.cliDemoSubtitle}>
          Connect to your VPN in seconds with the GateKey CLI
        </p>
        <div className={styles.terminalWrapper}>
          <div className={styles.terminalHeader}>
            <div className={styles.terminalButtons}>
              <span className={styles.terminalButtonRed}></span>
              <span className={styles.terminalButtonYellow}></span>
              <span className={styles.terminalButtonGreen}></span>
            </div>
            <span className={styles.terminalTitle}>Terminal</span>
          </div>
          <div className={styles.terminalBody}>
            {cliDemoLines.slice(0, visibleLines).map((line, idx) => (
              <div key={idx} className={styles.terminalLine}>
                {line.prompt ? (
                  <>
                    <span className={styles.terminalPromptUser}>jesse</span>
                    <span className={styles.terminalPromptAt}> ~ </span>
                    <span className={styles.terminalPromptArrow}>➜ </span>
                    <span className={styles.terminalCommand}>{line.text}</span>
                  </>
                ) : (
                  <span className={clsx(
                    styles.terminalOutput,
                    line.success && styles.terminalSuccess,
                    line.dim && styles.terminalDim
                  )}>
                    {line.text}
                  </span>
                )}
              </div>
            ))}
            <div className={styles.terminalCursor}>▋</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageQuickStart(): JSX.Element {
  return (
    <section className={styles.quickStart}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <Heading as="h2">Quick Start</Heading>
            <p className={styles.quickStartSubtitle}>
              Get connected in under a minute
            </p>
          </div>
          <div className="col col--6">
            <div className="terminal">
              <p><span className="terminal-comment"># Install the client</span></p>
              <p><span className="terminal-prompt">$</span> <span className="terminal-command">brew install gatekey</span></p>
              <p></p>
              <p><span className="terminal-comment"># Configure your server</span></p>
              <p><span className="terminal-prompt">$</span> <span className="terminal-command">gatekey config init --server https://vpn.company.com</span></p>
              <p></p>
              <p><span className="terminal-comment"># Login with SSO</span></p>
              <p><span className="terminal-prompt">$</span> <span className="terminal-command">gatekey login</span></p>
              <p></p>
              <p><span className="terminal-comment"># Connect to VPN</span></p>
              <p><span className="terminal-prompt">$</span> <span className="terminal-command">gatekey connect</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchitectureSVG(): JSX.Element {
  return (
    <svg viewBox="0 0 900 520" className={styles.architectureSvg}>
      <defs>
        {/* Gradients */}
        <linearGradient id="controlPlaneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.3"/>
        </linearGradient>
        <linearGradient id="gatewayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#059669" stopOpacity="0.3"/>
        </linearGradient>
        <linearGradient id="componentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05"/>
        </linearGradient>
        {/* Arrow marker */}
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa"/>
        </marker>
        {/* Glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Control Plane Box */}
      <g>
        <rect x="100" y="20" width="700" height="200" rx="12" fill="url(#controlPlaneGrad)" stroke="#3b82f6" strokeWidth="2"/>
        <text x="450" y="50" textAnchor="middle" fill="#60a5fa" fontSize="14" fontWeight="bold" letterSpacing="2">GATEKEY CONTROL PLANE</text>

        {/* Web UI */}
        <g transform="translate(150, 70)">
          <rect width="140" height="70" rx="8" fill="url(#componentGrad)" stroke="#60a5fa" strokeWidth="1.5"/>
          <text x="70" y="30" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="600">Web UI</text>
          <text x="70" y="50" textAnchor="middle" fill="#94a3b8" fontSize="11">(React)</text>
        </g>

        {/* REST API */}
        <g transform="translate(330, 70)">
          <rect width="140" height="70" rx="8" fill="url(#componentGrad)" stroke="#60a5fa" strokeWidth="1.5"/>
          <text x="70" y="30" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="600">REST API</text>
          <text x="70" y="50" textAnchor="middle" fill="#94a3b8" fontSize="11">(Go)</text>
        </g>

        {/* Embedded CA */}
        <g transform="translate(510, 70)">
          <rect width="140" height="70" rx="8" fill="url(#componentGrad)" stroke="#60a5fa" strokeWidth="1.5"/>
          <text x="70" y="30" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="600">Embedded CA</text>
          <text x="70" y="50" textAnchor="middle" fill="#94a3b8" fontSize="11">(PKI)</text>
        </g>

        {/* PostgreSQL */}
        <g transform="translate(250, 160)">
          <rect width="300" height="45" rx="8" fill="url(#componentGrad)" stroke="#60a5fa" strokeWidth="1.5"/>
          <text x="150" y="28" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="600">PostgreSQL</text>
        </g>

        {/* Connection lines within control plane */}
        <line x1="400" y1="140" x2="400" y2="160" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4"/>
      </g>

      {/* Connection lines from control plane to gateways */}
      <path d="M 350 220 L 350 270 L 250 270 L 250 300" stroke="#60a5fa" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
      <path d="M 550 220 L 550 270 L 650 270 L 650 300" stroke="#60a5fa" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>

      {/* API Label */}
      <text x="450" y="265" textAnchor="middle" fill="#60a5fa" fontSize="11">REST API</text>

      {/* OpenVPN Gateway */}
      <g>
        <rect x="100" y="300" width="300" height="200" rx="12" fill="url(#gatewayGrad)" stroke="#10b981" strokeWidth="2"/>
        <text x="250" y="330" textAnchor="middle" fill="#34d399" fontSize="14" fontWeight="bold" letterSpacing="1">OPENVPN GATEWAY</text>

        {/* OpenVPN Server */}
        <g transform="translate(120, 350)">
          <rect width="110" height="55" rx="6" fill="url(#componentGrad)" stroke="#34d399" strokeWidth="1.5"/>
          <text x="55" y="25" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="600">OpenVPN</text>
          <text x="55" y="42" textAnchor="middle" fill="#94a3b8" fontSize="10">Server</text>
        </g>

        {/* Gateway Agent */}
        <g transform="translate(250, 350)">
          <rect width="110" height="55" rx="6" fill="url(#componentGrad)" stroke="#34d399" strokeWidth="1.5"/>
          <text x="55" y="25" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="600">Gateway</text>
          <text x="55" y="42" textAnchor="middle" fill="#94a3b8" fontSize="10">Agent</text>
        </g>

        {/* Connection arrow */}
        <line x1="230" y1="377" x2="250" y2="377" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>

        {/* nftables Firewall */}
        <g transform="translate(120, 420)">
          <rect width="240" height="55" rx="6" fill="url(#componentGrad)" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="120" y="25" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="600">nftables Firewall</text>
          <text x="120" y="42" textAnchor="middle" fill="#94a3b8" fontSize="10">(Per-Identity Rules)</text>
        </g>
      </g>

      {/* WireGuard Gateway */}
      <g>
        <rect x="500" y="300" width="300" height="200" rx="12" fill="url(#gatewayGrad)" stroke="#10b981" strokeWidth="2"/>
        <text x="650" y="330" textAnchor="middle" fill="#34d399" fontSize="14" fontWeight="bold" letterSpacing="1">WIREGUARD GATEWAY</text>

        {/* WireGuard Server */}
        <g transform="translate(520, 350)">
          <rect width="110" height="55" rx="6" fill="url(#componentGrad)" stroke="#34d399" strokeWidth="1.5"/>
          <text x="55" y="25" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="600">WireGuard</text>
          <text x="55" y="42" textAnchor="middle" fill="#94a3b8" fontSize="10">Server</text>
        </g>

        {/* Gateway Agent */}
        <g transform="translate(650, 350)">
          <rect width="110" height="55" rx="6" fill="url(#componentGrad)" stroke="#34d399" strokeWidth="1.5"/>
          <text x="55" y="25" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="600">Gateway</text>
          <text x="55" y="42" textAnchor="middle" fill="#94a3b8" fontSize="10">Agent</text>
        </g>

        {/* Connection arrow */}
        <line x1="630" y1="377" x2="650" y2="377" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#arrowhead)"/>

        {/* nftables Firewall */}
        <g transform="translate(520, 420)">
          <rect width="240" height="55" rx="6" fill="url(#componentGrad)" stroke="#f59e0b" strokeWidth="1.5"/>
          <text x="120" y="25" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="600">nftables Firewall</text>
          <text x="120" y="42" textAnchor="middle" fill="#94a3b8" fontSize="10">(Per-Identity Rules)</text>
        </g>
      </g>
    </svg>
  );
}

function HomepageArchitecture(): JSX.Element {
  return (
    <section className={styles.architecture}>
      <div className="container">
        <Heading as="h2">Architecture</Heading>
        <p className={styles.architectureSubtitle}>
          Control plane + Gateway agents with per-identity firewall rules
        </p>
        <div className={styles.architectureDiagram}>
          <ArchitectureSVG />
        </div>
      </div>
    </section>
  );
}

function HomepageResources(): JSX.Element {
  return (
    <section className={styles.resources}>
      <div className="container">
        <Heading as="h2">Resources</Heading>
        <div className="row">
          <div className="col col--3">
            <Link to="/docs/getting-started/quickstart" className={styles.resourceCard}>
              <span className={styles.resourceIcon}>📖</span>
              <Heading as="h3">Documentation</Heading>
              <p>Learn how to install and configure GateKey</p>
            </Link>
          </div>
          <div className="col col--3">
            <Link to="https://github.com/dye-tech/gatekey-helm-chart" className={styles.resourceCard}>
              <span className={styles.resourceIcon}>☸️</span>
              <Heading as="h3">Helm Chart</Heading>
              <p>Deploy to Kubernetes with Helm</p>
            </Link>
          </div>
          <div className="col col--3">
            <Link to="/docs/api/overview" className={styles.resourceCard}>
              <span className={styles.resourceIcon}>🔌</span>
              <Heading as="h3">API Reference</Heading>
              <p>Integrate with the GateKey REST API</p>
            </Link>
          </div>
          <div className="col col--3">
            <Link to="https://github.com/dye-tech/GateKey" className={styles.resourceCard}>
              <span className={styles.resourceIcon}>💻</span>
              <Heading as="h3">GitHub</Heading>
              <p>View source code and contribute</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Zero Trust VPN`}
      description="Zero Trust VPN solution with SSO integration, short-lived certificates, and per-user firewall rules">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <CLIDemo />
        <HomepageQuickStart />
        <HomepageArchitecture />
        <HomepageResources />
      </main>
    </Layout>
  );
}
