package org.elastos.hive;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.util.Map;
import java.util.Properties;

import static org.junit.Assert.fail;

public class Utils {

	public static boolean deleteFile(String path) {
		File file = new File(path);
		if (file.exists()) {
			return file.delete();
		}
		return false;
	}

	public static byte[] readImage(String path) {
		try {
			InputStream inputStream = null;
			try {
				inputStream = new FileInputStream(path);
				byte[] buffer = new byte[inputStream.available()];
				inputStream.read(buffer);

				return buffer;
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				try {
					inputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static void fileWrite(String filePath, Writer writer) {
		FileReader fileReader = null;
		try {
			fileReader = new FileReader(new File(filePath));
			char[] buffer = new char[1];
			while (fileReader.read(buffer) != -1) {
				writer.write(buffer);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				fileReader.close();
			} catch (Exception e) {
				fail();
			}
		}
	}

	public static void cacheTextFile(Reader reader, String path, String filename) {
		FileWriter fileWriter = null;
		try {
			File dir = new File(path);
			if (!dir.exists()) dir.mkdirs();
			File file = new File(dir, filename);
			if (!file.exists()) file.createNewFile();
			fileWriter = new FileWriter(file);
			char[] buffer = new char[1];
			while (reader.read(buffer) != -1) {
				fileWriter.write(buffer);
			}
			fileWriter.flush();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				fileWriter.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public static void cacheBinFile(InputStream inputStream, String path, String filename) {
		FileOutputStream fileOutStream = null;
		try {
			File dir = new File(path);
			if (!dir.exists()) dir.mkdirs();
			File file = new File(dir, filename);
			if (!file.exists()) file.createNewFile();
			byte[] buffer = new byte[1024];
			int len = 0;
			fileOutStream = new FileOutputStream(file);
			while ((len = inputStream.read(buffer)) != -1) {
				fileOutStream.write(buffer, 0, len);
			}
			fileOutStream.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				fileOutStream.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public static Properties getProperties(String fileName) {
		InputStream input = Utils.class.getClassLoader().getResourceAsStream(fileName);

		Properties properties = new Properties();
		try {
			properties.load(input);
		} catch (IOException e) {
			e.printStackTrace();
		}

		return properties;
	}

	public static String getConfigure(String fileName) {
		InputStream inputStream = Utils.class.getClassLoader().getResourceAsStream(fileName);

		byte[] bytes = null;
		try {
			bytes = new byte[inputStream.available()];
			inputStream.read(bytes);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return new String(bytes);
	}

	public static Map<String, Object> jsonToMap(String json) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			Map<String, Object> p = mapper.readValue(json, new TypeReference<Map<String, Object>>() {
			});
			return p;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
