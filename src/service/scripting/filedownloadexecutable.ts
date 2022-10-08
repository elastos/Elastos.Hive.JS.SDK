import {Executable, ExecutableFileBody, ExecutableType} from "./executable";

export class FileDownloadExecutable extends Executable {
    public constructor(name: string) {
        super(name, ExecutableType.FILE_DOWNLOAD, null);
        super.setBody(new ExecutableFileBody());
    }
}
