import { BoxGeometry, Euler, MeshBasicMaterial, MeshNormalMaterial, ShadowMaterial, Vector3 } from "three";
import { ECS } from "../dev/ecs";
import { PrimitiveBundle, PrimitiveEntity } from "../dev/ecs/bundles/primitiveBundle";
import { BasicMaterial, Geometry, Transform } from "../dev/ecs/components/Standard";
import { System } from "../dev/ecs/core/system";
import { World } from "../dev/ecs/core/world";

class SpawnOnStart extends System {
    public start(world: World): void {
        new PrimitiveBundle({
            geometry: new Geometry(new BoxGeometry(0.3, 0.3, 0.3)),
            material: new BasicMaterial(new MeshNormalMaterial()),
            transform: new Transform(new Vector3(5, -0.3, 0), new Euler(-100))
        }).spawn(world);

        new PrimitiveBundle({
            geometry: new Geometry(new BoxGeometry(0.3, 0.3, 0.3)),
            material: new BasicMaterial(new MeshNormalMaterial()),
            transform: new Transform(new Vector3(5, -2, 0), new Euler(-100))
        }).spawn(world);
    }
}

class MoverObjeto extends System {
    public update({ entityManager }: World, timedelta: number): void {
        for (let { component } of entityManager.for(PrimitiveEntity).query(Transform)) {
            component.position.x -= 1 * timedelta;
            component.rotate.x += 1 * timedelta;
            component.rotate.z -= 1 * timedelta;
        }
    }
}

export function mainTest() {
    new ECS()
        .addStartupSystem(new SpawnOnStart())
        .addSystem(new MoverObjeto())
        .run();
}