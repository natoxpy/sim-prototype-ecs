import { AmbientLight, BoxGeometry, Euler, MeshNormalMaterial, PointLight, Scene, Vector3 } from "three";
import { ECS } from "../dev/ecs";
import { PrimitiveBundle } from "../dev/ecs/bundles/primitiveBundle";
import { Transform } from "../dev/ecs/components/Standard";
import { System } from "../dev/ecs/core/system";
import { World } from "../dev/ecs/core/world";
import { Asset, AssetsLoader } from "../dev/ecs/core/assetsLoader";
import { ModelBundle } from "../dev/ecs/bundles/ModelBundle";

class SpawnOnStart extends System {
    public start(world: World): void {
        new PrimitiveBundle({
            geometry: new BoxGeometry(100, 100, 0.3),
            material: new MeshNormalMaterial(),
            transform: new Transform(new Vector3(0, 0, -30), new Euler())
        }).spawn(world);
    }
}


class Load3DModel extends System {
    addLights(scene: Scene) {
        let light = new AmbientLight(0xffffff);
        scene.add(light);
        let point = new PointLight();
        point.intensity = 10;
        point.position.z += 10;
        scene.add(point);
    }

    public start(world: World<Assets>): void {
        this.addLights(world.scene);

        new ModelBundle({
            model: world.assets.car_model.use()
        }).spawn(world);
    }
}

// ASSET LOADER 

class Assets extends AssetsLoader {
    car_model: Asset = new Asset("tmodel.glb");
}

export async function mainTest() {
    let ecs = new ECS(Assets)
        .addStartupSystem(new SpawnOnStart())
        .addStartupSystem(new Load3DModel());

    let err = await ecs.run();
    if (err != undefined)
        console.log("execution ended before end time! \n", err);
}
