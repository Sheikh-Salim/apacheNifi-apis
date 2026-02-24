// const express = require("express");

// const app = express();
// app.use(express.json());

// // test route
// app.get("/", (req, res) => {
//   res.send("NiFi Backend Running");
// });

// const PORT = 3000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const tenantController = require("./controllers/tenant.controller");

const app = express();
app.use(express.json());

// test
app.get("/", (req, res) => {
  res.send("NiFi Backend Running");
});

// create tenant
app.post("/tenants", tenantController.createTenant);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
