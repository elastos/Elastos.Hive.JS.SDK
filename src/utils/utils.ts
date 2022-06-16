/*
 * Copyright (c) 2021 Elastos Foundation
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

import { Base64, SHA256 } from "@dchagastelles/commons.js.tools";

export function uint8ArrayCopy(src: Uint8Array, srcIndex: number, dest: Uint8Array, destIndex: number, length: number): void {
    let values = [...src.slice(srcIndex, srcIndex + length)];
    dest.set(values, destIndex);
}

export function base64Decode(input: string): string {
    return Base64.decode(input);
}

export function sha256(input: string): string {
    return SHA256.encodeToString(Buffer.from(input, "utf-8"));
}

/**
 * Tells whether this library is running in the browser or in a nodejs env.
 */
export function runningInBrowser(): boolean {
    return process === undefined || (process.platform as string) === "browser" || process.title === "browser";
}