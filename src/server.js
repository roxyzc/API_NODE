import "dotenv/config";
import { randomUUID } from "crypto";
import http from "http";
import url from "url";
import { connection } from "./configs/db.config.js";

const server = http.createServer(async (req, res) => {
  let params = url.parse(req.url, true).query;
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", async () => {
    if (req.url === "/api/products" && req.method === "GET") {
      const [fields, rows] = await (
        await connection
      ).execute("SELECT * FROM `product`");
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(fields));
    }
    if (req.url === "/api/product" && req.method === "POST") {
      if (
        JSON.stringify(body).includes("nama") &&
        JSON.stringify(body).includes("harga")
      ) {
        const date = new Date().getTime();
        res.writeHead(200, { "Content-Type": "application/json" });
        const [fields, rows] = await (
          await connection
        ).execute(
          `INSERT INTO product(idProduct, namaProduct, harga, createdAt, updatedAt) VALUES ("${randomUUID()}", "${String(
            JSON.parse(body).nama
          )}", ${JSON.parse(body).harga}, ${date}, ${date})`
        );
        res.end(JSON.stringify({ success: true, message: "success" }));
        return;
      }
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          message: "field `nama` dan `harga` wajib ada",
        })
      );
      return;
    }
    if (req.url.includes("?")) {
      if (
        req.url.split("?")[0] === "/api/product" &&
        req.url.split("?")[1].includes("id") &&
        req.method === "GET"
      ) {
        const [fields, rows] = await (
          await connection
        ).execute(`SELECT * FROM product WHERE idProduct="${params.id}"`);
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(fields));
      }
      if (
        req.url.split("?")[0] === "/api/product" &&
        req.url.split("?")[1].includes("id") &&
        req.method === "DELETE"
      ) {
        const [fields, rows] = await (
          await connection
        ).execute(`DELETE FROM product WHERE idProduct="${params.id}"`);
        if (fields.affectedRows === 0) {
          res.writeHead(404, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({
              success: false,
              error: { message: "product not found" },
            })
          );
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({ success: true, message: "success", fields })
          );
        }
      }
      if (
        req.url.split("?")[0] === "/api/product" &&
        req.url.split("?")[1].includes("id") &&
        req.method === "PUT"
      ) {
        if (
          JSON.stringify(body).includes("nama") &&
          JSON.stringify(body).includes("harga")
        ) {
          const date = new Date().getTime();
          const [fields, rows] = await (
            await connection
          ).execute(`UPDATE product SET namaProduct ='${
            JSON.parse(body).nama
          }',harga='${
            JSON.parse(body).harga
          }', updatedAt='${date}' WHERE idProduct="${params.id}"
        `);
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ success: true, message: "success" }));
        }
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message: "field `nama` dan `harga` wajib ada",
          })
        );
        return;
      }
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ success: false, error: { message: "not found" } })
    );
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Listen at port 3000");
});
