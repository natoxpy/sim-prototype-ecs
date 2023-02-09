import { Material, Mesh, Object3D } from "three";
import { Bundle } from "../core/bundle";
import { BasicMaterial, Geometry, Transform } from "../components/Standard";
import { Entity, EntityManager } from "../core/entity";
import { System } from "../core/system";
import { World } from "../core/world";

// Primary entity
export class PrimitiveEntity extends Entity {
    transform: Transform;
    material: BasicMaterial;
    geometry: Geometry;
    mesh!: Mesh;

    constructor(transform: Transform, geometry: Geometry, material: BasicMaterial) {
        super();

        this.transform = transform;
        this.geometry = geometry;
        this.material = material;
    }
}

// System to make material and geometry work 

class PrimitiveSystem extends System {
    public start({ entityManager, scene }: World): void {
        let transforms = entityManager.for(PrimitiveEntity).query(Transform);

        for (let { entity } of transforms) {
            if (entity.mesh != undefined) continue;
            
            let ecsGeometry = entityManager.query_entity(Geometry, entity);
            let ecsMaterial = entityManager.query_entity(BasicMaterial, entity);
            
            entity.mesh = new Mesh(ecsGeometry.geometry, ecsMaterial.material);
            
            let {x: px, y: py, z: pz} = entity.transform.position;
            entity.mesh.position.set(px, py, pz)
            let {x: rx, y: ry, z: rz} = entity.transform.rotate;
            entity.mesh.rotation.set(rx, ry, rz)

            entity.transform.position = entity.mesh.position;
            entity.transform.rotate = entity.mesh.rotation;

            scene.add(entity.mesh);
        }
    }
}


export class PrimitiveBundle extends Bundle {
    private entity: PrimitiveEntity;

    constructor({transform, geometry, material}: {transform: Transform, geometry: Geometry, material: BasicMaterial}) {
        super();

        this.entity = new PrimitiveEntity(transform, geometry, material);
    }

    public spawn(world: World): void {
        world.addEntity(this.entity);
        world.addSystem(new PrimitiveSystem());
    }
}
