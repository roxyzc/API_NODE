import db from "mysql2/promise";
import createDatabaseIfNotExists from "../services/db.service.js";

const connection = createDatabaseIfNotExists(
  process.env.HOST,
  process.env.USER,
  process.env.PASSWORD,
  process.env.DATABASE
)
  .then(async () => {
    return await db.createConnection({
      host: process.env.HOST,
      password: process.env.PASSWORD,
      user: process.env.USER,
      database: process.env.DATABASE,
    });
  })
  .then(async (value) => {
    await value.connect();
    console.log("success");
    return value;
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

export { connection };
