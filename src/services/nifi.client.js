const axios = require("axios");
const https = require("https");

const NIFI_BASE_URL = "https://localhost:8443/nifi-api";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
async function getToken(username, password) {
  const res = await axios.post(
    `${NIFI_BASE_URL}/access/token`,
    `username=${username}&password=${password}`,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
    },
  );

  return res.data;
}

async function getParameterContext(token, contextId) {
  const res = await axios.get(
    `${NIFI_BASE_URL}/parameter-contexts/${contextId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
    },
  );

  return res.data;
}

async function updateParameterContext(token, parameterContextId, newParams) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // 1. Get current context
  const res = await axios.get(
    `${NIFI_BASE_URL}/parameter-contexts/${parameterContextId}`,
    { headers, httpsAgent },
  );

  const revision = res.data.revision;
  const existingParams = res.data.component.parameters;

  // 2. Merge params
  const updatedParams = existingParams.map((p) => {
    const name = p.parameter.name;

    return {
      parameter: {
        name,
        value:
          newParams[name] !== undefined ? newParams[name] : p.parameter.value,
        sensitive: p.parameter.sensitive || false,
      },
    };
  });

  // 3. Update context
  const response = await axios.put(
    `${NIFI_BASE_URL}/parameter-contexts/${parameterContextId}`,
    {
      revision: {
        version: revision.version,
      },
      component: {
        id: parameterContextId,
        parameters: updatedParams,
      },
    },
    { headers, httpsAgent },
  );

  return response.data;
}

async function updateControllerServiceState(
  token,
  serviceId,
  state,
  revisionVersion,
) {
  const res = await axios.put(
    `${NIFI_BASE_URL}/controller-services/${serviceId}`,
    {
      revision: {
        version: revisionVersion,
      },
      component: {
        id: serviceId,
        state: state, // ENABLED or DISABLED
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
    },
  );

  return res.data;
}

async function getControllerService(token, serviceId) {
  const res = await axios.get(
    `${NIFI_BASE_URL}/controller-services/${serviceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
    },
  );

  return res.data;
}

async function getProcessGroup(token, pgId) {
  const res = await axios.get(`${NIFI_BASE_URL}/process-groups/${pgId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
  });

  return res.data;
}

async function getProcessGroup(token, pgId) {
  const res = await axios.get(`${NIFI_BASE_URL}/process-groups/${pgId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
  });

  return res.data;
}

async function updateProcessGroupState(token, pgId, state, revisionVersion) {
  const res = await axios.put(
    `${NIFI_BASE_URL}/flow/process-groups/${pgId}`,
    {
      id: pgId,
      state: state, // STOPPED or RUNNING
      revision: {
        version: revisionVersion,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
    },
  );

  return res.data;
}

module.exports = {
  getToken,
  updateParameterContext,
  updateControllerServiceState,
  getControllerService,
  getProcessGroup,
  updateProcessGroupState,
  getParameterContext,
};
