import { TextField, Button, snackbar, dialog } from "mdui";
import { ReqNewInstance } from "../../../server/api/types";
import axios from "axios";
import { html } from "../../lib/html";
const initlistener = () => {
  const name = document.getElementById(
    "master-new-instance-name-field"
  )! as TextField;
  const id = document.getElementById(
    "master-new-instance-id-field"
  )! as TextField;
  const button = document.getElementById(
    "master-new-instance-button"
  )! as Button;
  button.addEventListener("click", () => {
    if (+name.reportValidity() + +id.reportValidity() == 2) {
      axios
        .post("/api/v1/web/instances/new", {
          name: name.value,
          id: id.value,
          token: window.miracle.api.token,
        } as ReqNewInstance)
        .then((res) => {
          if (res.data.success) {
            dialog({
              headline: "实例创建成功",
              body: html`<div class="content">
                <span class="desc"
                  >实例 ${name.value}（ID：${id.value}）创建成功，以下是实例的
                  API 密钥。</span
                >
                <span class="err"
                  >该密钥仅出现一次，请妥善保存！</span
                >
                <mdui-text-field variant="outlined" readonly value="${res.data.key}" class="text-field-monospace"></mdui-text-field
              </div>`,
              actions: [
                {
                  text: "确定",
                },
              ],
              closeOnEsc: true,
              closeOnOverlayClick: true,
            });
          } else {
            snackbar({ message: "创建失败：" + res.data.msg });
          }
        });
    }
  });
};

export default initlistener;
