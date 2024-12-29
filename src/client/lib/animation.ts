export function main_fade_out(element: HTMLElement, back?: boolean) {
  const keyframes: Keyframe[] = [
    { opacity: 1 },
    { opacity: 0, transform: back ? "translateY(10px)" : "translateY(-10px)" },
  ];
  const styles = getComputedStyle(element);
  return element.animate(keyframes, {
    duration: parseInt(
      styles.getPropertyValue("--mdui-motion-duration-short4").slice(0, -2)
    ),
    easing: styles.getPropertyValue("--mdui-motion-easing-standard"),
  });
}

export function main_fade_in(element: HTMLElement, back?: boolean) {
  const keyframes: Keyframe[] = [
    { opacity: 0, transform: back ? "translateY(-10px)" : "translateY(10px)" },
    { opacity: 1 },
  ];
  const styles = getComputedStyle(element);
  return element.animate(keyframes, {
    duration: parseInt(
      styles.getPropertyValue("--mdui-motion-duration-medium1").slice(0, -2)
    ),
    easing: styles.getPropertyValue("--mdui-motion-easing-standard"),
  });
}

export function list_item_in(parent: HTMLElement) {
  return new Promise<void>((resolve, _reject) => {
    const keyframes: Keyframe[] = [
      { opacity: 0, transform: "translateY(10px)" },
      { opacity: 1, transform: "translateY(0px)" },
    ];
    const styles = getComputedStyle(parent);
    const total = 30 * (parent.children.length - 1);
    let result: any;
    Array.from(parent.children).forEach((element, index) => {
      let delay = total - index * 30;
      setTimeout(() => ((element as HTMLElement).style.opacity = "1"), delay);
      let anim = element.animate(keyframes, {
        delay,
        duration: parseInt(
          styles.getPropertyValue("--mdui-motion-duration-medium1").slice(0, -2)
        ),
        easing: styles.getPropertyValue("--mdui-motion-easing-standard"),
      });
      if (index === 0) result = anim;
    });

    if (result) {
      result.onfinish = () => {
        resolve();
      };
    } else {
      resolve();
    }
  });
}

export function list_item_out(parent: HTMLElement) {
  return new Promise<void>((resolve, _reject) => {
    const keyframes: Keyframe[] = [
      { opacity: 1, transform: "translateY(0px)" },
      { opacity: 0, transform: "translateY(-10px)" },
    ];
    const styles = getComputedStyle(parent);
    let result: any;
    Array.from(parent.children).forEach((element, index) => {
      let delay = index * 30;
      setTimeout(() => ((element as HTMLElement).style.opacity = "0"), delay);
      let anim = element.animate(keyframes, {
        delay,
        duration: parseInt(
          styles.getPropertyValue("--mdui-motion-duration-short4").slice(0, -2)
        ),
        easing: styles.getPropertyValue("--mdui-motion-easing-standard"),
      });
      if (index === parent.children.length - 1) {
        console.log(element);
        result = anim;
      }
    });
    if (result) {
      result.onfinish = () => {
        resolve();
      };
    } else {
      resolve();
    }
  });
}
