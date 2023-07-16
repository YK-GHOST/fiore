import Page from 'classes/Page';

export default class About extends Page {
  constructor() {
    super({
      element: '.about',
      id: 'About',
      elements: {
        navigation: document.querySelector('.navigation'),
        title: '.about__title',
        wrapper: '.about__wrapper',
      },
    });
  }
}
