import axios from "axios";
import { Record, Array, String, Static } from "runtypes";

export const InstancesType = Array(
  Record({
    id: String,
    name: String,
  })
);
type InstancesType = Static<typeof InstancesType>;

export const get_instances = async () => {
  let res = await axios.get("/api/v1/web/instances/get");
  return InstancesType.check(res.data);
};
