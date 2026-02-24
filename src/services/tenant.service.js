const tenantModel = require("../models/tenant.model");

async function createTenant(data) {
  // validate input
  if (!data.tenantId) {
    throw new Error("tenantId required");
  }

  const id = await tenantModel.createTenant({
    tenantId: data.tenantId,
    sourceType: data.sourceType || "db",
    dbUrl: data.db.url,
    dbUser: data.db.user,
    dbPassword: data.db.password,
    dbDriver: data.db.driver,
    dbTable: data.db.table,
  });

  return id;
}

module.exports = {
  createTenant,
};
