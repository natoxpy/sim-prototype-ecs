import { BoxGeometry, Euler, Material, MeshBasicMaterial, Vector3 } from "three";
import { Component } from "../core/entity";

export class Transform extends Component {
    position: Vector3;
    rotate: Euler;

    constructor(
        position: Vector3 = new Vector3(0, 0, 0),
        rotate: Euler = new Euler()
    ) {
        super();
        this.position = position;
        this.rotate = rotate;
    }
}

export class BasicMaterial extends Component {
    material: Material;

    constructor(material: Material = new MeshBasicMaterial({ color: 0xffffff })) {
        super();
        this.material = material;
    }
}

export class Geometry extends Component {
    geometry: THREE.BufferGeometry;

    constructor(geometry: THREE.BufferGeometry = new BoxGeometry(1, 1, 1)) {
        super();
        this.geometry = geometry;
    }
}