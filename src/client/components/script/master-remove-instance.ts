import { Card } from "mdui";

const initlistener = () => {
  const instance_card = document.getElementsByClassName("instance-card");
  if (instance_card) {
    (Array.from(instance_card) as Card[]).forEach((element) => {
      element.addEventListener("click", () => {
        element.classList.toggle("miracle-selected");
      });
    });
  }
};

export default initlistener;
