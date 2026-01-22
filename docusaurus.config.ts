import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'GateKey',
  tagline: 'Zero Trust VPN - Authenticate First, Connect Second',
  favicon: 'img/favicon.svg',

  url: 'https://gatekey.net',
  baseUrl: '/',

  organizationName: 'dye-tech',
  projectName: 'GateKey',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/dye-tech/GateKey/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/gatekey-social-card.png',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'support_us',
      content:
        '⭐ If you like GateKey, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/dye-tech/GateKey">GitHub</a>',
      backgroundColor: '#0f172a',
      textColor: '#fff',
      isCloseable: true,
    },
    navbar: {
      title: 'GateKey',
      logo: {
        alt: 'GateKey Logo',
        src: 'img/logo-transparent.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/docs/getting-started/quickstart',
          label: 'Quick Start',
          position: 'left',
        },
        {
          to: '/docs/api/overview',
          label: 'API',
          position: 'left',
        },
        {
          href: 'https://github.com/dye-tech/GateKey',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started/quickstart',
            },
            {
              label: 'Architecture',
              to: '/docs/architecture/overview',
            },
            {
              label: 'Security',
              to: '/docs/security/zero-trust',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/dye-tech/GateKey/discussions',
            },
            {
              label: 'GitHub Issues',
              href: 'https://github.com/dye-tech/GateKey/issues',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/dye-tech/GateKey',
            },
            {
              label: 'Helm Chart',
              href: 'https://github.com/dye-tech/gatekey-helm-chart',
            },
            {
              label: 'Docker Hub',
              href: 'https://hub.docker.com/r/dyetech/gatekey-server',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Dye Tech. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'yaml', 'json', 'go', 'nginx', 'toml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
