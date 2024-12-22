import { route } from "../router";
const initlistener = () => {
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
