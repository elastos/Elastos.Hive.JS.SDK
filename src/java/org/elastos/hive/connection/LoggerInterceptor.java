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

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.UnsupportedCharsetException;

import okhttp3.Interceptor;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;
import okio.Buffer;
import okio.BufferedSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


class LoggerInterceptor implements Interceptor {
	private static final Logger log = LoggerFactory.getLogger(LoggerInterceptor.class);
	private static final int MAX_BODY_LEN = 500;

	@Override
	public Response intercept(Chain chain) throws IOException {
		return dumpResponse(chain.proceed(dumpRequest(chain.request())));
	}

	private Request dumpRequest(Request request) throws IOException {
		RequestBody body = request.body();
		String bodyInString = null;

		log.debug("Request -> [{}] {}", request.method(), request.url().toString());
		//log.debug("Request Header: {}", request.headers().toString());

		if (body != null) {
			Buffer buffer = new Buffer();
			body.writeTo(buffer);

			Charset charset = Charset.defaultCharset();
			MediaType type  = body.contentType();

			if (type != null) {
				try {
					charset = type.charset(charset);
				} catch (UnsupportedCharsetException e) {
					e.printStackTrace();
				}
			}

			if (charset != null)
				bodyInString = buffer.readString(charset);
		}

		if (bodyInString != null && !bodyInString.equals(""))
			log.debug("Request Body: {}", getOutputBodyContent(bodyInString));
		else
			log.debug("Request Body: N/A");

		return request;
	}

	private Response dumpResponse(Response response) throws IOException {
		ResponseBody body = response.body();
		String bodyInString = null;

		//log.debug("Response Header: {}", response.headers().toString());

		if (body != null) {
			BufferedSource source = body.source();
			source.request(Long.MAX_VALUE); // Buffer the entire body.
			Buffer buffer = source.buffer();

			Charset charset = Charset.defaultCharset();
			MediaType type = body.contentType();

			if (type != null) {
				try {
					charset = type.charset(charset);
				} catch (UnsupportedCharsetException e) {
					e.printStackTrace();
				}
			}
			if (charset != null)
				bodyInString = buffer.clone().readString(charset);

		}

		log.info("Response Code: {}", response.code());

		if (bodyInString != null && !bodyInString.equals(""))
			log.debug("Response Body: {}", getOutputBodyContent(bodyInString));
		else
			log.debug("Response Body: N/A");

		return response;
	}

	private String getOutputBodyContent(String body) {
		return body.length() > MAX_BODY_LEN ? body.substring(0, MAX_BODY_LEN) : body;
	}
}
