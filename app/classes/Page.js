import GSAP from 'gsap';
import each from 'lodash/each';

/**creates a Page object for pages
 * @param {string} element the class of root element of current page
 * @param {Object} elements elements inside of the root element class
 * @param {id} id unique id for each page
 */

export default class Page {
  constructor({ element, elements, id }) {
    this.id = id;
    this.selector = element;
    this.selectorChildren = { ...elements };
  }

  create() {
    this.element = document.querySelector(this.selector);

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
  }

  show() {
    return new Promise((resolve) => {
      GSAP.fromTo(
        this.element,
        {
          autoAlpha: 1,
        },
        {
          autoAlpha: 1,
          onComplete: resolve,
        }
      );
    });
  }

  hide() {
    return new Promise((resolve) => {
      GSAP.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }
}
