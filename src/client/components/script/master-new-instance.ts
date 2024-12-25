import { TextField, Button, snackbar } from "mdui";

const initlistener = () => {
  let name = document.getElementById(
    "master-new-instance-name-field"
  )! as TextField;
  let id = document.getElementById(
    "master-new-instance-id-field"
  )! as TextField;
  let button = document.getElementById("master-new-instance-button")! as Button;
  button.addEventListener("click", () => {
    if (+name.reportValidity() + +id.reportValidity() == 2) {
    }
  });
};

export default initlistener;
