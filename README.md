# EC PR Calendar 2026

Internal PWA for the El Clasificado PR team. Combines EC campaigns and PR community
events in one calendar. All data lives in Azure Table Storage, so edits are visible to
everyone on the next refresh. Editing is protected by a PIN.

## What's inside

- **Campaigns tab** — all EC campaigns, sorted by date, past ones grayed with ✓ PAST
- **This Week tab** — shows/publications, ad deadlines, prospecting starts, and PR events for the selected week (auto-jumps to the current week)
- **This Month tab** — everything landing in a chosen month
- **PR Events tab** — community events (B2B / B2C / Pending), add/edit/delete
- **🔒 Edit** — enter PIN `2027` to unlock editing for both campaigns and PR events

## Architecture

```
index.html  (PWA — all 4 tabs)
   ↓ on load: GET /api/getCampaigns + GET /api/getEvents
Azure Functions → Azure Table Storage
   ↑ edits → POST /api/saveCampaigns + /api/saveEvents  (header x-edit-pin: 2027)
```

| Resource | Value |
|----------|-------|
| Storage account | `ecmapstorage` (resource group `ec-maps`) |
| Tables | `ECCampaigns`, `PREvents` (partition key `2026`) |
| Edit PIN | `2027` |

## First-time setup

### 1. Azure — Static Web App
- Create a Static Web App in the `ec-maps` resource group (free tier).
- Source: this GitHub repo, branch `main`.
- Build presets: **Custom** — app location `/`, api location `api`, output location empty.
- Azure auto-creates the deploy token secret in the repo.

### 2. Azure — Function app setting
Add the connection string so the Functions can reach Table Storage:
- In the Static Web App → **Configuration** → add
  `AZURE_STORAGE_CONNECTION_STRING` = the `ecmapstorage` connection string.

### 3. Seed the tables (one time, from your machine)
```bash
cd api && npm install && cd ..
AZURE_STORAGE_CONNECTION_STRING="<your connection string>" node seed.js
```
This creates both tables and loads the 33 campaigns + 21 PR events.

## Updating the app later
```bash
# edit index.html (or the functions)
git add .
git commit -m "your message"
git push origin main   # GitHub Actions redeploys in ~2 min
```

## Changing the PIN
The PIN lives in two Function files: `api/saveCampaigns/index.js` and
`api/saveEvents/index.js` (`const PIN = "2027"`). Change both, commit, push.
