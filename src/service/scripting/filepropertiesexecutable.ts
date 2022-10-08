import {Executable, ExecutableFileBody, ExecutableType} from "./executable";

export class FilePropertiesExecutable extends Executable {
    public constructor(name: string) {
        super(name, ExecutableType.FILE_PROPERTIES, null);
        super.setBody(new ExecutableFileBody());
    }
}
