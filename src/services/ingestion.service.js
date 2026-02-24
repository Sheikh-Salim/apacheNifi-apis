const nifi = require("./nifi.client");

async function runIngestion(config) {
  try {
    const {
      username,
      password,
      processGroupId,
      parameterContextId,
      controllerServiceId,
      parameters,
    } = config;

    console.log("🔐 Getting token...");
    const token = await nifi.getToken(username, password);

    // -------------------------------
    // 1. STOP PROCESS GROUP
    // -------------------------------
    console.log("🛑 Stopping process group...");

    const pg = await nifi.getProcessGroup(token, processGroupId);
    await nifi.updateProcessGroupState(
      token,
      processGroupId,
      "STOPPED",
      pg.revision.version,
    );

    // -------------------------------
    // 2. DISABLE CONTROLLER SERVICE
    // -------------------------------
    console.log("⚙️ Disabling controller service...");

    const cs = await nifi.getControllerService(token, controllerServiceId);
    await nifi.updateControllerServiceState(
      token,
      controllerServiceId,
      "DISABLED",
      cs.revision.version,
    );

    // -------------------------------
    // 3. UPDATE PARAMETERS
    // -------------------------------
    console.log("✏️ Updating parameter context...");

    const pc = await nifi.getParameterContext(
      token,
      parameterContextId,
      parameters,
    );

    await nifi.updateParameterContext(
      token,
      parameterContextId,
      parameters,
      pc.revision.version,
    );

    // -------------------------------
    // 4. ENABLE CONTROLLER SERVICE
    // -------------------------------
    console.log("🔌 Enabling controller service...");

    const cs2 = await nifi.getControllerService(token, controllerServiceId);

    await nifi.updateControllerServiceState(
      token,
      controllerServiceId,
      "ENABLED",
      cs2.revision.version,
    );

    // -------------------------------
    // 5. START PROCESS GROUP
    // -------------------------------
    console.log("▶️ Starting process group...");

    const pg2 = await nifi.getProcessGroup(token, processGroupId);

    await nifi.updateProcessGroupState(
      token,
      processGroupId,
      "RUNNING",
      pg2.revision.version,
    );

    console.log("✅ Ingestion flow completed!");

    return { success: true };
  } catch (err) {
    console.error("❌ Ingestion failed:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { runIngestion };
