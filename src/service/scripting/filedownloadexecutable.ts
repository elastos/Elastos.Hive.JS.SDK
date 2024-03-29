import {Executable, ExecutableFileBody, ExecutableType} from "./executable";

/**
 * Used to download file.
 */
export class FileDownloadExecutable extends Executable {
    constructor(name: string, path?: string) {
        super(name, ExecutableType.FILE_DOWNLOAD, new ExecutableFileBody(path));
    }
}
