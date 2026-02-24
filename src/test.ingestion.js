const { runIngestion } = require("./services/ingestion.service");

async function test() {
  const config = {
    username: "af1e4306-8e95-4989-b2b1-2c336ad7d80a",
    password: "kgGEu3oqBcJ4poB1Asdg5MNWS0ON6dJZ",

    processGroupId: "8bb47468-019c-1000-c61d-c8ce14a0fa70",
    parameterContextId: "8bb23c57-019c-1000-dc4a-11e4b092b459",
    controllerServiceId: "8eb7ea66-019c-1000-72af-77fcd35b899a",

    parameters: {
      "db.url": "jdbc:mysql://localhost:3306/nifi_demo",
      "db.user": "root",
      "db.password": "showmustgoon",
      "db.table.name": "titanic",
      "db.driver.class": "com.mysql.cj.jdbc.Driver",
      "db.incremental.column": "id",
    },
  };

  await runIngestion(config);
}

test();
