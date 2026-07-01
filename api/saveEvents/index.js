const { TableClient } = require("@azure/data-tables");

const CONN = process.env.AZURE_STORAGE_CONNECTION_STRING;
const TABLE = "PREvents";
const PARTITION = "2026";
const PIN = "2027";

module.exports = async function (context, req) {
  const pin = req.headers["x-edit-pin"];
  if (pin !== PIN) {
    context.res = { status: 401, body: { error: "Invalid PIN." } };
    return;
  }

  const incoming = req.body;
  if (!Array.isArray(incoming)) {
    context.res = { status: 400, body: { error: "Expected an array of events." } };
    return;
  }

  try {
    const client = TableClient.fromConnectionString(CONN, TABLE);

    const existing = client.listEntities({
      queryOptions: { filter: `PartitionKey eq '${PARTITION}'` }
    });
    for await (const e of existing) {
      await client.deleteEntity(e.partitionKey, e.rowKey);
    }

    for (const ev of incoming) {
      if (!ev.id) continue;
      await client.createEntity({
        partitionKey: PARTITION,
        rowKey: String(ev.id),
        name: ev.name || "",
        date: ev.date || "",
        cat: ev.cat || "b2c",
        notes: ev.notes || ""
      });
    }

    context.res = { status: 200, body: { saved: incoming.length } };
  } catch (err) {
    context.log.error("saveEvents error:", err.message);
    context.res = { status: 500, body: { error: "Save failed.", detail: err.message } };
  }
};
