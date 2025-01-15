import { type Button, type ButtonIcon, snackbar, type TextField } from "mdui";
import { route } from "../router";
import axios from "axios";
const initlistener = () => {
  const add_instance_button = document.getElementById(
    "master-settings-add-instance",
  )! as Button;
  const remove_instance_button = document.getElementById(
    "master-settings-remove-instance",
  )! as Button;
  if (window.miracle.api.type === "instance") {
    add_instance_button.disabled = true;
    remove_instance_button.disabled = true;
  } else {
    add_instance_button.addEventListener("click", () => {
      route("/master/new-instance/");
    });
    remove_instance_button.addEventListener("click", () => {
      route("/master/remove-instance/");
    });
  }

  const weather_key_textfield = document.getElementById(
    "master-settings-weather-key",
  )! as TextField;
  const weather_key_button = document.getElementById(
    "master-settings-weather-key-submit",
  )! as ButtonIcon;
  weather_key_button.addEventListener("click", () => {
    if (weather_key_textfield.value) {
      weather_key_button.loading = true;
      axios
        .post("/api/v1/web/weather-key/set", {
          token: window.miracle.api.token,
          weather_key: weather_key_textfield.value,
        })
        .then((res) => {
          weather_key_button.loading = false;
          if (res.data.success) {
            snackbar({
              message: "设置成功",
            });
          } else {
            snackbar({
              message: `设置失败：${res.data.msg}`,
            });
          }
        })
        .catch((e) => {
          weather_key_button.loading = false;
          console.error(e);
          snackbar({
            message: `设置失败：${e}`,
          });
        });
    }
  });
};
export default initlistener;
