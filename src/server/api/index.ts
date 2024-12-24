import { Router } from "express";
import { MiracleData } from "../misc/data-management";
import { MiracleAuth } from "../misc/auth";
import web_tokens from "./web-tokens";
import instances from "./instance";

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
    let router = Router();
    this._data = data;
    this._auth = new MiracleAuth();

    web_tokens(router, this.data, this.auth);
    instances(router, this.data, this.auth);

    this.app = router;
  }
}

export default MiracleApi;
