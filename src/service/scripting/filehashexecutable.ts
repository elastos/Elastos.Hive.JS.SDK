import {Executable, ExecutableFileBody, ExecutableType} from "./executable";

/**
 * Used to get the hash of the file content.
 */
export class FileHashExecutable extends Executable {
    constructor( name: string) {
        super(name, ExecutableType.FILE_HASH, new ExecutableFileBody());
    }
}
