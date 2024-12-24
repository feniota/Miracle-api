import _instance_view from "./template/instance-view.handlebars?raw";
import _instance_panel from "./template/instance-panel.handlebars?raw";
import _instance_wallpaper from "./template/instance-wallpaper.handlebars?raw";
import _instance_slogan from "./template/instance-slogan.handlebars?raw";
import _instance_config from "./template/instance-config.handlebars?raw";
import _master_settings from "./template/master-settings.handlebars?raw";
import _master_new_instance from "./template/master-new-instance.handlebars?raw";
import instance_view_listener from "./script/instance-view";
import instance_panel_listener from "./script/instance-panel";
import instance_op_navbar_listener from "./script/instance-navbar";
import master_settings_listener from "./script/master-settings";
import Log from "../lib/log";
import Handlebars from "handlebars";
import "./components.css";
import { get_instances } from "../api/instance";
import { snackbar } from "mdui";

let _html_precompiled: any = {};
// this tag function provides inline handlebars processing
// usage: html`<some>{{ handlebars_var }}</some>${data}`
// will become `<some>{{ handlesbars_var }}</some>` to handlebars renderer with data
function html(strings: TemplateStringsArray, ...values: any[]) {
  if (!strings) return "";
  if (!values) return strings.join("");
  let input = strings.reduce((acc, str, i) => {
    acc += str;
    if (i < values.length - 1) {
      acc += values[i];
    }
    return acc;
  });
  _html_precompiled[input] = Handlebars.compile(input);
  return _html_precompiled[input](values[values.length - 1]);
}

// compile all handlebars templates
const instance_view = Handlebars.compile(_instance_view);
const instance_panel = Handlebars.compile(_instance_panel);
const instance_wallpaper = Handlebars.compile(_instance_wallpaper);
const instance_slogan = Handlebars.compile(_instance_slogan);
const instance_config = Handlebars.compile(_instance_config);
const master_settings = Handlebars.compile(_master_settings);
const master_new_instance = Handlebars.compile(_master_new_instance);

const log = new Log("router");

const drawlist_instance_operations = html`<mdui-list-item
    icon="image"
    id="list-item-wallpaper"
    rounded
  >
    设置壁纸 </mdui-list-item
  ><mdui-list-item icon="edit_note" id="list-item-slogan" rounded>
    标语编辑 </mdui-list-item
  ><mdui-list-item icon="data_object" id="list-item-config" rounded>
    配置文件
  </mdui-list-item>`;
export const router = () => {
  const path = window.miracle.interaction.path;
  const main = document.getElementById("main")!;
  const drawerlist = document.getElementById("navigation-drawer-list")!;
  const title = document.getElementById("top-title")!;

  log.log("route, path: " + path);

  if (path == "/") {
    document.getElementById("back-button")!.classList.add("hidden");
  } else {
    document.getElementById("back-button")!.classList.remove("hidden");
  }

  switch (path) {
    case "/":
      title.innerHTML = "Feniota Miracle 控制台";
      drawerlist.innerHTML = html`<mdui-list-item
          id="list-item-instance"
          icon="dns--two-tone"
          rounded
          active
          >实例列表</mdui-list-item
        ><mdui-list-item id="list-item-master" icon="settings--two-tone" rounded
          >服务器设置</mdui-list-item
        >`;
      main.innerHTML = html`<div class="main">
        <mdui-circular-progress id="empty-placeholder"></mdui-circular-progress>
      </div>`;
      get_instances()
        .then((instances) => {
          if (instances.length != 0)
            main.innerHTML = instance_view({ instances });
          else {
            log.log("empty");
            main.innerHTML = html`<div class="main">
                <div id="empty-placeholder">{{text}}</div>
              </div>
              ${{ text: "什么都木有 ＞﹏＜" }}`;
          }
        })
        .catch((e) => {
          log.error(e);
          snackbar({ message: "获取实例列表失败" });
        });
      instance_view_listener();
      break;
    case "/master/":
      title.innerHTML = "服务器设置";
      main.innerHTML = master_settings({});
      master_settings_listener();
      break;
    case "/master/new-instance/":
      title.innerHTML = "新建实例";
      main.innerHTML = master_new_instance({});
      break;
    case "/instance/":
      drawerlist.innerHTML = html`{{#each instances}}
        <mdui-list-item
          icon="dns--two-tone"
          rounded
          miracle-instance-id="{{id}}"
          >{{name}}</mdui-list-item
        >
        {{/each}}
        ${{
          instances: [
            { name: "name", id: "1234567890" },
            { name: "name2", id: "1234567891" },
          ],
        }}`;
      main.innerHTML = instance_panel({});
      title.innerHTML = "name";
      instance_panel_listener();
      break;
    case "/instance/wallpaper/":
      title.innerHTML = "name" + " - 壁纸编辑";
      main.innerHTML = instance_wallpaper({});
      drawerlist.innerHTML = drawlist_instance_operations;
      instance_op_navbar_listener();
      break;
    case "/instance/slogan/":
      title.innerHTML = "name" + " - 标语编辑";
      main.innerHTML = instance_slogan({});
      drawerlist.innerHTML = drawlist_instance_operations;
      instance_op_navbar_listener();
      break;
    case "/instance/config/":
      title.innerHTML = "name" + " - 配置文件";
      main.innerHTML = instance_config({});
      drawerlist.innerHTML = drawlist_instance_operations;
      instance_op_navbar_listener();
      break;
    default:
      log.warn("Unrecognized path: " + path);
      return;
  }
};

export const route = (path: string) => {
  window.miracle.interaction.path = path;
  router();
};

export const back = () => {
  let path = window.miracle.interaction.path;
  if (path != "/") {
    window.miracle.interaction.path = path.replace(/\/[^\/]*\/$/, "/");
    router();
  }
};
