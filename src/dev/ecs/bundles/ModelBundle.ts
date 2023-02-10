import { Group } from "three";
import { AssetsLoader } from "../core/assetsLoader";
import { Bundle } from "../core/bundle";
import { Entity } from "../core/entity";
import { World } from "../core/world";

export class ModelEntity extends Entity {
    model: Group;
    constructor(model: Group) {
        super();
        this.model = model;
    }
}

export class ModelBundle extends Bundle {
    private model: Group;

    constructor({ model }: { model: Group }) {
        super();
        this.model = model;
    }

    public spawn(world: World<AssetsLoader>): void {
        world.scene.add(this.model);
        world.addEntity(new ModelEntity(this.model));        
    }
}