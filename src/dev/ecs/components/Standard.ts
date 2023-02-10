import { Euler, Vector3 } from "three";
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