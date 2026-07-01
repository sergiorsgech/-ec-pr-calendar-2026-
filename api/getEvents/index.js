const { TableClient } = require("@azure/data-tables");

const CONN = process.env.AZURE_STORAGE_CONNECTION_STRING;
const TABLE = "PREvents";
const PARTITION = "2026";

module.exports = async function (context, req) {
  try {
    const client = TableClient.fromConnectionString(CONN, TABLE);

    const items = [];
    const entities = client.listEntities({
      queryOptions: { filter: `PartitionKey eq '${PARTITION}'` }
    });

    for await (const e of entities) {
      items.push({
        id: e.rowKey,
        name: e.name || "",
        date: e.date || "",
        cat: e.cat || "b2c",
        notes: e.notes || ""
      });
    }

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: items
    };
  } catch (err) {
    context.log.error("getEvents error:", err.message);
    context.res = {
      status: 500,
      body: { error: "Could not load PR events.", detail: err.message }
    };
  }
};
