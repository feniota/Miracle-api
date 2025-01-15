import type { Button, TextField } from "mdui";

const initlistener = () => {
  // @ts-ignore
  const textfield = document.getElementById(
    "instance-config-text-field",
  )! as TextField;
  // @ts-ignore
  const button = document.getElementById("instance-config-button")! as Button;
};
export default initlistener;
