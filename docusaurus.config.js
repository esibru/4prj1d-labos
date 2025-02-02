// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Laboratoires de gestion de projet',
  tagline: 'Développement d\'une application Java',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://lechjo01.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/4prj1d-labos/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'lechjo01', // Usually your GitHub org/user name.
  projectName: '4prj1d', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Introduction',
        logo: {
          alt: 'Logo',
          src: 'img/logo.jpg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Travaux dirigés',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Ressources',
            items: [
              {
                label: 'poEsi',
                href: 'https://poesi.esi-bru.be',
              },
              {
                label: 'git.esi-bru',
                href: 'https://git.esi-bru.be/',
              },
            ],
          },
          {
            title: 'Licence',
            items: [
              {
                label: 'MIT Licence',
                href: 'https://opensource.org/licenses/MIT',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} HE2B, ESI. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['Bash', 'Java'],
      },
    }),
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
};

export default config;
