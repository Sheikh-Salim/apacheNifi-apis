const db = require("./db");

async function test() {
  const [rows] = await db.query("SELECT 1");
  console.log("DB Connected:", rows);
}

test();
