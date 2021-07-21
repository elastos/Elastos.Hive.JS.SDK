package org.elastos.hive.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class Config {
	protected static ObjectMapper getObjectMapper() {
		ObjectMapper mapper = new ObjectMapper();

		mapper.disable(MapperFeature.AUTO_DETECT_CREATORS,
				MapperFeature.AUTO_DETECT_FIELDS,
				MapperFeature.AUTO_DETECT_GETTERS,
				MapperFeature.AUTO_DETECT_SETTERS,
				MapperFeature.AUTO_DETECT_IS_GETTERS);

		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		return mapper;
	}

	public String serialize() throws IOException {
		return getObjectMapper().writeValueAsString(this);
	}

	protected static <T extends Config> T deserialize(String content, Class<T> clazz) {
		ObjectMapper mapper = getObjectMapper();

		try {
			return mapper.readValue(content, clazz);
		} catch (IOException e) {
			throw new IllegalArgumentException(e);
		}
	}
}
