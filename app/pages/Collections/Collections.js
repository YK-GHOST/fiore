import Page from 'classes/Page';

export default class Collections extends Page {
  constructor() {
    super({
      id: 'Collections',
      element: '.collections',
      elements: {
        title: '.collections__title',
      },
    });
  }
}
