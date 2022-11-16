import { MutableRefObject, RefObject } from 'react';
import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Options {
  axesHelper?: number;
  orbitControls?: boolean;
}

class Renderer {
  private initialized = false;
  private scene: T.Scene;
  private camera: T.PerspectiveCamera;
  private renderer: T.WebGLRenderer;
  private mountRef: MutableRefObject<HTMLDivElement>;
  private options: Options = {};
  private controls: OrbitControls;
  private resizeListener: () => void;

  init(mountRef: RefObject<HTMLDivElement>, opts: Options = {}) {
    if (this.initialized || !mountRef.current) {
      return;
    }

    this.mountRef = mountRef as MutableRefObject<HTMLDivElement>;
    this.options = opts;

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initDom();
    this.initAxesHelper();
    this.initControls();
    this.initResize();

    this.render();

    this.initialized = true;
  }

  unmount() {
    this.mountRef.current?.removeChild(this.mountRef.current.children[0]);
    this.initialized = false;

    window.removeEventListener('resize', this.resizeListener);
  }

  addToScene(...objects: T.Object3D<T.Event>[]) {
    this.scene.add(...objects);
  }

  private initScene() {
    this.scene = new T.Scene();
  }

  private initCamera() {
    this.camera = new T.PerspectiveCamera(
      75,
      this.mountRef.current.clientWidth / this.mountRef.current.clientHeight,
      0.1,
      1000
    );

    this.camera.position.z = 5;
    this.camera.position.y = 0;
    this.camera.position.x = 0;
  }

  private initRendererState() {
    this.renderer.setSize(
      this.mountRef.current.clientWidth,
      this.mountRef.current.clientHeight
    );

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private initRenderer() {
    this.renderer = new T.WebGLRenderer();

    this.initRendererState();
  }

  private initDom() {
    this.mountRef.current.appendChild(this.renderer.domElement);
  }

  private initAxesHelper() {
    if (this.options.axesHelper) {
      this.scene.add(new T.AxesHelper(this.options.axesHelper));
    }
  }

  private initControls() {
    if (!this.options.orbitControls) {
      return;
    }

    this.controls = new OrbitControls(this.camera, this.mountRef.current);
    this.controls.enableDamping = true;
  }

  private resize() {
    this.initRendererState();

    this.camera.aspect =
      this.mountRef.current.clientWidth / this.mountRef.current.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  private initResize() {
    this.resizeListener = this.resize.bind(this);
    window.addEventListener('resize', this.resizeListener);
  }

  private render() {
    requestAnimationFrame(() => this.render());

    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  }
}

const renderer = new Renderer();

export function useRenderer() {
  return renderer;
}
