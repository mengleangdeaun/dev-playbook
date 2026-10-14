my-astro-playbook/
├── src/
│   ├── assets/                 # 🎨 BRANDING ASSETS
│   │   ├── fonts/              # ពុម្ពអក្សរផ្លូវការរបស់ក្រុមហ៊ុន (e.g., Khmer & English fonts)
│   │   ├── brand/              # ឡូហ្គោ និង Icons ផ្លូវការ (Logos, Monograms, SVGs)
│   │   └── images/             # រូបភាពទូទៅសម្រាប់ប្រើក្នុងអត្ថបទ
│   ├── components/
│   │   ├── branding/           # Components សម្រាប់បង្ហាញ Branding (e.g., ColorPalette.astro)
│   │   └── shared/             # Components ប្រើទូទៅ (Header, Footer, Sidebar)
│   ├── content/                # 📂 MULTI-COLLECTION DIRECTORY
│   │   ├── brand-guide/        # ១. មាតិកា Branding Guidelines (.md / .mdx)
│   │   │   ├── colors.mdx      # ទំព័របង្ហាញកូដពណ៌ក្រុមហ៊ុន
│   │   │   └── typography.md   # ច្បាប់នៃការប្រើប្រាស់ Font
│   │   ├── docs/               # ២. មាតិកា Core Technical Playbook (.md / .mdx)
│   │   │   ├── onboarding/
│   │   │   └── typescript/
│   │   ├── blog/               # ៣. មាតិកា Tech Blog (.md / .mdx)
│   │   │   ├── 2026-10-migration-to-astro.md
│   │   │   └── code-splitting-tips.md
│   │   ├── showcase/           # ៤. មាតិកាប្រមូលផ្តុំស្នាដៃ / Projects (.json ឬ .md)
│   │   │   ├── internal-crm.md
│   │   │   └── client-mobile-app.md
│   │   └── config.ts           # ⚙️ កំណត់ច្បាប់ (Zod Schema) ដាច់ដោយឡែកសម្រាប់ Collection នីមួយៗ
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── DocLayout.astro     # Layout មាន Sidebar សម្រាប់ Playbook & Brand Guide
│   │   └── BlogLayout.astro    # Layout បែបអត្ថបទកាសែត/ទស្សនាវដ្តី សម្រាប់ Blog
│   └── pages/                  # 🌐 ROUTING SYSTEM
│       ├── index.astro         # ទំព័រដើម (Hub Landing Page)
│       ├── brand/              # URL: /brand/colors, /brand/typography
│       │   └── [...slug].astro
│       ├── docs/               # URL: /docs/onboarding/env-setup
│       │   └── [...slug].astro
│       ├── blog/               # URL: /blog (ទំព័របញ្ជីអត្ថបទ) និង /blog/migration-to-astro
│       │   ├── index.astro     # បញ្ជីរាយនាមអត្ថបទ Blog ទាំងអស់
│       │   └── [...slug].astro # ទំព័រអាន Blog នីមួយៗ
│       └── showcase/           # URL: /showcase
│           ├── index.astro     # ទំព័របង្ហាញ Grid នៃ Projects ទាំងអស់
│           └── [...slug].astro # ទំព័រលម្អិតនៃ Project នីមួយៗ
├── tailwind.config.mjs         # កន្លែងកំណត់ Font និង Colors របស់ Brand ទៅក្នុង Tailwind
└── tsconfig.json
