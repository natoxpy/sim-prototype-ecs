import { Entities } from "./entity";
import { RestrictedStages } from "./stages";
import { RestrictedWorld } from "./world";

export interface SystemProps<T> {
    world: RestrictedWorld<T>;
    entities: Entities;
    deltaTime: number;
    stages: RestrictedStages<T>
}

export type SystemFun<T> = (props: SystemProps<T>) => void;

export class SystemManager<T> {
    private systems: Array<SystemFun<T>> = [];

    public addSystem(system: SystemFun<T>) {
        this.systems.push(system);
    }

    public executeAll(systemProps: SystemProps<T>) {
        for (let system of this.systems) {
            system(systemProps);
        }
    }
}