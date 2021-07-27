package org.elastos.hive.vault.scripting;

public class FileDownloadExecutable extends Executable {
    public FileDownloadExecutable(String name) {
        super(name, Type.FILE_DOWNLOAD, null);
        super.setBody(new FileBody());
    }
}
