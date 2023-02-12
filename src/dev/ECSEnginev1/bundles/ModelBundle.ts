import { Bundle } from "../core/bundle";
import { Component, Entity } from "../core/entity";
import { OpenWorld } from "../core/world";

import * as THREE from 'three';

import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class GLTFModel extends Component {
    public gltf: GLTF;

    constructor(gltf: GLTF) {
        super();
        this.gltf = gltf;
    }

    static loadModel(path: string, onload: (model: GLTFModel) => void) {
        let loader = new GLTFLoader();

        loader.load(path, (gltf) => {
            onload(new GLTFModel(gltf));
        });
    }
}

export interface GLTFModelBundleProps<T> {
    stage?: keyof T | 'current',
    gltf: GLTFModel
}

export class GLTFBundle<T> implements Bundle<T> {
    public forStage: keyof T | 'current';
    public model: GLTFModel;

    constructor({ stage, gltf }: GLTFModelBundleProps<T>) {
        if (stage == undefined) stage = 'current';

        this.forStage = stage;
        this.model = gltf;
    }

    spawn(world: OpenWorld<T>): Entity {
        let stage = world.stagesManager.getStage(this.forStage);
        let entity = world.entityManager.createEntity();

        entity.addComponent(this.model);

        stage.scene.add(this.model.gltf.scene);

        return entity;
    }
}