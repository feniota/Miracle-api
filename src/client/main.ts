import "./style.css";
import "mdui/mdui.css";
import "mdui";
import { breakpoint, Checkbox, NavigationDrawer, observeResize } from "mdui";
import { observeBreakpoint } from "./lib/breakpoint";
import "./api/auth";
import "./lib/globalvar";
import { back } from "./components/router";

const drawer = document.getElementById("navigation-drawer")! as NavigationDrawer;

{
  const button = document.getElementById("navigation-drawer-button")!;

  button.addEventListener("click", () => {
    drawer.open = !drawer.open;
  });
}

{
  const backbutton = document.getElementById("back-button")!;
  backbutton.addEventListener("click", () => {
    back();
  });
}

{
  const mastercheckbox = document.getElementById(
    "auth-dialog-master-checkbox"
  )! as Checkbox;
  const masterfield = document.getElementById("auth-dialog-fields-master")!;
  const instancefield = document.getElementById("auth-dialog-fields-instance")!;
  const dialog = document.getElementById("auth-dialog")!;
  mastercheckbox.addEventListener("change", () => {
    if (mastercheckbox.checked) {
      if (breakpoint().up("md")) {
        dialog.classList.add("dialog-manual-width");
      }
      masterfield.classList.remove("hidden");
      instancefield.classList.add("hidden");
    } else {
      dialog.classList.remove("dialog-manual-width");
      masterfield.classList.add("hidden");
      instancefield.classList.remove("hidden");
    }
  });
}

{
  const resize_functions = () => {
    breakpoint().up("md") ? (drawer.open = true) : (drawer.open = false);
    observeBreakpoint("dialog-manual-width");
    observeBreakpoint("content");
  };
  observeResize(document.body, resize_functions);
  // 确保在加载完页面后执行一次
  resize_functions();
}
