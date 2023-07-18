import GSAP from 'gsap';

import each from 'lodash/each';
import map from 'lodash/map';

import normalizeWheel from 'normalize-wheel';
import Prefix from 'prefix';

import Title from '../animations/Title';
import Paragraph from '../animations/Paragraph';
import Label from '../animations/Label';
import Highlight from '../animations/Highlight';
/**creates a Page object for pages
 * @param {string} element the class of root element of current page
 * @param {Object} elements elements inside of the root element class
 * @param {id} id unique id for each page
 */

export default class Page {
  constructor({ element, elements, id }) {
    this.id = id;
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationHighlights: '[data-animation="highlight"]',
      animationTitles: '[data-animation="title"]',
      animationParagraphs: '[data-animation="paragraph"]',
      animationLabels: '[data-animation="label"]',
    };

    this.transformPrefix = Prefix('transform');
  }

  create() {
    this.element = document.querySelector(this.selector);

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
    };

    this.elements = {};

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList
      ) {
        this.elements[key] = entry;
      } else if (Array.isArray(entry)) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });

    this.createAnimations();
  }

  createAnimations() {
    this.animations = [];

    //Highlight
    this.animationHighlights = map(
      this.elements.animationHighlights,
      (element) => {
        return new Highlight({
          element,
        });
      }
    );
    this.animations.push(...this.animationHighlights);

    //Titles
    this.animationTitles = map(this.elements.animationTitles, (element) => {
      return new Title({
        element,
      });
    });
    this.animations.push(...this.animationTitles);

    //Paragraph
    this.animationParagraphs = map(
      this.elements.animationParagraphs,
      (element) => {
        return new Paragraph({
          element,
        });
      }
    );

    this.animations.push(...this.animationParagraphs);

    //Label
    this.animationLabels = map(this.elements.animationLabels, (element) => {
      return new Label({
        element,
      });
    });
    this.animations.push(...this.animationLabels);
  }

  show() {
    return new Promise((resolve) => {
      this.animationIn = GSAP.timeline();

      this.animationIn.fromTo(
        this.element,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
        }
      );

      this.animationIn.call(() => {
        this.addListeners();

        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.removeListeners();

      this.animationOut = GSAP.timeline();

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit =
        this.elements.wrapper.clientHeight - window.innerHeight;
    }

    each(this.animations, (animation) => animation.onResize());
  }

  onMousewheel(event) {
    const normalized = normalizeWheel(event);

    this.scroll.target += normalized.pixelY; //TIP normalized wheel
  }

  //DES LERPING
  update() {
    this.scroll.target = GSAP.utils.clamp(
      0,
      this.scroll.limit,
      this.scroll.target
    );

    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      0.1
    );

    if (this.scroll.current < 0.01) {
      this.scroll.current = 0;
    }

    if (this.elements.wrapper) {
      this.elements.wrapper.style[
        this.transformPrefix
      ] = `translateY(-${this.scroll.current}px)`;
    }
  }

  addListeners() {
    window.addEventListener('mousewheel', this.onMousewheel.bind(this));
  }

  removeListeners() {
    window.removeEventListener('mousewheel', this.onMousewheel.bind(this));
  }
}
