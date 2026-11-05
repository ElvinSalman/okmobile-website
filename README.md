# OK Mobile — multilingual concept showroom

A responsive Next.js electronics storefront in Azerbaijani (default), Russian and English. **All products and prices are demo fixtures, not verified store inventory.** Original illustrations and concept branding avoid copying unlicensed store imagery. See [RESEARCH.md](RESEARCH.md) for source evidence and uncertainty.

## Stack

Next.js 16 App Router, React, strict TypeScript, Tailwind CSS 4, shadcn-style reusable Button with Radix Slot/CVA and Radix dialogs, Motion for React, Lucide, next-intl, next-themes, Zustand persist and Zod. Exact installed versions are in package-lock.json. Node 22 recommended.

## Features

- `/az`, `/ru`, `/en`; navigation, interface, forms, validation messages, metadata and static content translated. Product model/brand names retain original spellings.
- Original editorial home, category navigation, brand links and sample collection sections.
- Catalog and search with URL-backed category/brand/minimum/maximum price filters, sorting, 8-item pagination and accessible mobile filter drawer.
- Directly addressable, prerendered product pages with illustrative gallery, configuration/color controls, related items, source disclosure, copy-link sharing and breadcrumbs.
- Variant-aware shopping bag with quantities 1–99, demo totals and inquiry draft; wishlist; both persist locally across reloads.
- System/light/dark themes with saved manual preference and prepaint theme handling; reduced motion; skip link, labeled controls, keyboard-enabled Radix overlays.
- About, contact, honest empty promotions, 404 and error views.
- Zod inquiry form and optional HTTPS delivery route. Without configuration, delivery returns HTTP 503 and the UI explicitly says nothing was sent. No payments or fake checkout.
- Localized canonical/hreflang, Open Graph image, sitemap and robots. Product/Offer structured data deliberately withheld until facts are verified.

## Windows setup and commands

Project location: `C:\Users\Elvin\Desktop\my-first-website`. The actual Windows Desktop path was resolved using `[Environment]::GetFolderPath('Desktop')`. Existing `nova-website/` was preserved and excluded from this project's Git and checks.

```powershell
npm.cmd ci
Copy-Item .env.example .env.local
npm.cmd run dev
```

Open http://localhost:3000 (redirects to `/az` or a remembered language).

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd run start
npm.cmd test
```

Playwright uses the installed Google Chrome channel. The tests start/reuse a production server at 127.0.0.1:3000. Build before testing. Test coverage includes route refresh, localization, metadata/images, filters, cart variants and persistence, wishlist, themes, inquiry validation/unavailable delivery, mobile overlays, and overflow at 320/375/768/1024/1440/1920px. `node scripts/generate-art.mjs` regenerates all original SVG illustrations.

## Architecture

`src/app/[locale]` provides localized server layouts, static product routes and page dispatch. `src/components` contains independent UI features. `src/lib/i18n.ts` defines type-checked translation dictionaries: Russian and Azerbaijani must implement all English keys. next-intl supplies per-route messages. Language switching preserves pathname and query and stores `NEXT_LOCALE` as a nonessential preference cookie.

`src/lib/products.ts` is the replaceable typed catalog boundary, exposing `products`, `getProduct`, `filterProducts` and currency formatting. Each fixture has a stable ID, slug, category, brand/model, illustrative variants, demo price, `dataStatus`, availability status, source URL (null for fixtures), general store reference, and research date. Production should use a discriminated union for verified vs demo records, with a database/API adapter and fresh source timestamps. Never reinterpret `demoPrice` as a real commercial price.

Zustand in `src/lib/store.ts` persists only product IDs, variants, quantities and saved IDs in browser storage. Contact details are never placed in browser persistence. Cart entries key on product ID + finish + storage; unknown catalog IDs are ignored during rendering.

## Inquiry backend

Set server-only `INQUIRY_WEBHOOK_URL` to a trusted HTTPS endpoint you control, accepting JSON `{name,email,message}`. Return 2xx **only after real delivery**. Route validation, same-origin checks, an upstream timeout and non-2xx error handling are included. No credential or destination is shipped to the client. No submission is sent when unset. Add rate limiting, abuse protection, observability, a durable queue, retry/idempotency and a real privacy notice before enabling publicly. The webhook is an integration boundary, not a configured email service.

## Deployment

Deploy as a standard Next.js project on Vercel, with the repository root as root directory, `npm run build`, and framework preset Next.js. Set `NEXT_PUBLIC_SITE_URL` to the generated production HTTPS origin to make metadata deterministic. Vercel's `VERCEL_PROJECT_PRODUCTION_URL` is used as fallback. Leave inquiry delivery unset until an approved provider is configured.

Connect the public GitHub repository to Vercel and use `main` for automatic production deployments. `.github/workflows/ci.yml` runs typecheck, lint, build and smoke tests. `.vercel`, node_modules, .next and environment secrets are excluded from Git. No custom domain or DNS setup is required or authorized. No paid services are enabled by this project.

## Limitations and launch work

This is a polished interactive **demo showroom**, not a verified merchant checkout. There is no inventory API, payment, authentication, tax/shipping calculation, promotions feed, live stock or confirmed commercial policies. Original SVG illustrations are intentionally stylized and two gallery views are illustrative views of the same asset. Product configuration/finish choices do not imply store availability. The home collection is editorial sample content; it is not a claim of actual recent arrivals.

For production commerce: obtain owner approval and licensed photographs; import verified SKUs/specifications/prices/stock; add commerce administration, order persistence, payment provider, delivery/returns/warranty terms, data-protection consent and security/abuse controls; verify structured data and metadata against the production catalog; complete human linguistic/accessibility and performance audits. Automated viewport/behavior checks do not constitute a formal accessibility audit or Core Web Vitals field measurement.

See [DEPLOYMENT.md](DEPLOYMENT.md) for live links and [VERIFICATION.md](VERIFICATION.md) for completed checks. Catalog filtering also supports storage, and search recognizes category names in all three languages.
