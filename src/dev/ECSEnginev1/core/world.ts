import { Bundle } from "./bundle";
import { Entity, EntityManager } from "./entity";
import { Stage, StagesManager } from "./stages";
import { SystemFun, SystemManager } from "./system";

export class World<T> {
    private entityManager: EntityManager = new EntityManager();
    private systemManager: SystemManager<T> = new SystemManager();
    private startUpSystemManager: SystemManager<T> = new SystemManager();
    private stagesManager: StagesManager<T>;

    constructor(stages: T) {
        this.stagesManager = new StagesManager(stages);
    }

    public addSystem(system: SystemFun<T>) {
        this.systemManager.addSystem(system);
    }

    public addStartupSystem(system: SystemFun<T>) {
        this.startUpSystemManager.addSystem(system);
    }

    private createRestrictedWorld() {
        return new RestrictedWorld({
            entityManager: this.entityManager,
            systemsManager: this.systemManager,
            startupSystemManager: this.startUpSystemManager,
            stagesManager: this.stagesManager
        })
    }

    
    public runStartupSystems() {
        this.startUpSystemManager.executeAll({
            deltaTime: 0, 
            entities: this.entityManager.getEntities(),
            stages: this.stagesManager.getRestricted(),
            world: this.createRestrictedWorld()
        })
    }

    private runSystems(deltatime: number) {
        this.systemManager.executeAll({
            deltaTime: deltatime,
            entities: this.entityManager.getEntities(),
            world: this.createRestrictedWorld(),
            stages: this.stagesManager.getRestricted()
        });
    }

    public renderFrame(deltatime: number) {
        this.runSystems(deltatime);
        this.stagesManager.render();
    }
}

interface Managers<T> {
    entityManager: EntityManager; 
    systemsManager: SystemManager<T>;
    startupSystemManager: SystemManager<T>;
    stagesManager: StagesManager<T>
}

/**
 * Only used in bundles, allows for full access to system manager and entity manager. 
 */
export class OpenWorld<T> {
    public entityManager: EntityManager;
    public systemManager: SystemManager<T>;
    public startupSystem: SystemManager<T>;
    public stagesManager: StagesManager<T>;

    constructor({ entityManager, startupSystemManager, systemsManager, stagesManager }: Managers<T>) {
        this.entityManager = entityManager;
        this.systemManager = systemsManager;
        this.startupSystem = startupSystemManager;
        this.stagesManager = stagesManager;
    }

    public getCurrentStage(): Stage {
        return this.stagesManager.stages[this.stagesManager.currentStage] as Stage;
    }
}


/**
 * This world is passed for systems, has limited use. 
 * If you want full use look at `OpenWorld` it given to bundles. 
 */
export class RestrictedWorld<T> {
    private entityManager: EntityManager;
    private systemManager: SystemManager<T>;
    private startupSystemManager: SystemManager<T>;
    private stagesManager: StagesManager<T>;

    constructor({ entityManager, startupSystemManager, systemsManager, stagesManager }: Managers<T>) {
        this.entityManager = entityManager;
        this.systemManager = systemsManager;
        this.startupSystemManager = startupSystemManager
        this.stagesManager = stagesManager;
    }

    public spawn(bundle: Bundle<T>): Entity {
        return bundle.spawn(new OpenWorld<T>({
            entityManager: this.entityManager,
            systemsManager: this.systemManager,
            startupSystemManager: this.startupSystemManager,
            stagesManager: this.stagesManager
        }));
    }
}