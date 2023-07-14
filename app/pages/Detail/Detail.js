import Page from 'classes/Page';

export default class Detail extends Page {
  constructor() {
    super({
      id: 'Detail',
      element: '.detail',
      elements: {
        title: '.detail__title',
      },
    });
  }
}
