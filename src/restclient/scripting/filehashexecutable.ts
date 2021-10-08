import { Executable, ExecutableFileBody, ExecutableType } from "./executable";

export class FileHashExecutable extends Executable {
    constructor( name: string) {
        super(name, ExecutableType.FILE_HASH, null);
        super.setBody(new ExecutableFileBody());
    }
}
