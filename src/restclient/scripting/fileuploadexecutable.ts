import { Executable, ExecutableFileBody, ExecutableType } from "./executable";

export class FileUploadExecutable extends Executable {
    public constructor(name: string) {
        super(name, ExecutableType.FILE_UPLOAD, null);
        super.setBody(new ExecutableFileBody());
    }
}
