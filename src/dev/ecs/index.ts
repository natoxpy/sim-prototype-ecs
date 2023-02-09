import { Bundle } from "./core/bundle";
import { Entity, EntityManager } from "./core/entity";
import { System, SystemManager } from "./core/system";
import { World } from "./core/world";



export class ECS {
    public entityManager: EntityManager = new EntityManager(); 
    public systemManager: SystemManager = new SystemManager();
    public startUpSystem: SystemManager = new SystemManager();

    public world: World;

    constructor() {
        this.world = new World(this.entityManager, this.systemManager);
    }

    public addBundle<T extends Bundle>(bundle: T) {
        bundle.spawn(this.world);
    }

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

    public addStartupSystem<T extends System>(system: T): this {
        this.startUpSystem.addSystem(system);
        return this;
    }

    public run() {
        this.startUpSystem.systems.forEach(system => {
            system.start(this.world);
        });
        
        this.systemManager.systems.forEach(system => {
            system.start(this.world);
        });


        requestAnimationFrame((t) => { this.gameloop(t) });
    }

    private lastTime = 0;
    private gameloop(time: number) {
        requestAnimationFrame((t) => { this.gameloop(t) });

        this.world.render();
        
        const delta = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.systemManager.systems.forEach(system => {
            system.update(this.world, delta);
        });
    }
}