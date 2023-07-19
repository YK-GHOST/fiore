import { Mesh, Program, Transform, Texture } from 'ogl';

import fragment from 'shaders/plane-fragment.glsl';
import vertex from 'shaders/plane-vertex.glsl';

export default class {
  constructor({ element, geometry, gl, index, scene }) {
    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.index = index;
    this.scene = scene;

    this.createTexture();
    this.createProgram();
    this.createMesh();
  }

  createTexture() {
    this.texture = new Texture(this.gl);

    this.image = new Image();
    this.image.crossOrigin = 'anonymous';
    this.image.src = this.element.getAttribute('data-src');
    this.image.onload = () => (this.texture.image = this.image);

    console.log(this.element);
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

    this.mesh.position.x += this.index * this.mesh.scale.x;
  }
}
