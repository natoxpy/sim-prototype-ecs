import { BoxGeometry, Camera, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, PointLight, Renderer, Scene, WebGLRenderer } from "three";
import { Bundle } from "./bundle";
import { Entity, EntityManager } from "./entity";
import { System, SystemManager } from "./system";

export class World {
    public entityManager: EntityManager; 
    public systemManager: SystemManager;
    public scene: Scene;
    public renderer: Renderer;
    public camera: Camera;

    constructor(entityManager: EntityManager, systemManager: SystemManager) {
        this.entityManager = entityManager;
        this.systemManager = systemManager;

        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer();

        this.camera.position.z = 5;
        document.body.appendChild(this.renderer.domElement);
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    public render() {
        this.renderer.render(this.scene, this.camera);
    }

    // Basics
    public addPlugin(cb: (entityManager: EntityManager, systemManager: SystemManager) => void) {
        cb(this.entityManager, this.systemManager);
    }

    public addEntity<T extends Entity>(entity: T): this {
        this.entityManager.entities.push(entity);

        return this;
    }

    public addSystem<T extends System>(system: T): this {
        this.systemManager.addSystem(system);
        return this;
    }

    public spawnBundle(bundle: Bundle) {
        bundle.spawn(this);
    }
}
