import {ScriptEntity} from "./scriptentity";

/**
 * The condition is for checking caller's permission to run the owner's script.
 */
export abstract class Condition extends ScriptEntity {
    protected constructor(name: string, type: string, body: any) {
        super(name, type, body);
    }
}
