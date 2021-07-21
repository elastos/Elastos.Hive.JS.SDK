package org.elastos.hive.connection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;

class ConnectionClosure {
	private static final Logger log = LoggerFactory.getLogger(ConnectionClosure.class);

	void confirmClosed(HttpURLConnection urlConnection) {
		try {
			if (urlConnection.getResponseCode() != 200)
				return;

			BufferedReader reader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
			StringBuilder result = new StringBuilder();
			String line = "";

			while ((line = reader.readLine()) != null) {
				line = line.trim();
				if (line.length() > 0)
					result.append(line);
			}
		} catch (IOException e) {
			log.error("Failed to close connection: " + e.getMessage());
			e.printStackTrace();
		}
	}
}
