import { Entity } from "./entity";
import { OpenWorld } from "./world";

export interface Bundle<T> {
    spawn(world: OpenWorld<T>): Entity; 
}