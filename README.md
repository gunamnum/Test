# CZN Save Data Lab

Simple fan-made Chaos Zero Nightmare Save Data calculator built with Next.js for Vercel deployment.

## Run Locally

Install dependencies first:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000/
```

## Deploy on Vercel

Connect this repository in Vercel and keep the defaults:

```text
Framework Preset: Next.js
Build Command: next build
Output Directory: .next
```

## Legacy Static Preview

The old static preview helper is still included for local fallback:

```text
node preview-server.mjs
```

On Windows, double-click `run-local.cmd` or run:

```powershell
.\run-local.ps1
```

To stop the local server, double-click `stop-local.cmd` or run:

```powershell
.\stop-local.ps1
```

## Notes

- Tier caps use 1-15, starting at 30 and increasing by 10.
- Nightmare / Deep Trauma adds 10 cap.
- The UI includes a lightweight CSS 3D animated combatant, orbit rings, and card fan.
