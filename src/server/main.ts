import express from "express";
import ViteExpress from "vite-express";
import fs from "node:fs";
import api_router from "./api/index";
import dotenv from "dotenv";
import { MiracleData } from "./misc/data-management";
import path from "node:path";
(async () => {
  dotenv.config();

  const port = parseInt(process.env.PORT || "5000");
  const config_file =
    process.env.CONFIG ||
    path.join(__dirname, "..", ".miracle-data", "config.json");
  const _data = await (async () => {
    // 检测目录是否存在
    if (!fs.existsSync(path.dirname(config_file)))
      fs.mkdirSync(path.dirname(config_file));

    // 检测文件是否存在
    if (fs.existsSync(config_file)) {
      return await MiracleData.init_from_file(config_file);
    } else {
      const data = MiracleData.new_dataset(config_file);
      data.make_master_key();
      await data.write();
      return data;
    }
  })();

  const app = express();

  app.use(express.json());

  app.use("/api/v1", new api_router(_data).get_router());

  ViteExpress.listen(app, port, () =>
    console.log("Server is listening on http://localhost:" + port)
  );
})();
