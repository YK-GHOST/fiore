import Component from './Component';

export default class Animation extends Component {
  constructor({ element, elements }) {
    super({ element, elements });

    this.createObserver();
    this.animateOut();
  }

  createObserver() {
    this.obesever = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateIn();
        } else {
          this.animateOut();
        }
      });
    });

    this.obesever.observe(this.element);
  }

  animateIn() {}
  animateOut() {}
}
