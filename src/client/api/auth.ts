import { Button, Checkbox, Dialog, snackbar, TextField } from "mdui";
import axios from "axios";
import _log from "../lib/log";
import { route } from "../components/router";
const log = new _log("auth");
const btn = document.getElementById("auth-dialog-action-button")! as Button;
const dialog = document.getElementById("auth-dialog")! as Dialog;
const errHandler = (
  error:
    | "key-instance"
    | "key-master"
    | "connect"
    | "unknownmethod"
    | "wrongtype"
) => {
  let errtext = () => {
    switch (error) {
      case "key-instance":
        return "实例 ID 或密钥错误";
      case "key-master":
        return "主 API 密钥错误";
      case "connect":
        return "无法连接至 API 服务";
      case "unknownmethod":
        return "未知错误（取出了未知的 auth_method），请重试";
      case "wrongtype":
        return "未知错误（API 返回类型错误），请检查 API 服务是否正常运行";
    }
  };
  dialog.open = true;
  let errdesc = document.getElementById("auth-dialog-desc-err")!;
  errdesc.classList.remove("hidden");
  errdesc.innerHTML += errtext();
  document.getElementById("auth-dialog-desc-norm")!.classList.add("hidden");
  return;
};
const successHandler = (
  type: "instance" | "master",
  token: string,
  expires: number
): void => {
  if (!(typeof token === "string" && typeof expires === "number")) {
    errHandler("wrongtype");
    return;
  }
  window.miracle.api.type = type;
  window.miracle.api.token = token;
  window.miracle.api.expires = expires;
  dialog.open = false;
  snackbar({ message: "身份验证成功", closeable: true, queue: "miracle" });
  route("/");
};
const setbtnloading = () => {
  btn.loading = true;
  btn.disabled = true;
};

const unsetbtnloading = () => {
  btn.loading = false;
  btn.disabled = false;
};

{
  let auth_method = localStorage.getItem("auth-method");
  if (!auth_method) {
    dialog.open = true;
  } else {
    let e: any = null;
    if (auth_method === "master") {
      axios
        .post(
          "/api/v1/web/auth/master",
          JSON.parse(localStorage.getItem("auth-body")!)
        )
        .then((res) => {
          if (!res.data.success) {
            errHandler("key-master");
          } else {
            successHandler("master", res.data.token, res.data.expires);
          }
        })
        .catch((_e) => (e = _e));
    } else if (auth_method === "instance") {
      axios
        .post(
          "/api/v1/web/auth/instance",
          JSON.parse(localStorage.getItem("auth-body")!)
        )
        .then((res) => {
          if (!res.data.success) {
            errHandler("key-instance");
          } else {
            successHandler("instance", res.data.token, res.data.expires);
          }
        })
        .catch((_e) => (e = _e));
    } else {
      log.error("Unknown auth method");
      errHandler("unknownmethod");
    }
    if (e) {
      errHandler("connect");
    }
  }
}

btn.addEventListener("click", async () => {
  setbtnloading();
  const mastercb = document.getElementById(
    "auth-dialog-master-checkbox"
  )! as Checkbox;
  const savecb = document.getElementById(
    "auth-dialog-save-checkbox"
  )! as Checkbox;
  if (mastercb.checked) {
    const master_key = document.getElementById(
      "auth-input-master-key"
    )! as TextField;
    let res = await axios.post("/api/v1/web/auth/master", {
      key: master_key.value,
    });
    unsetbtnloading();
    if (savecb.checked) {
      localStorage.setItem("auth-method", "master");
      localStorage.setItem(
        "auth-body",
        JSON.stringify({
          key: master_key.value,
        })
      );
    }
    if (res.data.success) {
      successHandler("master", res.data.token, res.data.expires);
    } else {
      errHandler("key-master");
    }
    console.log(res.data);
  } else {
    const id = document.getElementById("auth-input-instance-id")! as TextField;
    const instance_key = document.getElementById(
      "auth-input-instance-key"
    )! as TextField;
    let res = await axios.post("/api/v1/web/auth/instance", {
      id: id.value,
      key: instance_key.value,
    });
    unsetbtnloading();
    if (savecb.checked) {
      localStorage.setItem("auth-method", "instance");
      localStorage.setItem(
        "auth-body",
        JSON.stringify({
          id: id.value,
          key: instance_key.value,
        })
      );
    }
    if (res.data.success) {
      successHandler("instance", res.data.token, res.data.expires);
    } else {
      errHandler("key-instance");
    }
    console.log(res.data);
  }
});

export const check_token_expire = (): boolean => {
  if (Date.now() < window.miracle.api.expires) {
    return true;
  } else {
    return false;
  }
};
