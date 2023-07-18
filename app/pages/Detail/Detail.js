import Page from 'classes/Page';

export default class Detail extends Page {
  constructor() {
    super({
      id: 'Detail',
      element: '.detail',
      elements: {
        button: '.detail__button',
      },
    });
  }

  create() {
    super.create();

    this.link = new Button({
      element: this.elements.link,
    });
  }

  destroy() {
    super.destroy();

    this.link.removeEventListeners();
  }
}
