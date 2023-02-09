import { v4 as uuidV4 } from 'uuid';

export class Entity {
    uuid: string;
    constructor(..._args: any) {
        this.uuid = uuidV4();
    }
}

export class Component { }

export class EntityManager<EntityType = Entity> {
    public entities: Array<EntityType> = [];

    public addEntity<T extends EntityType>(entity: T): this {
        this.entities.push(entity);

        return this;
    }

    public for<T extends typeof Entity>(entity_to_query: T) {
        var isolatedEntityManager = new EntityManager<InstanceType<T>>();
        
        for (let entity of this.entities) {
            if (entity instanceof entity_to_query) {
                isolatedEntityManager.addEntity(entity as InstanceType<T>);
            }
        }

        return isolatedEntityManager
    }

    public query_entity<T extends typeof Component>(component: T, query_for: Entity) {
        let entity: any;

        for (entity of this.entities) {
            if (entity !== query_for) continue;

            for (let componentName of Object.getOwnPropertyNames(entity)) {
                let entityComponent = entity[componentName];
                if (entityComponent == undefined) continue;

                if (entityComponent instanceof component && entityComponent instanceof Component) {
                    return entityComponent as InstanceType<T>;
                }
            }
        }

        throw new Error(`Entity ${entity} did not contain ${component}`);
    }

    public query<T extends typeof Component>(component: T) {
        let entity: any;
        let results: Array<{
            component: InstanceType<T>,
            entity: EntityType 
        }> = [];

        for (entity of this.entities) {
            for (let componentName of Object.getOwnPropertyNames(entity)) {
                let entityComponent = entity[componentName];
                if (entityComponent == undefined) continue;

                if (entityComponent instanceof component && entityComponent instanceof Component) {
                    results.push({
                        component: entityComponent as InstanceType<T>,
                        entity: entity
                    })
                }
            }
        }

        return results;
    }
};