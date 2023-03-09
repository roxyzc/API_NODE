import mysql from "mysql2/promise";

const createDatabaseIfNotExists = async (host, user, password, dbName) => {
  const connection = await mysql.createConnection({ host, user, password });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
};

export default createDatabaseIfNotExists;
