import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class Asset {
    path: String;
    asset!: GLTF;

    constructor(path: String) {
        this.path = path;
    }

    use() {
        return this.asset.scene.clone();
    }
}

export class AssetsLoader {
    /**
     * # !!! IMPORTANT !!! 
     * USE `.load` AFTER INITIALIZING
     */
    constructor() { }

    async load(debugMsg: boolean = false): Promise<ErrorEvent | void> {
        let loader = new GLTFLoader();
        let sourceDir: string = "/assets/";

        for (let owned of Object.getOwnPropertyNames(this)) {
            let attr = (this as any)[owned];
            if (attr == undefined) continue;
            if (!(attr instanceof Asset)) continue;

            let res = await AssetsLoader._load(attr, loader, sourceDir, debugMsg);

            if (res != undefined) {
                console.log(1, res);
                return res
            };
        }
    }

    static async _load(asset: Asset, loader: GLTFLoader, sourceDir: string, debugMsg: boolean): Promise<ErrorEvent | void> {
        return new Promise((resolve) => {
            let onload = (gltf: GLTF) => {
                if (debugMsg) console.log(`Loaded asset: ${asset.path}`)
                asset.asset = gltf;
                resolve();
            };

            let onprogress = (progress: ProgressEvent<EventTarget>) => {
                if (!debugMsg) return;

                console.log(`Loading asset: ${asset.path}`, 
                (progress.loaded / progress.total) * 100);
            };

            let onerror = (err: ErrorEvent) => {
                resolve(err);

                if (!debugMsg) return;
                console.error(`Asset loader error when loading: ${asset.path}`);
            }

            loader.load(sourceDir + asset.path, onload, onprogress, onerror);
        });
    }
}
