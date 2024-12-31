import { Router } from "express";
import { MiracleAuth } from "../misc/auth";
import { MiracleData } from "../misc/data-management";
import {
  ReqNewInstance,
  ReqRemoveInstance,
  ReqSetWeatherKey,
  ResError,
  ResNewInstance,
} from "./types";

const master = (
  app: Router,
  data: () => MiracleData,
  auth: () => MiracleAuth
) => {
  app.post("/web/instances/new", (req, res) => {
    try {
      const body = ReqNewInstance.check(req.body);
      const checktoken = auth().check_token(body.token);
      if (checktoken.valid && checktoken.type === "master") {
        const key = data().new_instance(body.name, body.id);
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

  app.post("/web/instances/remove", (req, res) => {
    try {
      const body = ReqRemoveInstance.check(req.body);
      const checktoken = auth().check_token(body.token);
      if (checktoken.valid && checktoken.type === "master") {
        let success = true;
        body.instances.forEach((id) => {
          if (!data().remove_instance(id)) {
            success = false;
          }
        });
        if (success) {
          data().write();
          res.json({ success: true, msg: "" } as ResError);
        } else {
          res.json({
            success: false,
            msg: "Some of the instances not found",
          } as ResError);
        }
      } else {
        res.json({ success: false, msg: "Invalid key" } as ResError);
      }
    } catch (e) {
      res.status(400);
      res.json({ success: false, msg: e } as ResError);
    }
  });

  app.post("/web/weather-key/set", (req, res) => {
    try {
      const body = ReqSetWeatherKey.check(req.body);
      const checktoken = auth().check_token(body.token);
      if (checktoken.valid && checktoken.type === "master") {
        data().set_weather_key(body.weather_key);
        data().write();
        res.json({ success: true, msg: "" } as ResError);
      } else {
        res.json({ success: false, msg: "Invalid token" } as ResError);
      }
    } catch (e) {
      res.status(400);
      res.json({ success: false, msg: e } as ResError);
    }
  });
};

export default master;
