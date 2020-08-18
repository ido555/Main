import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy, OnInit} from '@angular/core';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

@Injectable({providedIn: 'root'})
export class EngineService implements OnDestroy , OnInit{
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene = new THREE.Scene();
  private light: THREE.AmbientLight;

  private loader = new GLTFLoader();

  private cube: THREE.Mesh;

  private frameId: number = null;

  public constructor(private ngZone: NgZone) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {

    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene

    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 10;
    this.scene.add(this.camera);
    const controls = new OrbitControls(this.camera, this.canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    this.loader.load("http://localhost:8080/waterbottle/glTF-Binary/WaterBottle.glb",
      (object) => {
      console.log(object)
      console.log(this.scene)
      this.scene.add(object.scene)
      }, undefined , (err) => console.log(err))


    // soft white light
    this.light = new THREE.AmbientLight(0x404040);
    this.light.position.z = 10;
    this.scene.add(this.light);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
