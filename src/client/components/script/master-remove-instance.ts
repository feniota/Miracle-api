import {
  type Button,
  ButtonIcon,
  type Card,
  type Dialog,
  type Icon,
  snackbar,
} from "mdui";
import type { MiracleClientInstance } from "../../lib/globalvar";
import axios from "axios";
import { route } from "../router";
import { ResError } from "../../../server/api/types";

const initlistener = () => {
  const instance_card = document.getElementsByClassName("instance-card");
  const storage = document.getElementById("remove-instance-storage")!;
  const topappbar = document.getElementById("appbar")!;
  const toptitle = document.getElementById("top-title")!;
  const dark_mode_dropdown =
    document.getElementById("dark-mode-select")!.parentElement!;
  const confirm_dialog = document.getElementById(
    "remove-instance-dialog",
  )! as Dialog;
  const dialog_desc = document.getElementById("remove-instance-dialog-desc")!;
  const submit_button = new ButtonIcon();
  submit_button.icon = "delete_forever";
  submit_button.onclick = () => {
    const selected = JSON.parse(
      storage.getAttribute("data-selected-items")!,
    ) as Array<MiracleClientInstance>;
    dialog_desc.innerText = `这将删除 ${
      selected.length
    } 个实例：${selected.reduce((acc, cur, _index) => {
      if (_index === 0) {
        return `${cur.name}`;
      }
      return `${acc}、${cur.name}`;
    }, "")}`;
    confirm_dialog.open = true;
  };

  const undo = () => {
    topappbar.classList.remove("master-remove-instance-selecting");
    dark_mode_dropdown.classList.remove("hidden");
    topappbar.removeChild(submit_button);
  };

  const button_cancel = document.getElementById(
    "remove-instance-dialog-cancel",
  )! as Button;
  button_cancel.addEventListener("click", () => {
    confirm_dialog.open = false;
  });
  const button_ok = document.getElementById(
    "remove-instance-dialog-ok",
  )! as Button;
  button_ok.addEventListener("click", () => {
    if (window.miracle.api.type !== "master") {
      snackbar({ message: "错误：非主 API 密钥不允许删除实例" });
      return;
    }
    const selected = JSON.parse(
      storage.getAttribute("data-selected-items")!,
    ) as Array<MiracleClientInstance>;
    confirm_dialog.closeOnEsc = false;
    confirm_dialog.closeOnOverlayClick = false;
    button_cancel.disabled = true;
    button_ok.loading = true;
    axios
      .post("/api/v1/web/instances/remove", {
        token: window.miracle.api.token,
        instances: selected.map((item) => item.id),
      })
      .then((res) => {
        const data = ResError.check(res.data);
        button_ok.loading = false;
        button_cancel.disabled = false;
        if (data.success) {
          undo();
          snackbar({ message: "删除成功" });
          route("/master/remove-instance/");
        } else {
          snackbar({ message: `删除失败：${data.msg}` });
          confirm_dialog.closeOnEsc = true;
          confirm_dialog.closeOnOverlayClick = true;
        }
      })
      .catch((e) => {
        button_ok.loading = false;
        confirm_dialog.closeOnEsc = true;
        confirm_dialog.closeOnOverlayClick = true;
        button_cancel.disabled = false;
        console.error(e);
        snackbar({ message: `删除失败：${e}` });
      });
  });

  if (instance_card) {
    //(Array.from(instance_card) as Card[]).forEach((element) => {
    for (const element of Array.from(instance_card) as Card[]) {
      element.addEventListener("click", () => {
        element.classList.toggle("miracle-selected");
        let selected = JSON.parse(
          storage.getAttribute("data-selected-items")!,
        ) as Array<MiracleClientInstance>;
        if (element.classList.contains("miracle-selected")) {
          (element.querySelector("mdui-icon")! as Icon).name = "check_circle";
          selected.push({
            id: element.getAttribute("data-miracle-instance-id")!,
            name: element.getAttribute("data-miracle-instance-name")!,
          });
          storage.setAttribute("data-selected-items", JSON.stringify(selected));
        } else {
          (element.querySelector("mdui-icon")! as Icon).name = "dns";
          selected = selected.filter((item) => {
            return item.id !== element.getAttribute("data-miracle-instance-id");
          });
          storage.setAttribute("data-selected-items", JSON.stringify(selected));
        }
        if (selected.length !== 0) {
          topappbar.classList.add("master-remove-instance-selecting");
          toptitle.innerText = `删除实例 - 已选择 ${selected.length} 个`;
          dark_mode_dropdown.classList.add("hidden");
          topappbar.appendChild(submit_button);
        } else {
          toptitle.innerText = "删除实例";
          undo(); //因为它要复用，上面的那个不要，所以单独放进一个函数
        }
      });
    }
  }
};

export default initlistener;
