import type { Router } from "express";
import type { MiracleAuth } from "../misc/auth";
import type { MiracleData } from "../misc/data-management";
import { ReqWebAuthInstance, type ResError, type ResInstance } from "./types";

const instances = (
  app: Router,
  data: () => MiracleData,
  // @ts-ignore
  auth: () => MiracleAuth,
) => {
  app.get("/web/instances/get", (_req, res) => {
    const instances = data()
      .get_instances()
      .map((value) => {
        return {
          name: value.name,
          id: value.id,
        };
      });
    res.json(instances as ResInstance[]);
  });

  app.post("/instance/checkexists", (req, res) => {
    try {
      const body = ReqWebAuthInstance.check(req.body);
      if (data().check_instance_key(body.id, body.key)) {
        res.json({ success: true, msg: "" } as ResError);
      } else {
        res.json({ success: false, msg: "Invalid key" } as ResError);
      }
    } catch (e) {
      res.status(400);
      res.json({ success: false, msg: e } as ResError);
    }
  });

  app.post("/instance/getconfig", (req, res) => {
    try {
      const body = ReqWebAuthInstance.check(req.body);
      if (data().check_instance_key(body.id, body.key)) {
        const config = data().get_instance_config(body.id);
        config;
        res.json({ success: true, config });
      } else {
        res.json({ success: false, msg: "Invalid key" });
      }
    } catch (e) {
      res.status(400);
      res.json({ success: false, msg: e } as ResError);
    }
  });
};

export default instances;
