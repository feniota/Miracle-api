import { breakpoint } from "mdui";
export function observeBreakpoint(class_suffix: string): void {
  if (breakpoint().up("md")) {
    for (const element of Array.from(
      document.getElementsByClassName(`-md-${class_suffix}`),
    )) {
      element.classList.remove(`-sm-${class_suffix}`);
      element.classList.add(`-md-${class_suffix}`);
    }
  } else {
    for (const element of Array.from(
      document.getElementsByClassName(`-sm-${class_suffix}`),
    )) {
      element.classList.remove(`-md-${class_suffix}`);
      element.classList.add(`-sm-${class_suffix}`);
    }
  }
}
