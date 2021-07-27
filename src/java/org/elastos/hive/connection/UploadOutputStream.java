package org.elastos.hive.connection;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;

public class UploadOutputStream extends OutputStream {
	private HttpURLConnection connection;
	private OutputStream outputStream;

	public UploadOutputStream(HttpURLConnection connection, OutputStream output) {
		this.connection = connection;
		this.outputStream = output;
	}

	@Override
	public void write(int b) throws IOException {
		outputStream.write(b);
	}

	@Override
	public void write(byte[] bytes) throws IOException {
		outputStream.write(bytes);
	}

	@Override
	public void write(byte[] bytes, int offset, int length) throws IOException {
		outputStream.write(bytes, offset, length);
	}

	@Override
	public void flush() throws IOException {
		outputStream.flush();
	}

	@Override
	public void close() throws IOException {
		// In order for uploads to complete successfully in chunk mode, we have to
		// read the server response.
		// This doesn't seem to behave identically on all devices. Some devices work
		// without this. But some devices don't terminate the API call until the server
		// response is read.
		//
		// This close() method on the output stream is the only location where we know
		// user has finished writing his file.
		new ConnectionClosure().confirmClosed(connection);
		outputStream.close();
	}
}
