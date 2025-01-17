import _instance_view from "./template/instance-view.handlebars?raw";
import _instance_panel from "./template/instance-panel.handlebars?raw";
import _instance_wallpaper from "./template/instance-wallpaper.handlebars?raw";
import _instance_slogan from "./template/instance-slogan.handlebars?raw";
import _instance_config from "./template/instance-config.handlebars?raw";
import _master_settings from "./template/master-settings.handlebars?raw";
import _master_new_instance from "./template/master-new-instance.handlebars?raw";
import _master_remove_instance from "./template/master-remove-instance.handlebars?raw";
import instance_view_listener from "./script/instance-view";
import instance_panel_listener from "./script/instance-panel";
import instance_op_navbar_listener from "./script/instance-navbar";
import master_settings_listener from "./script/master-settings";
import master_new_instance_listener from "./script/master-new-instance";
import master_remove_instance_listener from "./script/master-remove-instance";
import Log from "../lib/log";
import Handlebars from "handlebars";
import "./components.css";
import { get_instances } from "../api/instance";
import { breakpoint, snackbar } from "mdui";
import { html } from "../lib/html";
import {
  list_item_in,
  list_item_out,
  main_fade_in,
  main_fade_out,
} from "../lib/animation";

// compile all handlebars templates
const instance_view = Handlebars.compile(_instance_view);
const instance_panel = Handlebars.compile(_instance_panel);
const instance_wallpaper = Handlebars.compile(_instance_wallpaper);
const instance_slogan = Handlebars.compile(_instance_slogan);
const instance_config = Handlebars.compile(_instance_config);
const master_settings = Handlebars.compile(_master_settings);
const master_new_instance = Handlebars.compile(_master_new_instance);
const master_remove_instance = Handlebars.compile(_master_remove_instance);

const log = new Log("router");
let invoke_count = 0;
const drawlist_instance_operations = html`<mdui-list-item
    icon="image"
    id="list-item-wallpaper"
    rounded
    style="opacity:0"
  >
    设置壁纸 </mdui-list-item
  ><mdui-list-item
    icon="edit_note"
    id="list-item-slogan"
    rounded
    style="opacity:0"
  >
    标语编辑 </mdui-list-item
  ><mdui-list-item
    icon="data_object"
    id="list-item-config"
    rounded
    style="opacity:0"
  >
    配置文件
  </mdui-list-item>`;

const router = async (back?: boolean): Promise<void> => {
  invoke_count++;
  const path = window.miracle.interaction.path;
  const main = document.getElementById("main")!;
  const drawerlist = document.getElementById("navigation-drawer-list")!;
  const title = document.getElementById("top-title")!;
  log.log(`route, path: ${path}`);

  if (path === "/") {
    document.getElementById("back-button")!.classList.add("hidden");
  } else {
    document.getElementById("back-button")!.classList.remove("hidden");
  }
  await new Promise<void>((resolve, _reject) => {
    main_fade_out(main, back).onfinish = () => {
      resolve();
    };
  });
  main.style.opacity = "0";
  switch (path) {
    case "/":
      title.innerHTML = "Feniota Miracle 控制台";
      if (
        !(
          window.miracle.interaction.path_from.startsWith("/master/") ||
          window.miracle.interaction.path_from === "/"
        )
      ) {
        await list_item_out(drawerlist, back);
        drawerlist.innerHTML = html`<mdui-list-item
            id="list-item-instance"
            icon="dns"
            rounded
            style="opacity:0"
            active
            >实例列表</mdui-list-item
          ><mdui-list-item
            id="list-item-master"
            icon="settings"
            rounded
            style="opacity:0"
            >服务器设置</mdui-list-item
          >`;
        list_item_in(drawerlist, back);
      }
      main.innerHTML = html`<div class="main">
        <mdui-circular-progress id="empty-placeholder"></mdui-circular-progress>
      </div>`;
      get_instances()
        .then((instances) => {
          if (instances.length !== 0) {
            const md = breakpoint().up("md");
            window.miracle.interaction.instances = instances;
            main.innerHTML = instance_view({ instances, md });
            instance_view_listener(true);
            return;
          }
          window.miracle.interaction.instances = [];
          main.innerHTML = html`<div class="main">
            <div id="empty-placeholder">${"什么都木有 ＞﹏＜"}</div>
          </div>`;
          return;
        })
        .catch((e) => {
          log.error(e);
          snackbar({ message: "获取实例列表失败" });
        });
      instance_view_listener(false);
      break;
    case "/master/":
      title.innerHTML = "服务器设置";
      main.innerHTML = master_settings({});
      master_settings_listener();
      break;
    case "/master/new-instance/":
      title.innerHTML = "新建实例";
      main.innerHTML = master_new_instance({});
      master_new_instance_listener();
      break;
    case "/master/remove-instance/":
      title.innerHTML = "删除实例";
      main.innerHTML = html`<div class="main">
        <mdui-circular-progress id="empty-placeholder"></mdui-circular-progress>
      </div>`;
      get_instances()
        .then((instances) => {
          if (instances.length !== 0) {
            const md = breakpoint().up("md");
            window.miracle.interaction.instances = instances;
            main.innerHTML = master_remove_instance({ instances, md });
            master_remove_instance_listener();
          } else {
            window.miracle.interaction.instances = [];
            main.innerHTML = html`<div class="main">
              <div id="empty-placeholder">${"什么都木有 ＞﹏＜"}</div>
            </div>`;
          }
        })
        .catch((e) => {
          log.error(e);
          snackbar({ message: "获取实例列表失败" });
        });
      break;
    case "/instance/":
      main.innerHTML = instance_panel({});
      title.innerHTML = window.miracle.interaction.current_name;
      if (window.miracle.interaction.path_from !== "/instance/") {
        await list_item_out(drawerlist, back);
        drawerlist.innerHTML = html`{{#each instances}}
          <mdui-list-item
            class="instance-list-item"
            icon="dns"
            rounded
            miracle-instance-id="{{id}}"
            miracle-instance-name="{{name}}"
            style="opacity:0"
            >{{name}}</mdui-list-item
          >
          {{/each}}
          ${{
            instances: window.miracle.interaction.instances,
            current_id: window.miracle.interaction.current,
          }}`;
        list_item_in(drawerlist, back);
      }
      instance_panel_listener();
      break;
    case "/instance/wallpaper/":
      title.innerHTML = `${window.miracle.interaction.current_name} - 壁纸编辑`;
      main.innerHTML = instance_wallpaper({});
      if (!window.miracle.interaction.path_from.match(/^\/instance\/\w+\/$/)) {
        await list_item_out(drawerlist, back);
        drawerlist.innerHTML = drawlist_instance_operations;
        list_item_in(drawerlist, back);
        instance_op_navbar_listener();
      }
      break;
    case "/instance/slogan/":
      title.innerHTML = `${window.miracle.interaction.current_name} - 标语编辑`;
      main.innerHTML = instance_slogan({});
      if (!window.miracle.interaction.path_from.match(/^\/instance\/\w+\/$/)) {
        await list_item_out(drawerlist, back);
        drawerlist.innerHTML = drawlist_instance_operations;
        list_item_in(drawerlist, back);
        instance_op_navbar_listener();
      }
      break;
    case "/instance/config/":
      title.innerHTML = `${window.miracle.interaction.current_name} - 配置文件`;
      main.innerHTML = instance_config({});
      if (!window.miracle.interaction.path_from.match(/^\/instance\/\w+\/$/)) {
        await list_item_out(drawerlist, back);
        drawerlist.innerHTML = drawlist_instance_operations;
        list_item_in(drawerlist, back);
        instance_op_navbar_listener();
      }
      break;
    default:
      log.warn(`Unrecognized path: ${path}`);
  }
  main_fade_in(main, back).onfinish = () => {
    main.style.opacity = "1";
  };
  return;
};

export const route = (path: string, back?: boolean) => {
  window.miracle.interaction.path_from = window.miracle.interaction.path;
  window.miracle.interaction.path = path;
  window.location.hash = path; // 实际没有用但看着好看一些
  return router(back);
};

export const back = () => {
  const path = window.miracle.interaction.path;
  if (path !== "/") {
    return route(path.replace(/\/[^\/]*\/$/, "/"), true);
  }
  return Promise.resolve();
};
