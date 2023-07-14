import Page from 'classes/Page';

export default class About extends Page {
  constructor() {
    super({
      element: '.about',
      id: 'About',
      elements: {
        title: '.about__title',
      },
    });
  }
}
