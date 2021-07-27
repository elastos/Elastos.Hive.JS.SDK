package org.elastos.hive.vault.scripting;

public class FilePropertiesExecutable extends Executable {
    public FilePropertiesExecutable(String name) {
        super(name, Type.FILE_PROPERTIES, null);
        super.setBody(new FileBody());
    }
}
