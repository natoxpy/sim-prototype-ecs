import { Object3D } from "three";

export class Result<T> {
    private value: T | undefined;
    constructor(value?: T) { this.value = value; }

    public notNull(cb: (value: T) => void) {
        if (this.value != undefined || this.value != null) {
            cb(this.value);
        }
    }

    public toValue(): T {
        if (this.value != undefined) {
            return this.value;
        } 

        throw new TypeError("Value was undefined!");
    }
}

export abstract class Component {
    constructor(..._args: any) { }
}

export class Entity {
    private components: {
        regular: Array<Component>,
        threejs: Array<Object3D>
    } = {
            regular: [],
            threejs: []
        };

    private id: number;

    constructor(id: number) {
        this.id = id;
    }

    private hasComponent<T extends Component | Object3D>(component: new () => T): boolean {
        for (let regularComponent of this.components.regular) {
            if (regularComponent instanceof component) return true;
        }

        for (let threeComponent of this.components.threejs) {
            if (threeComponent instanceof component) return true;
        }

        return false;
    }

    public addComponent<T extends Component | Object3D>(component: T) {
        if (this.hasComponent(Object.create(component).constructor as (new () => T))) {
            console.warn('Tried to put more then one instance of a component in a single entity!\n', component);
            return this;
        };


        if (component instanceof Component) {
            this.components.regular.push(component);
        } else {
            this.components.threejs.push(component);
        }

        return this;
    }

    public getComponent<T extends typeof Component | typeof Object3D>(componentType: T): Result<InstanceType<T>> {        
        for (let entityComponents of this.components.regular) {
            if (entityComponents instanceof componentType) {
                return new Result(entityComponents as InstanceType<T>);
            }
        }

        for (let entityComponents of this.components.threejs) {

            if (entityComponents instanceof componentType) {
                return new Result(entityComponents as InstanceType<T>);
            }
        }

        return new Result();
    }
}

export class EntityManager {
    private entityCount: number = 0;
    private entities: Entity[] = [];

    public createEntity(): Entity {
        this.entityCount++;
        let entity = new Entity(this.entityCount);
        this.entities.push(entity)

        return entity;
    }


    /**
     * This is what the systems should be using to Query components and other entities.
     */
    public getEntities() {
        return new Entities(this.entities);
    }

    public getEntitiesArray() {
        return this.entities;
    }
}

/**
 * @description Gives system access to the entities and their components
 */
export class Entities implements Iterable<Entity> {
    private entityManager: EntityManager | Entity[];

    constructor(entityManager: EntityManager | Entity[]) {
        this.entityManager = entityManager;
    }

    public [Symbol.iterator](): Iterator<Entity, Entity> {
        let entities: Entity[];

        if (this.entityManager instanceof EntityManager) {
            entities = this.entityManager.getEntitiesArray();
        } else {
            entities = this.entityManager;
        }

        let entitiesIter = entities[Symbol.iterator]()

        return {
            next: () => {
                return entitiesIter.next();
            }
        }
    }

    /**
     * @param componentsRequiered A deconstructed array of classes use for queries each entity and verifing that entity contains such component. 
     * @returns Creates new `Entities` instance that only includes `Entity` that has the components requiered
     */
    entitiesWith<T extends typeof Component | typeof Object3D>(...componentsRequiered: Array<T>): Entities {
        let entitiesWithComponent: Entity[] = [];

        for (let entity of this) {
            for (let componentQuery of componentsRequiered) {
                entity.getComponent(componentQuery).notNull((_) =>
                    entitiesWithComponent.push(entity));
            }
        }

        return new Entities(entitiesWithComponent);
    }

    /**
     * @description Check every single entity for the component provided and return an array of every single component from the same type. 
     * @param Component Component to query every entity and find all of the components from the same type. 
     */
    getComponents<T extends typeof Component | typeof Object3D>(component: T): Array<InstanceType<T>> {
        let componentsFound: Array<InstanceType<T>> = [];

        for (let entity of this) {
            entity.getComponent(component).notNull((value) => {
                componentsFound.push(value);
            })
        }

        return componentsFound;
    }
}