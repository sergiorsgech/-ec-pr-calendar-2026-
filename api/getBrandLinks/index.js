const { TableClient } = require("@azure/data-tables");

const CONN = process.env.AZURE_STORAGE_CONNECTION_STRING;
const TABLE = "BrandLinks";
const PARTITION = "PR2026";

// NOTE: this field list MUST stay in sync with saveBrandLinks/index.js.
// Any field not listed in BOTH handlers is silently dropped on save.
const FIELDS = [
  "label1", "url1",
  "label2", "url2",
  "label3", "url3",
  "label4", "url4"
];

module.exports = async function (context, req) {
  try {
    const client = TableClient.fromConnectionString(CONN, TABLE);
    try { await client.createTable(); } catch (e) { /* already exists */ }

    const items = [];
    const entities = client.listEntities({
      queryOptions: { filter: `PartitionKey eq '${PARTITION}'` }
    });
    for await (const e of entities) {
      const rec = { id: e.rowKey };
      for (const f of FIELDS) rec[f] = e[f] || "";
      items.push(rec);
    }

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: items
    };
  } catch (err) {
    context.log.error("getBrandLinks error:", err.message);
    context.res = {
      status: 500,
      body: { error: "Could not load brand links.", detail: err.message }
    };
  }
};
