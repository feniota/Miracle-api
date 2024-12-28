import { route } from "../router";
const initlistener = () => {
  let instance_list_item =
    document.getElementsByClassName("instance-list-item");
  if (instance_list_item) {
    Array.from(instance_list_item).forEach((element) => {
      element.addEventListener("click", () => {
        window.miracle.interaction.current = element.getAttribute(
          "miracle-instance-id"
        )!;
        window.miracle.interaction.current_name = element.getAttribute(
          "miracle-instance-name"
        )!;
        route("/instance/");
      });
    });
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
