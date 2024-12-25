import { Button } from "mdui";
import { route } from "../router";
const initlistener = () => {
  const add_instance_button = document.getElementById(
    "master-settings-add-instance"
  )! as Button;
  const del_instance_button = document.getElementById(
    "master-settings-delete-instance"
  )! as Button;
  if (window.miracle.api.type == "instance") {
    add_instance_button.disabled = true;
    del_instance_button.disabled = true;
  } else {
    add_instance_button.addEventListener("click", () => {
      route("/master/new-instance/");
    });
    del_instance_button.addEventListener("click", () => {
      route("/master/delete-instance/");
    });
  }
};
export default initlistener;
