import "./style.css";
import "mdui/mdui.css";
import "mdui";
import { breakpoint, Checkbox, NavigationDrawer, observeResize } from "mdui";
import { observeBreakpoint } from "./lib/breakpoint";
import "./api/index";
import "./lib/globalvar";
import { back } from "./components/router";

{
  let drawer = document.getElementById(
    "navigation-drawer"
  )! as NavigationDrawer;
  let button = document.getElementById("navigation-drawer-button")!;

  button.addEventListener("click", () => {
    drawer.open = !drawer.open;
  });
}

{
  let backbutton = document.getElementById("back-button")!;
  backbutton.addEventListener("click", () => {
    back();
  });
}

{
  let mastercheckbox = document.getElementById(
    "auth-dialog-master-checkbox"
  )! as Checkbox;
  let masterfield = document.getElementById("auth-dialog-fields-master")!;
  let instancefield = document.getElementById("auth-dialog-fields-instance")!;
  let dialog = document.getElementById("auth-dialog")!;
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
  
}

{
  observeResize(document.body, () => {
    observeBreakpoint("dialog-manual-width");
    observeBreakpoint("content");
  });
}
