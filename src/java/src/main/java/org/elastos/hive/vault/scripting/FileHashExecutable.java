package org.elastos.hive.vault.scripting;

public class FileHashExecutable extends Executable {
    public FileHashExecutable(String name) {
        super(name, Type.FILE_HASH, null);
        super.setBody(new FileBody());
    }
}
