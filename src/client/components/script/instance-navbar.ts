import { ListItem } from "mdui";
import { route } from "../router";

const initlistener = () => {
  const wp = document.getElementById("list-item-wallpaper")! as ListItem;
  const slogan = document.getElementById("list-item-slogan")! as ListItem;
  const config = document.getElementById("list-item-config")! as ListItem;
  switch (window.miracle.interaction.path) {
    case "/instance/wallpaper/":
      wp.active = true;
      slogan.active = false;
      config.active = false;
      break;
    case "/instance/slogan/":
      wp.active = false;
      slogan.active = true;
      config.active = false;
      break;
    case "/instance/config/":
      wp.active = false;
      slogan.active = false;
      config.active = true;
      break;
    default:
      // ignore this
      break;
  }
  wp.addEventListener("click", () => {
    route("/instance/wallpaper/");
    wp.active = true;
    slogan.active = false;
    config.active = false;
  });
  slogan.addEventListener("click", () => {
    route("/instance/slogan/");
    wp.active = false;
    slogan.active = true;
    config.active = false;
  });
  config.addEventListener("click", () => {
    route("/instance/config/");
    wp.active = false;
    slogan.active = false;
    config.active = true;
  });
};
export default initlistener;
