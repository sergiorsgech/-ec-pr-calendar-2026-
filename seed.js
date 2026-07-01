const { TableClient } = require("@azure/data-tables");

// ── ONE-TIME SEED SCRIPT ──────────────────────────────────────
// Run locally once after the tables exist:
//   cd api && npm install && cd ..
//   AZURE_STORAGE_CONNECTION_STRING="<your conn string>" node seed.js
// Populates ECCampaigns (33) and PREvents (21).

const CONN = process.env.AZURE_STORAGE_CONNECTION_STRING;
const PARTITION = "2026";

if (!CONN) {
  console.error("Missing AZURE_STORAGE_CONNECTION_STRING env var.");
  process.exit(1);
}

const CAMPAIGNS = [
  {
    "id": "xv-oc",
    "label": "XV OC Expo",
    "cat": "quincea",
    "event": "2026-04-26",
    "dl": "2026-04-17",
    "lg": 6,
    "print": false
  },
  {
    "id": "xv-sf",
    "label": "XV SF Expo",
    "cat": "quincea",
    "event": "2026-05-31",
    "dl": "2026-05-22",
    "lg": 6,
    "print": false
  },
  {
    "id": "xv-ont",
    "label": "XV Ontario Expo",
    "cat": "quincea",
    "event": "2026-08-09",
    "dl": "2026-07-31",
    "lg": 6,
    "print": false
  },
  {
    "id": "xv-lb",
    "label": "XV Long Beach Expo",
    "cat": "quincea",
    "event": "2026-10-25",
    "dl": "2026-10-16",
    "lg": 6,
    "print": false
  },
  {
    "id": "fr-la",
    "label": "Feria de Trabajo · LA City College",
    "cat": "feria",
    "event": "2026-03-26",
    "dl": "2026-03-13",
    "lg": 4,
    "print": false
  },
  {
    "id": "fr-ce",
    "label": "Feria de Trabajo · Cerritos College",
    "cat": "feria",
    "event": "2026-08-27",
    "dl": "2026-08-14",
    "lg": 4,
    "print": false
  },
  {
    "id": "bk-sm",
    "label": "Breakfast · Social Media",
    "cat": "breakfast",
    "event": "2026-02-25",
    "dl": null,
    "lg": 4,
    "print": false
  },
  {
    "id": "bk-xv",
    "label": "Breakfast · Quinceañera",
    "cat": "breakfast",
    "event": "2026-05-20",
    "dl": null,
    "lg": 4,
    "print": false
  },
  {
    "id": "bk-gg",
    "label": "Breakfast · Google Business",
    "cat": "breakfast",
    "event": "2026-06-24",
    "dl": null,
    "lg": 4,
    "print": false
  },
  {
    "id": "bk-tt",
    "label": "Breakfast · Tik Tok",
    "cat": "breakfast",
    "event": "2026-11-18",
    "dl": null,
    "lg": 4,
    "print": false
  },
  {
    "id": "bk-mk",
    "label": "Breakfast · Marketing 2027",
    "cat": "breakfast",
    "event": "2026-12-09",
    "dl": null,
    "lg": 4,
    "print": false
  },
  {
    "id": "ss-ap",
    "label": "SSdN Expo · Apr 15",
    "cat": "ssn_expo",
    "event": "2026-04-15",
    "dl": null,
    "lg": 4,
    "print": false
  },
  {
    "id": "ss-se",
    "label": "SSdN Expo · Sep 23",
    "cat": "ssn_expo",
    "event": "2026-09-23",
    "dl": null,
    "lg": 4,
    "print": false
  },
  {
    "id": "sp-hf",
    "label": "Senior Health Fair",
    "cat": "special",
    "event": "2026-10-18",
    "dl": null,
    "lg": 4,
    "print": false
  },
  {
    "id": "sp-dm",
    "label": "Dia de los Muertos",
    "cat": "special",
    "event": "2026-11-02",
    "dl": null,
    "lg": 4,
    "print": false
  },
  {
    "id": "vv-mar",
    "label": "Vívela · Mar 25",
    "cat": "vivela",
    "event": "2026-03-25",
    "dl": "2026-03-13",
    "lg": 4,
    "print": true
  },
  {
    "id": "vv-apr",
    "label": "Vívela 38th · Apr 29",
    "cat": "vivela",
    "event": "2026-04-29",
    "dl": "2026-04-17",
    "lg": 4,
    "print": true
  },
  {
    "id": "vv-may",
    "label": "Vívela Summer · May 27",
    "cat": "vivela",
    "event": "2026-05-27",
    "dl": "2026-05-15",
    "lg": 4,
    "print": true
  },
  {
    "id": "vv-jun",
    "label": "Vívela · Jun 24",
    "cat": "vivela",
    "event": "2026-06-24",
    "dl": "2026-06-12",
    "lg": 4,
    "print": true
  },
  {
    "id": "vv-jul",
    "label": "Vívela · Jul 29",
    "cat": "vivela",
    "event": "2026-07-29",
    "dl": "2026-07-17",
    "lg": 4,
    "print": true
  },
  {
    "id": "vv-aug",
    "label": "Vívela · Aug 26",
    "cat": "vivela",
    "event": "2026-08-26",
    "dl": "2026-08-14",
    "lg": 4,
    "print": true
  },
  {
    "id": "vv-sep",
    "label": "Vívela · Sep 30",
    "cat": "vivela",
    "event": "2026-09-30",
    "dl": "2026-09-18",
    "lg": 4,
    "print": true
  },
  {
    "id": "vv-oct",
    "label": "Vívela · Oct 28",
    "cat": "vivela",
    "event": "2026-10-28",
    "dl": "2026-10-16",
    "lg": 4,
    "print": true
  },
  {
    "id": "vv-nov",
    "label": "Vívela Posadas · Nov 25",
    "cat": "vivela",
    "event": "2026-11-25",
    "dl": "2026-11-13",
    "lg": 4,
    "print": true
  },
  {
    "id": "vv-dec",
    "label": "Vívela New Year · Dec 30",
    "cat": "vivela",
    "event": "2026-12-30",
    "dl": "2026-12-18",
    "lg": 4,
    "print": true
  },
  {
    "id": "sc-bra",
    "label": "EC Insert · Brazil",
    "cat": "soccer",
    "event": "2026-03-18",
    "dl": "2026-03-06",
    "lg": 4,
    "print": true
  },
  {
    "id": "sc-usa",
    "label": "EC Insert · USA",
    "cat": "soccer",
    "event": "2026-04-22",
    "dl": "2026-04-10",
    "lg": 4,
    "print": true
  },
  {
    "id": "sc-cal",
    "label": "EC Insert · Calendar",
    "cat": "soccer",
    "event": "2026-05-20",
    "dl": "2026-05-08",
    "lg": 4,
    "print": true
  },
  {
    "id": "sc-wc",
    "label": "EC Insert · World Cup Champion",
    "cat": "soccer",
    "event": "2026-07-22",
    "dl": null,
    "lg": 4,
    "print": true
  },
  {
    "id": "su-abg",
    "label": "Abogadomall Supplement",
    "cat": "supps",
    "event": "2026-04-08",
    "dl": "2026-03-27",
    "lg": 4,
    "print": true
  },
  {
    "id": "su-mun",
    "label": "Mundial Supplement",
    "cat": "supps",
    "event": "2026-06-03",
    "dl": "2026-05-22",
    "lg": 10,
    "print": true
  },
  {
    "id": "su-usa",
    "label": "USA 250 Anniversary Supplement",
    "cat": "supps",
    "event": "2026-07-01",
    "dl": "2026-06-19",
    "lg": 4,
    "print": true
  },
  {
    "id": "su-ren",
    "label": "Renovaciones del Hogar",
    "cat": "supps",
    "event": "2026-09-16",
    "dl": "2026-09-04",
    "lg": 4,
    "print": true
  }
];

const PR_EVENTS = [
  {
    "id": "p01",
    "name": "San Pedro Chamber Business Expo",
    "date": "2026-01-29",
    "cat": "b2b",
    "notes": ""
  },
  {
    "id": "p02",
    "name": "VELAONE Summit",
    "date": "2026-02-19",
    "cat": "b2b",
    "notes": ""
  },
  {
    "id": "p03",
    "name": "MegaMix San Gabriel",
    "date": "2026-04-22",
    "cat": "b2c",
    "notes": ""
  },
  {
    "id": "p04",
    "name": "SFS Art FEST",
    "date": "2026-04-25",
    "cat": "b2c",
    "notes": ""
  },
  {
    "id": "p05",
    "name": "Fiesta Broadway",
    "date": "2026-04-26",
    "cat": "b2c",
    "notes": ""
  },
  {
    "id": "p06",
    "name": "5 de Mayo · Placita Olvera",
    "date": "2026-05-03",
    "cat": "b2c",
    "notes": ""
  },
  {
    "id": "p07",
    "name": "Latino Business Expo Ventura",
    "date": "2026-05-21",
    "cat": "b2b",
    "notes": ""
  },
  {
    "id": "p08",
    "name": "LatinaFest · Exposition Park",
    "date": "2026-06-07",
    "cat": "b2c",
    "notes": "10am–6pm"
  },
  {
    "id": "p09",
    "name": "Wathiparty · Plaza México",
    "date": "2026-06-11",
    "cat": "b2c",
    "notes": "11am–4pm"
  },
  {
    "id": "p09b",
    "name": "Javier Madera Camacho",
    "date": "2026-07-25",
    "cat": "b2c",
    "notes": ""
  },
  {
    "id": "p10",
    "name": "Feria Guatemala/El Salvador/Mx",
    "date": "2026-07-25",
    "cat": "b2c",
    "notes": "25 & 26"
  },
  {
    "id": "p11",
    "name": "MegaMix South LA Business Expo",
    "date": "2026-08-26",
    "cat": "b2c",
    "notes": ""
  },
  {
    "id": "p12",
    "name": "Festival Chapin",
    "date": "2026-08-29",
    "cat": "b2c",
    "notes": "29 & 30"
  },
  {
    "id": "p13",
    "name": "Feria de los Moles",
    "date": "2026-10-10",
    "cat": "b2c",
    "notes": "10 & 11"
  },
  {
    "id": "p14",
    "name": "Health Fair",
    "date": "2026-10-18",
    "cat": "b2c",
    "notes": ""
  },
  {
    "id": "p15",
    "name": "MegaMix LA",
    "date": "2026-10-28",
    "cat": "b2c",
    "notes": ""
  },
  {
    "id": "p16",
    "name": "Dia de los Muertos",
    "date": "2026-11-02",
    "cat": "b2c",
    "notes": "DDLM"
  },
  {
    "id": "p17",
    "name": "HP 5KHP",
    "date": "",
    "cat": "pending",
    "notes": "Date TBD"
  },
  {
    "id": "p18",
    "name": "Fiestas Patrias · Olvera Street",
    "date": "",
    "cat": "pending",
    "notes": "September"
  },
  {
    "id": "p19",
    "name": "San Pedro Dia de los Muertos",
    "date": "",
    "cat": "pending",
    "notes": ""
  },
  {
    "id": "p20",
    "name": "SFV Chamber Hispanic Heritage",
    "date": "",
    "cat": "pending",
    "notes": ""
  }
];

async function seedTable(tableName, rows, mapper) {
  const client = TableClient.fromConnectionString(CONN, tableName);
  try { await client.createTable(); } catch (e) { /* already exists */ }

  // clear existing partition
  const existing = client.listEntities({
    queryOptions: { filter: `PartitionKey eq '${PARTITION}'` }
  });
  for await (const e of existing) {
    await client.deleteEntity(e.partitionKey, e.rowKey);
  }

  let n = 0;
  for (const row of rows) {
    await client.createEntity(mapper(row));
    n++;
  }
  console.log(`  ${tableName}: seeded ${n} rows`);
}

(async () => {
  console.log("Seeding tables...");

  await seedTable("ECCampaigns", CAMPAIGNS, (c) => ({
    partitionKey: PARTITION,
    rowKey: String(c.id),
    label: c.label || "",
    cat: c.cat || "",
    event: c.event || "",
    dl: c.dl || "",
    lg: c.lg != null ? Number(c.lg) : 4,
    print: c.print === true
  }));

  await seedTable("PREvents", PR_EVENTS, (e) => ({
    partitionKey: PARTITION,
    rowKey: String(e.id),
    name: e.name || "",
    date: e.date || "",
    cat: e.cat || "b2c",
    notes: e.notes || ""
  }));

  console.log("Done.");
})();
