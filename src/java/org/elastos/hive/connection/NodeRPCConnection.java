/*
 * Copyright (c) 2019 Elastos Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package org.elastos.hive.connection;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.*;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import org.elastos.hive.connection.auth.AccessToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.TimeUnit;

public abstract class NodeRPCConnection {
	private static final Logger log = LoggerFactory.getLogger(NodeRPCConnection.class);
	private static final int DEFAULT_TIMEOUT = 30;

	protected abstract String getProviderAddress();
	protected abstract AccessToken getAccessToken();

	public HttpURLConnection openConnection(String urlPath) throws IOException {
		String url = getProviderAddress() + urlPath;
		log.debug("open connection with URL: {} and method: PUT", url);

		HttpURLConnection urlConnection = (HttpURLConnection) new URL(url).openConnection();
		urlConnection.setRequestMethod("PUT");
		urlConnection.setRequestProperty("User-Agent",
				"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11");
		urlConnection.setConnectTimeout(5000);
		urlConnection.setReadTimeout(5000);

		urlConnection.setDoOutput(true);
		urlConnection.setDoInput(true);
		urlConnection.setUseCaches(false);

		urlConnection.setRequestProperty("Transfer-Encoding", "chunked");
		urlConnection.setRequestProperty("Connection", "Keep-Alive");
		urlConnection.setRequestProperty("Authorization", getAccessToken().getCanonicalizedAccessToken());

		urlConnection.setChunkedStreamingMode(0);

		return urlConnection;
	}

	public <S> S createService(Class<S> serviceClass, boolean requiredAuthorization) {
		Interceptor requestInterceptor = requiredAuthorization ?
					new PlainRequestInterceptor(getAccessToken()) :
						new AuthRequestInterceptor();

		return createRetrofit(requestInterceptor).create(serviceClass);
	}

	private Retrofit createRetrofit(Interceptor requestInterceptor) {
		OkHttpClient.Builder builder;

		builder = new OkHttpClient.Builder()
				.connectTimeout(DEFAULT_TIMEOUT, TimeUnit.SECONDS)
				.readTimeout(DEFAULT_TIMEOUT, TimeUnit.SECONDS);

		builder.interceptors().clear();
		builder.interceptors().add(requestInterceptor);
		builder.interceptors().add(new LoggerInterceptor());

		return new Retrofit.Builder()
				.baseUrl(getProviderAddress())
				.addConverterFactory(getGsonConverterFactory())
				.client(builder.build())
				.build();
	}

	private GsonConverterFactory getGsonConverterFactory() {
		GsonBuilder builder = new GsonBuilder();
		// Hook for convert JsonNode object.
		builder.registerTypeAdapter(JsonNode.class, (JsonSerializer<JsonNode>) (src, typeOfSrc, context) -> {
			if (src == null)
				return new JsonPrimitive("");
			return new JsonParser().parse(src.toString()).getAsJsonObject();
		});
		builder.registerTypeAdapter(JsonNode.class, (JsonDeserializer<JsonNode>) (src, typeOfSrc, context) -> {
			if (src == null)
				return null;
			String json = new Gson().toJson(src);
			try {
				return new ObjectMapper().readTree(json);
			} catch (IOException e) {
				log.error("Failed to deserialize to JsonNode.");
				return null;
			}
		});
		return GsonConverterFactory.create(builder.create());
	}

	private static class AuthRequestInterceptor implements Interceptor {
		@Override
		public Response intercept(Chain chain) throws IOException {
			Response response = chain.proceed(chain.request());
			if (!response.isSuccessful()) {
				// TOOD:
				throw new NodeRPCException(response.code(), -1, response.message());
			}
			return response;
		}
	}

	private static class PlainRequestInterceptor implements Interceptor {
		private AccessToken accessToken;

		PlainRequestInterceptor(AccessToken accessToken) {
			this.accessToken = accessToken;
		}

		@Override
		public Response intercept(Chain chain) throws IOException {
			Request request = chain.request()
						.newBuilder()
						.addHeader("Authorization", this.accessToken.getCanonicalizedAccessToken())
						.build();

			Response response = chain.proceed(request);
			if (!response.isSuccessful()) {
				int httpCode = response.code();
				if (httpCode == 401)
					accessToken.invalidate();

				if (response.body() == null)
					throw new NodeRPCException(httpCode, -1, "Empty body.");

				JsonNode error = getResponseErrorNode(response.body().string());
				if (error == null)
					throw new NodeRPCException(httpCode, -1, response.body().string());
				else
					throw new NodeRPCException(httpCode,
							error.has("internal_code") ? error.get("internal_code").asInt() : -1,
							error.get("message").asText());
			}
			return response;
		}

		private JsonNode getResponseErrorNode(String body) {
			try {
				return new ObjectMapper().readTree(body).get("error");
			} catch (JsonParseException | IOException e) {
				log.error("No Json response body returned: " + body);
				return null;
			}
		}
	}
}
