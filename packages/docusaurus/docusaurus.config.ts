import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: "Fossorial Docs",
    tagline: "Adapted for use in burrowing",
    favicon: "img/favicon.ico",

    // Set the production url of your site here
    url: "https://docs.fossorial.io",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "Fossorial", // Usually your GitHub org/user name.
    projectName: "docs", // Usually your repo name.

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "en",
        locales: ["en"]
    },

    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarCollapsed: false,
                    sidebarPath: "./sidebars.ts",
                    routeBasePath: "/",
                    docItemComponent: "@theme/ApiItem" // Derived from docusaurus-theme-openapi
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    //   editUrl:
                    //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                },
                blog: false,
                // blog: {
                //   showReadingTime: true,
                //   feedOptions: {
                //     type: ['rss', 'atom'],
                //     xslt: true,
                //   },
                //   // Please change this to your repo.
                //   // Remove this to remove the "edit this page" links.
                // //   editUrl:
                // //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                //   // Useful options to enforce blogging best practices
                //   onInlineTags: 'warn',
                //   onInlineAuthors: 'warn',
                //   onUntruncatedBlogPosts: 'warn',
                // },
                theme: {
                    customCss: "./src/css/custom.css"
                }
            } satisfies Preset.Options
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        image: "img/docusaurus-social-card.jpg",
        colorMode: {
            defaultMode: "light",
            disableSwitch: false,
            respectPrefersColorScheme: true
        },
        // announcementBar: {
        //     id: "support_us",
        //     content:
        //         'If you like Pangolin, please <a target="_blank" rel="noopener noreferrer" href="https://github.com/fosrl/pangolin">star us on GitHub!</a>',
        //     isCloseable: false
        // },
        algolia: {
            // The application ID provided by Algolia
            appId: "CVXQS7OHYA",
            // Public API key: it is safe to commit it
            apiKey: "37f86a9f9a04ab1c0f17339c86566ce5",
            indexName: "fossorial",
            contextualSearch: false
        },
        navbar: {
            title: "Fossorial",
            logo: {
                alt: "Fossorial Logo",
                src: "img/pangolin_orange.svg"
            },
            items: [
                // {
                //   type: "docSidebar",
                //   sidebarId: "tutorialSidebar",
                //   position: "left",
                //   label: "Docs",
                // },
                // {to: '/blog', label: 'Blog', position: 'left'},
                {
                    href: "https://fossorial.io",
                    label: "fossorial.io",
                    position: "left"
                },
                {
                    href: "https://discord.gg/HCJR8Xhme4",
                    label: "Discord",
                    position: "left"
                },
                {
                    href: "https://github.com/fosrl",
                    position: "right",
                    className: "header-github-link",
                    "aria-label": "GitHub repository"
                }
            ]
        },
        // footer: {
        //   style: "dark",
        //   links: [
        //     {
        //       title: "Docs",
        //       items: [
        //         {
        //           label: "Docs",
        //           to: "/overview",
        //         },
        //       ],
        //     },
        //     {
        //       title: "Community",
        //       items: [
        //         // {
        //         //   label: 'Stack Overflow',
        //         //   href: 'https://stackoverflow.com/questions/tagged/docusaurus',
        //         // },
        //         {
        //           label: "Discord",
        //           href: "https://discord.gg/HCJR8Xhme4",
        //         },
        //         // {
        //         //   label: 'X',
        //         //   href: 'https://x.com/docusaurus',
        //         // },
        //       ],
        //     },
        //     {
        //       title: "More",
        //       items: [
        //         // {
        //         //   label: 'Blog',
        //         //   to: '/blog',
        //         // },
        //         {
        //           label: "GitHub",
        //           href: "https://github.com/fosrl",
        //         },
        //       ],
        //     },
        //   ],
        //   copyright: `${new Date().getFullYear()} Built by Fossorial`,
        // },
        prism: {
            theme: prismThemes.oneLight,
            darkTheme: prismThemes.oneDark
        }
    } satisfies Preset.ThemeConfig,
    plugins: [
        [
            "@dipakparmar/docusaurus-plugin-umami",
            /** @type {import('@dipakparmar/docusaurus-plugin-umami').Options} */
            {
                websiteID: "d9a3a131-d2f4-4f8f-922b-80d668e96640", // Required
                analyticsDomain: "umami.dev.fossorial.io", // Required
                dataAutoTrack: false, // Optional
                dataDoNotTrack: false, // Optional
                dataCache: true, // Optional
                dataDomains: "docs.fossorial.io" // comma separated list of domains, *Recommended*
            }
        ],
        [
            "docusaurus-plugin-openapi-docs",
            {
                id: "api", // plugin id
                docsPluginId: "classic", // configured for preset-classic
                config: {
                    petstore: {
                        specPath: "./openapi.yml",
                        outputDir: "docs/03-Pangolin/07-API",
                        sidebarOptions: {
                            groupPathsBy: "tag"
                        }
                    } satisfies OpenApiPlugin.Options
                }
            }
        ]
    ],
    themes: ["docusaurus-theme-openapi-docs"] // export theme components
};

export default config;
