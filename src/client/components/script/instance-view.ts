import { ListItem, snackbar } from "mdui";
import { route } from "../router";

const initlistener = (card?: boolean) => {
  if (card) {
    const instance_card = document.getElementsByClassName("instance-card");
    if (instance_card) {
      Array.from(instance_card).forEach((element) => {
        element.addEventListener("click", () => {
          if (
            window.miracle.api.type === "instance" &&
            element.getAttribute("data-miracle-instance-id") !==
              window.miracle.api.instance
          ) {
            snackbar({ message: "实例与当前密钥不匹配" });
            return;
          }
          window.miracle.interaction.current = element.getAttribute(
            "data-miracle-instance-id"
          )!;
          window.miracle.interaction.current_name = element.getAttribute(
            "data-miracle-instance-name"
          )!;
          route("/instance/");
        });
      });
    }
    return;
  } else {
    const list_item_master = document.getElementById(
      "list-item-master"
    ) as ListItem;
    const list_item_instance = document.getElementById(
      "list-item-instance"
    ) as ListItem;
    list_item_instance.addEventListener("click", () => {
      list_item_instance.active = true;
      list_item_master.active = false;
      route("/");
    });
    if (window.miracle.api.type === "master") {
      list_item_master.addEventListener("click", () => {
        list_item_instance.active = false;
        list_item_master.active = true;
        route("/master/");
      });
    } else {
      list_item_master.disabled = true;
      list_item_master.innerHTML += " (已禁用)";
    }
  }
};
export default initlistener;
