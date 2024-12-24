import { ListItem } from "mdui";
import { route } from "../router";

const initlistener = () => {
  let list_item_master = document.getElementById(
    "list-item-master"
  ) as ListItem;
  let list_item_instance = document.getElementById(
    "list-item-instance"
  ) as ListItem;
  list_item_instance.addEventListener("click", () => {
    list_item_instance.active = true;
    list_item_master.active = false;
    route("/");
  });
  list_item_master.addEventListener("click", () => {
    list_item_instance.active = false;
    list_item_master.active = true;
    route("/master/");
  });
  let instance_card = document.getElementsByClassName("instance-card");
  if (instance_card) {
    Array.from(instance_card).forEach((element) => {
      element.addEventListener("click", () => {
        window.miracle.interaction.current = element.getAttribute(
          "miracle-instance-id"
        )!;
        route("/instance/");
      });
    });
  }
};
export default initlistener;
