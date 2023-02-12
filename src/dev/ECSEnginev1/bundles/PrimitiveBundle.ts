import { Bundle } from "../core/bundle";
import { Entity } from "../core/entity";
import { OpenWorld } from "../core/world";
import * as THREE from 'three'

export interface PrimitiveBundleProps<T> {
    inStage: keyof T | 'current',
    geometry: THREE.BufferGeometry,
    material: THREE.Material
}

export class PrimitiveBundle<T> implements Bundle<T> {
    public forStage: keyof T | 'current';
    public geometry: THREE.BufferGeometry;
    public material: THREE.Material;

    constructor({ inStage, geometry, material }: PrimitiveBundleProps<T> = {
        inStage: 'current',
        geometry: new THREE.BoxGeometry(1, 1, 1),
        material: new THREE.MeshStandardMaterial({ color: 0x0ff })
    }) {
        this.forStage = inStage;
        this.geometry = geometry;
        this.material = material;
    }

    // how the bundle should spawn 
    spawn(world: OpenWorld<T>): Entity {
        let stage = world.stagesManager.getStage(this.forStage);
        let entity = world.entityManager.createEntity();
        let mesh = new THREE.Mesh(this.geometry, this.material);

        mesh.castShadow = true;
        
        entity.addComponent(mesh);
        stage.scene.add(mesh);

        return entity;
    }
}