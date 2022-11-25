import {Executable, ExecutableFileBody, ExecutableType} from "./executable";

/**
 * Used to get the properties of the file.
 */
export class FilePropertiesExecutable extends Executable {
    constructor(name: string) {
        super(name, ExecutableType.FILE_PROPERTIES, new ExecutableFileBody());
    }
}
