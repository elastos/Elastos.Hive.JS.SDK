import {InvalidParameterException} from "../../exceptions";

/**
 * Base class for any script entity which used on the script content.
 */
export abstract class ScriptEntity {
    protected constructor(private name: string, private type: string, private body: any) {
        if (!this.name)
            throw new InvalidParameterException('Invalid name');
    }

    getName() : string {
        return this.name;
    }

    getType() : string {
        return this.type;
    }

    getBody() : any {
        return this.body;
    }
}