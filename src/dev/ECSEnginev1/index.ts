import { PerspectiveCamera, Scene } from "three";
import { Stage } from "./core/stages";
import { SystemFun } from "./core/system";
import { World } from "./core/world";

interface ECSEngineProps<WorldStagesType> {
    /**
     * @example
     * ```
     * class Stages {
     *      city = new Stage(new Scene(), new OrthographicCamera());
     *      apartment = new Stage(new Scene(), new OrthographicCamera());
     *      caffe = new Stage(new Scene(), new OrthographicCamera());
     *  }
     * ```
     */
    stages: WorldStagesType
}

/**
 * Only includes a `Primary` stage with a perspectiveCamera
 */
export class DefaultStages {
    primary = new Stage(new Scene(), new PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight,
        0.1,
        1000));
}


/**
 * A basic ECS engine that uses THREEjs to render object 
 * while using entities components and systems for its structure. 
 */
export class ECSEngine<WorldStagesType> {
    public world: World<WorldStagesType>;

    constructor({ stages }: ECSEngineProps<WorldStagesType>) {
        this.world = new World(stages)
    }

    public addStartupSystem(system: SystemFun<WorldStagesType>) {
        this.world.addStartupSystem(system);

        return this;
    }

    public addSystem(system: SystemFun<WorldStagesType>) {
        this.world.addSystem(system);

        return this;
    }


    public run() {
        requestAnimationFrame((time) => this.gameloop(time));

        this.world.runStartupSystems();

        return this;
    }

    private lastTime = 0;
    private gameloop(time: number) {
        requestAnimationFrame((time) => this.gameloop(time));

        const delta = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.world.renderFrame(delta);
    }
}