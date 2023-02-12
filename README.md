# ECS Engine v1 
The engine v1 is still in progress. 

## Engine Features
- [x] Basic ECS
- [x] Advance type annotations
- [x] Basic GLTB Model loader 
- [ ] Bug check and extensive testing 
- [ ] Asset loader
- [ ] new future features expected 

## Basic Engine usage 
This examples shows a basic ECS usage case with a single primitive and a animation with a system.
```ts
function basicSystem({ world }: SystemProps<DefaultStages>) {
    world.spawn(
        new PrimitiveBundle()
    )
}

function basicAnimation({ entities, deltatime }: SystemProps<DefaultStages>) {
    for (let mesh of entities.getComponents(Three.Mesh)) {
        mesh.rotation.x += 1.0 * deltatime;
        mesh.rotation.y += 1.0 * deltatime;
    }
}

new ECSEngine({
    stages: new DefaultStages()
})
    .addStartupSystem(basicSystem)
    .addSystem(basicAnimation)
    .run();
```


### 3d Model, lights, camera posicion example
```ts 
function addLight({ stages }: SystemProps<DefaultStages>) {
    let stage = stages.getStage('current');
    const light = new THREE.AmbientLight( 0xfff ); // soft white light

    stage.scene.add(light);
    const light2 = new THREE.PointLight( 0xfff, 100, 30 );
    light2.position.set( 1, -2, 4 );
    stage.scene.add( light2 );
}

function changePosition({ entities, deltaTime }: SystemProps<DefaultStages>) {
    for (let model of entities.getComponents(GLTFModel)) {
        model.gltf.scene.rotation.y += 1 * deltaTime;
        model.gltf.scene.rotation.x += 1 * deltaTime;
    }
}

function moveCamera({ stages }: SystemProps<DefaultStages>) {
    let stage = stages.getStage('current');
    stage.camera.position.z = 20;
}

function modelLoadingSystem({ world }: SystemProps<DefaultStages>) {
    GLTFModel.loadModel("/assets/tmodel.glb", gltf => {
        world.spawn(new GLTFBundle({
            gltf: gltf
        }))
    });
}

new ECSEngine({
    stages: new DefaultStages()
})
    .addStartupSystem(modelLoadingSystem)
    .addStartupSystem(moveCamera)
    .addStartupSystem(addLight)
    .addSystem(changePosition)
    .run();
```

### Basic Stages example 
```ts
class MyCustomStages {
    city = new Stage(new Scene(), new OrthographicCamera());
    apartment = new Stage(new Scene(), new OrthographicCamera());
    caffe = new Stage(new Scene(), new OrthographicCamera());
}

function MySystem({ stages }: SystemProps<MyCustomStages>) {
    stages.selectStage("city");
} 

new ECSEngine({stages: new MyCustomStages})
    .addSystem(MySystem)
    .run();

```
