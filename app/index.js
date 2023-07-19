import each from 'lodash/each';

import Canvas from 'components/Canvas';

import About from './pages/About/About';
import Collections from './pages/Collections/Collections';
import Detail from './pages/Detail/Detail';
import Home from './pages/Home/Home';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';

class App {
  constructor() {
    this.createContent();

    this.createPreloader();
    this.createNavigation();

    this.createCanvas();

    this.createPages();
    this.addLinkListeners(); //DES: for page routing
    this.addListeners();

    this.update();
  }

  createNavigation() {
    this.navigation = new Navigation({ template: this.template });
  }

  createPreloader() {
    this.preloader = new Preloader();
    this.preloader.once('completed', this.onPreloaded.bind(this)); //DES: creating the event 'completed'
  }

  createCanvas() {
    this.canvas = new Canvas();
  }

  createContent() {
    this.content = document.querySelector('.content'); //DES: selecting the content class
    this.template = this.content.getAttribute('data-template'); //DES: getting the dataset-template
  }

  createPages() {
    this.pages = {
      about: new About(),
      collections: new Collections(),
      detail: new Detail(),
      home: new Home(),
    };

    this.page = this.pages[this.template]; //DES: getting the data from the pages object based on the template value
    this.page.create(); //DES: calling the create function of the current page (coming from Page class)
  }

  /**
   * Events
   */

  onPreloaded() {
    this.preloader.destroy();
    this.onResize();
    this.page.show();
  }

  async onChange(url) {
    await this.page.hide();
    try {
      const request = await fetch(url); //DES fetching the page url
      const html = await request.text(); //DES waiting for the page data

      const div = document.createElement('div'); //DES creating empty div
      div.innerHTML = html; //DES putting the fetch data in the div

      const divContent = div.querySelector('.content'); //DES selelcting the content element

      this.template = divContent.getAttribute('data-template');

      this.navigation.onChange(this.template);

      this.content.setAttribute('data-template', this.template);
      this.content.innerHTML = divContent.innerHTML; //DES replacing the innerHTML of current Page's content element with divContent

      this.page = this.pages[this.template];
      this.page.create();
      this.onResize();
      this.page.show();

      this.addLinkListeners();
    } catch (err) {
      console.log(err);
    }
  }

  onResize() {
    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize();
    }

    if (this.page && this.page.onResize) {
      this.page.onResize();
    }
  }

  /**
   * Loop
   */

  update() {
    if (this.canvas && this.canvas.update) {
      this.canvas.update();
    }

    if (this.page && this.page.update) {
      this.page.update();
    }

    this.frame = window.requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Listeners
   */

  addListeners() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  addLinkListeners() {
    const links = document.querySelectorAll('a');

    each(links, (link) => {
      link.onclick = (event) => {
        event.preventDefault();

        const { href } = link;

        this.onChange(href);
      };
    });
  }
}
new App();
