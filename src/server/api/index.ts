import { Router } from "express";
import { MiracleData } from "../misc/data-management";

class MiracleApi {
  private data: MiracleData;
  private app: Router;

  get_router(): Router {
    return this.app;
  }
  constructor(data: MiracleData) {
    this.data = data;
    this.app = Router();

    this.app.post("/web/auth/instance", (req, res) => {
      console.log(req.body);
      res.json({ success: true, token: "1234567890", expires: 1234567890 });
    });

    this.app.post("/web/auth/master", (req, res) => {
      console.log(req.body);
      res.json({ success: false });
    });
  }
}

export default MiracleApi;
