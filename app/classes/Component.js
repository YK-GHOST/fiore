import EventEmiter from 'events';
import each from 'lodash/each';

/**creates a Page object for pages
 * @param {string} element the class of root element of current page
 * @param {Object} elements elements inside of the root element class
 * @param {id} id unique id for each page
 */

export default class Component extends EventEmiter {
  constructor({ element, elements }) {
    super();
    this.selector = element;
    this.selectorChildren = { ...elements };

    this.create();

    this.addEventHandlers();
  }

  create() {
    if (this.selector instanceof window.HTMLElement) {
      this.element = this.selector;
    } else {
      this.element = document.querySelector(this.selector);
    }

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

  addEventHandlers() {}

  removeEventHandlers() {}
}
