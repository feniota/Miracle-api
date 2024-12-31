import { Button } from "mdui";
import { route } from "../router";
const initlistener = () => {
  const add_instance_button = document.getElementById(
    "master-settings-add-instance"
  )! as Button;
  const remove_instance_button = document.getElementById(
    "master-settings-remove-instance"
  )! as Button;
  if (window.miracle.api.type == "instance") {
    add_instance_button.disabled = true;
    remove_instance_button.disabled = true;
  } else {
    add_instance_button.addEventListener("click", () => {
      route("/master/new-instance/");
    });
    remove_instance_button.addEventListener("click", () => {
      route("/master/remove-instance/");
    });
  }
};
export default initlistener;
