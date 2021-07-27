package org.elastos.hive.vault.scripting;

public class FileUploadExecutable extends Executable {
    public FileUploadExecutable(String name) {
        super(name, Type.FILE_UPLOAD, null);
        super.setBody(new FileBody());
    }
}
