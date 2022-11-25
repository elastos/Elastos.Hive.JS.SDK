import {Executable, ExecutableFileBody, ExecutableType} from "./executable";

/**
 * Used to upload the file content.
 */
export class FileUploadExecutable extends Executable {
    constructor(name: string) {
        super(name, ExecutableType.FILE_UPLOAD, new ExecutableFileBody());
    }
}
