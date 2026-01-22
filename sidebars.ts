import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/introduction',
        'getting-started/quickstart',
        'getting-started/installation',
      ],
    },
    {
      type: 'category',
      label: 'User Guide',
      items: [
        'user-guide/client-cli',
        'user-guide/web-ui',
        'user-guide/multi-gateway',
        'user-guide/mesh-networking',
        'user-guide/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Administrator Guide',
      items: [
        'admin-guide/server-setup',
        'admin-guide/gateway-setup',
        'admin-guide/wireguard-setup',
        'admin-guide/identity-providers',
        'admin-guide/access-control',
        'admin-guide/geo-fencing',
        'admin-guide/admin-cli',
        'admin-guide/monitoring',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
      ],
    },
    {
      type: 'category',
      label: 'Security',
      items: [
        'security/zero-trust',
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: [
        'deployment/kubernetes',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/overview',
      ],
    },
    {
      type: 'category',
      label: 'Contributing',
      items: [
        'contributing/screenshots',
      ],
    },
  ],
};

export default sidebars;
