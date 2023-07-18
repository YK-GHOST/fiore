import GSAP from 'gsap';

//TIP using the singleton OOPS concept
class Colors {
  change({ backgroundColor, color }) {
    GSAP.to(document.documentElement, {
      backgroundColor,
      color,
      duration: 1.5,
    });
  }
}

export const ColorsManager = new Colors();
