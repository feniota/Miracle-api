import { Router } from "express";
import type { MiracleData } from "../misc/data-management";
import { MiracleAuth } from "../misc/auth";
import web_tokens from "./web-tokens";
import instances from "./instance";
import { MiracleTask } from "../misc/task";
import master from "./master";

class MiracleApi {
  private _data: MiracleData;
  private app: Router;
  private _auth: MiracleAuth;

  data = () => this._data;
  auth = () => this._auth;

  get_router(): Router {
    return this.app;
  }
  constructor(data: MiracleData) {
    const router = Router();
    this._data = data;
    this._auth = new MiracleAuth();

    new MiracleTask(this.data);

    web_tokens(router, this.data, this.auth);
    instances(router, this.data, this.auth);
    master(router, this.data, this.auth);

    this.app = router;
  }
}

export default MiracleApi;
