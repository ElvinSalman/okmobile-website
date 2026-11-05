# Deployment

- Public source: https://github.com/ElvinSalman/okmobile-website
- Production: https://okmobile-website.vercel.app
- Default localized home: https://okmobile-website.vercel.app/az
- Personal Vercel workspace: salmanovelvin96-5841s-projects
- Vercel project: okmobile-website
- Git integration: connected to ElvinSalman/okmobile-website; production branch main. A push to main successfully created the first Ready production deployment.
- Framework configured by vercel.json: Next.js. Runtime pinned to Node 22.x through package.json.
- No custom domain/DNS changes, service purchases or paid plan activation performed.
- GitHub Actions checks passed on the initial commits; subsequent main pushes run the same workflow.
- Inquiry webhook remains unconfigured, so no real inquiry is reported as delivered.

Run `node scripts/verify-production.mjs` to check public routes and metadata and capture desktop/mobile theme screenshots. This does not submit inquiries or payments.
