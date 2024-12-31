import "./style.css";
import "mdui/mdui.css";
import "mdui";
import {
  breakpoint,
  Menu,
  NavigationDrawer,
  observeResize,
  setTheme,
} from "mdui";
import { observeBreakpoint } from "./lib/breakpoint";
import "./api/auth";
import "./lib/globalvar";
import { back } from "./components/router";
import Log from "./lib/log";
import { Theme } from "mdui/internal/theme";

const drawer = document.getElementById(
  "navigation-drawer"
)! as NavigationDrawer;

const log = new Log("main");

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
  const darkmode = document.getElementById("dark-mode-select")! as Menu;
  darkmode.addEventListener("change", () => {
    if (
      darkmode.value === "dark" ||
      darkmode.value === "light" ||
      darkmode.value === "auto"
    ) {
      localStorage.setItem("dark-mode", darkmode.value);
      setTheme(darkmode.value);
    } else {
      log.error("Invalid dark mode choice: " + darkmode.value);
    }
  });
  const storage_dark = localStorage.getItem("dark-mode");
  if (storage_dark) {
    darkmode.value = storage_dark || "auto";
    setTheme(storage_dark as Theme);
  }
}

{
  const resize_functions = () => {
    breakpoint().up("md") ? (drawer.open = true) : (drawer.open = false);
    observeBreakpoint("dialog-manual-width");
    observeBreakpoint("content");
    observeBreakpoint("main");
  };
  observeResize(document.body, resize_functions);
  // 确保在加载完页面后执行一次
  resize_functions();
}
