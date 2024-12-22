import { breakpoint } from "mdui";
export function observeBreakpoint(class_suffix: string): void {
  if (breakpoint().up("md")) {
    Array.from(document.getElementsByClassName(`-sm-${class_suffix}`)).forEach(
      (element) => {
        element.classList.remove(`-sm-${class_suffix}`);
        element.classList.add(`-md-${class_suffix}`);
      }
    );
  } else {
    Array.from(document.getElementsByClassName(`-md-${class_suffix}`)).forEach(
      (element) => {
        element.classList.remove(`-md-${class_suffix}`);
        element.classList.add(`-sm-${class_suffix}`);
      }
    );
  }
}
