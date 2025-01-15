import { type ListItem, snackbar } from "mdui";
import { route } from "../router";
const initlistener = () => {
  const instance_list_item = document.getElementsByClassName(
    "instance-list-item",
  ) as HTMLCollectionOf<ListItem>;
  if (instance_list_item) {
    //Array.from(instance_list_item).forEach((element) => {
    for (const element of Array.from(instance_list_item)) {
      if (
        element.getAttribute("miracle-instance-id") ===
        window.miracle.interaction.current
      )
        element.active = true;
      else element.active = false;
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
          "miracle-instance-id",
        )!;
        window.miracle.interaction.current_name = element.getAttribute(
          "miracle-instance-name",
        )!;
        route("/instance/");
      });
    }
  }
  document
    .getElementById("instance-panel-wallpaper")!
    .addEventListener("click", () => {
      route("/instance/wallpaper/");
    });
  document
    .getElementById("instance-panel-slogan")!
    .addEventListener("click", () => {
      route("/instance/slogan/");
    });
  document
    .getElementById("instance-panel-config")!
    .addEventListener("click", () => {
      route("/instance/config/");
    });
};
export default initlistener;
