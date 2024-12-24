import { route } from "../router";
const initlistener = () => {
  document
    .getElementById("master-settings-add-instance")!
    .addEventListener("click", () => {
      route("/master/new-instance/");
    });
};
export default initlistener;
