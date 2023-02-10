import { BufferGeometry, Material, Mesh, Object3D } from "three";
import { Bundle } from "../core/bundle";
import { Transform } from "../components/Standard";
import { Entity, EntityManager } from "../core/entity";
import { System } from "../core/system";
import { World } from "../core/world";

// Primary entity
export class PrimitiveEntity extends Entity {
    transform: Transform;
    material: Material;
    geometry: BufferGeometry;
    mesh!: Mesh;

    constructor(transform: Transform, geometry: BufferGeometry, material: Material) {
        super();

        this.transform = transform;
        this.geometry = geometry;
        this.material = material;
    }
}

// System to make material and geometry work 

export class PrimitiveBundle extends Bundle {
    private entity: PrimitiveEntity;

    constructor({transform, geometry, material}: {transform: Transform, geometry: BufferGeometry, material: Material}) {
        super();
        this.entity = new PrimitiveEntity(transform, geometry, material);
    }

    public spawn(world: World): void {
        world.addEntity(this.entity);
        this._spawn(world);
    }

    /**
     * 
     */
    private _spawn({ scene }: World) {
        this.entity.geometry

        this.entity.mesh = new Mesh(this.entity.geometry, this.entity.material);
        
        this.linkWithThreeJS();

        scene.add(this.entity.mesh);
    }

    // links Component data to Threejs Object data
    private linkWithThreeJS() {
        let {x: px, y: py, z: pz} = this.entity.transform.position;
        this.entity.mesh.position.set(px, py, pz)

        let {x: rx, y: ry, z: rz} = this.entity.transform.rotate;
        this.entity.mesh.rotation.set(rx, ry, rz)
        
        this.entity.transform.position = this.entity.mesh.position;
        this.entity.transform.rotate = this.entity.mesh.rotation;
    }
}
