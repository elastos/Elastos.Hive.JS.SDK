package org.elastos.hive.connection;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;

public class UploadOutputStreamWriter extends OutputStreamWriter {
	private final HttpURLConnection connection;

	public UploadOutputStreamWriter(HttpURLConnection connection, OutputStream output) {
		super(output);
		this.connection = connection;
	}

	@Override
	public void close() throws IOException {
		super.close();
		new ConnectionClosure().confirmClosed(connection);
	}
}
