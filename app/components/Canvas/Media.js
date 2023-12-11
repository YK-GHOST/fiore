import GSAP from 'gsap';
import { Mesh, Program, Transform, Texture } from 'ogl';

import fragment from 'shaders/plane-fragment.glsl';
import vertex from 'shaders/plane-vertex.glsl';

export default class {
  constructor({ element, geometry, gl, index, scene, sizes }) {
    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.index = index;
    this.scene = scene;
    this.sizes = sizes;

    this.createTexture();
    this.createProgram();
    this.createMesh();

    this.extra = {
      x: 0,
      y: 0,
    };
  }

  createTexture() {
    this.texture = new Texture(this.gl);

    this.image = new Image();
    this.image.crossOrigin = 'anonymous';
    this.image.src = this.element.getAttribute('data-src');
    this.image.onload = () => (this.texture.image = this.image);
  }

  createProgram() {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: { value: this.texture },
      },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.setParent(this.scene);
  }

  createBounds({ sizes }) {
    this.bounds = this.element.getBoundingClientRect();
    this.sizes = sizes;

    this.updateScale();
    this.updateX();
    this.updateY();
  }

  updateScale() {
    this.height = this.bounds.height / window.innerHeight;
    this.width = this.bounds.width / window.innerWidth;

    this.mesh.scale.x = this.sizes.width * this.width;
    this.mesh.scale.y = this.sizes.height * this.height;
  }

  updateX(x = 0) {
    this.x = (this.bounds.left + x) / window.innerWidth;
    this.mesh.position.x = (-this.sizes.width / 2 ) + (this.mesh.scale.x / 2) + (this.x * this.sizes.width) + this.extra.x; // prettier-ignore
  }

  updateY(y = 0) {
    this.y = (this.bounds.top + y) / window.innerHeight;
    this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2 ) - (this.y * this.sizes.height) + this.extra.y; // prettier-ignore
  }

  update(scroll) {
    if (!this.bounds) return;
    this.updateX(scroll.x);
    this.updateY(scroll.y);

    this.media;
  }

  onResize(sizes) {
    this.createBounds(sizes);
  }
}
