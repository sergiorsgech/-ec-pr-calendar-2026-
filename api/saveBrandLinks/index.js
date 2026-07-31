const { TableClient } = require("@azure/data-tables");

const CONN = process.env.AZURE_STORAGE_CONNECTION_STRING;
const TABLE = "BrandLinks";
// Own partition — the Sales/Events calendar uses "2026" in this same table.
const PARTITION = "PR2026";
const PIN = "2027";

// NOTE: this field list MUST stay in sync with getBrandLinks/index.js.
// Any field not listed in BOTH handlers is silently dropped on save.
const FIELDS = [
  "label1", "url1",
  "label2", "url2",
  "label3", "url3",
  "label4", "url4"
];

module.exports = async function (context, req) {
  const pin = req.headers["x-edit-pin"];
  if (pin !== PIN) {
    context.res = { status: 401, body: { error: "Invalid PIN." } };
    return;
  }

  const incoming = req.body;
  if (!Array.isArray(incoming)) {
    context.res = { status: 400, body: { error: "Expected an array of brand link records." } };
    return;
  }

  try {
    const client = TableClient.fromConnectionString(CONN, TABLE);
    try { await client.createTable(); } catch (e) { /* already exists */ }

    let saved = 0;
    for (const b of incoming) {
      if (!b || !b.id) continue;
      const entity = { partitionKey: PARTITION, rowKey: String(b.id) };
      for (const f of FIELDS) entity[f] = (b[f] || "").toString().trim();
      // Upsert, so a brand missing from this payload is never wiped.
      await client.upsertEntity(entity, "Replace");
      saved++;
    }

    context.res = { status: 200, body: { saved } };
  } catch (err) {
    context.log.error("saveBrandLinks error:", err.message);
    context.res = { status: 500, body: { error: "Save failed.", detail: err.message } };
  }
};
