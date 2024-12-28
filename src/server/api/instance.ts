import { Router } from "express";
import { MiracleAuth } from "../misc/auth";
import { MiracleData } from "../misc/data-management";
import { ReqNewInstance, ResError, ResInstance, ResNewInstance } from "./types";

const instances = (
  app: Router,
  data: () => MiracleData,
  auth: () => MiracleAuth
) => {
  app.post("/web/instances/new", (req, res) => {
    try {
      let body = ReqNewInstance.check(req.body);
      let checktoken = auth().check_token(body.token);
      if (checktoken.valid && checktoken.type === "master") {
        let key = data().new_instance(body.name, body.id);
        if (!key) {
          res.json({
            success: false,
            msg: "Instance already exists",
          } as ResError);
        } else {
          data().write();
          res.json({ success: true, key } as ResNewInstance);
        }
      } else {
        res.json({ success: false, msg: "Invalid key" } as ResError);
      }
    } catch (e) {
      res.status(400);
      res.json({ success: false, msg: e } as ResError);
    }
  });

  app.get("/web/instances/get", (req, res) => {
    let instances = data()
      .get_instances()
      .map((value) => {
        return {
          name: value.name,
          id: value.id,
        };
      });
    res.json(instances as ResInstance[]);
  });
};

export default instances;
