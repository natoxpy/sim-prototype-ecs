import { AssetsLoader } from "./assetsLoader";
import { World } from "./world";

export class System {
    public start(world: World) {}
    public update(world: World, timedelta: number) { }
}

export class SystemManager {
    public systems: Array<System> = [];

    public addSystem<T extends System>(system: T): this {
        this.systems.push(system);
        return this;
    }
}