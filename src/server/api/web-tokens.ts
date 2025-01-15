import type { Router } from "express";
import type { MiracleData } from "../misc/data-management";
import {
  ReqWebAuthInstance,
  ReqWebAuthMaster,
  type ResError,
  type ResToken,
} from "./types";
import type { MiracleAuth } from "../misc/auth";
const tokens = (
  app: Router,
  data: () => MiracleData,
  auth: () => MiracleAuth,
) => {
  app.post("/web/auth/master", (req, res) => {
    try {
      const body = ReqWebAuthMaster.check(req.body);
      if (data().check_master_key(body.key)) {
        const token = auth().new_master_token();
        res.json({ success: true, ...token } as ResToken);
      } else {
        res.json({ success: false, msg: "Invalid key" } as ResError);
      }
    } catch (e) {
      res.status(400);
      res.json({ success: false, msg: e } as ResError);
    }
  });

  app.post("/web/auth/instance", (req, res) => {
    try {
      const body = ReqWebAuthInstance.check(req.body);
      if (data().check_instance_key(body.id, body.key)) {
        const token = auth().new_token(body.id);
        res.json({ success: true, ...token } as ResToken);
      } else {
        res.json({ success: false, msg: "Invalid key" } as ResError);
      }
    } catch (e) {
      res.status(400);
      res.json({ success: false, msg: e } as ResError);
    }
  });
};

export default tokens;
