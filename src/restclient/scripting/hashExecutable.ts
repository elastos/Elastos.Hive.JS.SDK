import { Executable } from "./executable";

export class FileHashExecutable extends Executable {
    constructor( name: string) {
        super(name, Executable.Type.FILE_HASH, null);
        super.setBody(new Executable.FileBody());
    }
}