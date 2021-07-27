package org.elastos.hive.vault.scripting;

import java.util.HashMap;

class RunFileParams extends HashMap<String, String> {
    public RunFileParams(String path) {
        super.put("path", path);
    }
}
