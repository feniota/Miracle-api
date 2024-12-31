import axios from "axios";
import { Array } from "runtypes";
import { ResInstance } from "../../server/api/types";

export const get_instances = async () => {
  const res = await axios.get("/api/v1/web/instances/get");
  return Array(ResInstance).check(res.data);
};
