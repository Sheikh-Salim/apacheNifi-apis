const tenantService = require("../services/tenant.service");

async function createTenant(req, res) {
  try {
    const data = req.body;

    const result = await tenantService.createTenant(data);

    res.json({
      message: "Tenant created",
      tenantId: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create tenant" });
  }
}

module.exports = {
  createTenant,
};
