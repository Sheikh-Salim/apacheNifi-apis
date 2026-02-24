const db = require("./db");

async function createTenant(data) {
  const sql = `
    INSERT INTO tenants (
      tenant_id, source_type,
      db_url, db_user, db_password, db_driver, db_table,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.tenantId,
    data.sourceType,
    data.dbUrl,
    data.dbUser,
    data.dbPassword,
    data.dbDriver,
    data.dbTable,
    "CREATED",
  ];

  const [result] = await db.execute(sql, values);
  return result.insertId;
}

async function getTenant(tenantId) {
  const [rows] = await db.execute("SELECT * FROM tenants WHERE tenant_id = ?", [
    tenantId,
  ]);

  return rows[0];
}

async function updateTenantNifiIds(tenantId, ids) {
  const sql = `
    UPDATE tenants
    SET nifi_pg_id=?, nifi_context_id=?, nifi_cs_id=?, nifi_processor_id=?, status=?
    WHERE tenant_id=?
  `;

  await db.execute(sql, [
    ids.pgId,
    ids.contextId,
    ids.csId,
    ids.processorId,
    ids.status,
    tenantId,
  ]);
}

module.exports = {
  createTenant,
  getTenant,
  updateTenantNifiIds,
};
