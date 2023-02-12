import * as Three from "three";

/**
 * @description This class should only be use inside a class intended to hold only stages. 
 */
export class Stage {
    scene: Three.Scene;
    camera: Three.Camera;

    constructor(scene: Three.Scene, camera: Three.Camera) {
        this.scene = scene;
        this.camera = camera;
    }
}

/**
 * Stages allows to have multiple plane world to work with
 * more documentation is available in the ECSEngine Props description
 */
export class StagesManager<T> {
    public stages: T;
    public currentStage: keyof T;
    public renderer: Three.WebGLRenderer;

    constructor(stages: T) {
        this.stages = stages;
        let current = Object.entries(stages as any)[0][0] as keyof T;
        this.renderer = new Three.WebGLRenderer();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this.renderer.domElement);

        console.debug("Current was set to " + String(current));

        this.currentStage = current;
    }

    public selectStage(stage: keyof T) {
        this.currentStage = stage;
    }

    public getStage(name: keyof T | 'current'): Stage {
        if (name == 'current') 
            return this.stages[this.currentStage] as Stage;
        else 
            return this.stages[name] as Stage;
    }

    public render() {
        let stage = this.getStage('current');

        this.renderer.render(stage.scene, stage.camera);
    }

    public getRestricted() {
        return new RestrictedStages(this);
    }
}


/**
 * Allows for surface level access to the stages for systems
 */
export class RestrictedStages<T> {
    private stages: StagesManager<T>;

    constructor(stages: StagesManager<T>) {
        this.stages = stages;
    }

    public selectStage(stage: keyof T) {
        this.stages.selectStage(stage);
    }

    public isOnStage(stage: keyof T): boolean {
        return this.stages.currentStage == stage;
    }

    public getStage(name: keyof T | 'current'): Stage {
        return this.stages.getStage(name);
    }
}