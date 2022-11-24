import {TestData} from "./config/test.data";
import fs from "fs";

export class HiveUrl {
    private readonly output: string;

    constructor(private url, output) {
        this.output = output ? output : 'output.o';
    }

    async execute(): Promise<void> {
        try {
            const testData = TestData.getInstance();
            const buffer = await testData.newCallerScriptRunner().downloadFileByHiveUrl(this.url);
            fs.writeFileSync(this.output, buffer);
            console.log(`>>>>>> The hive url is OK and the file has been downloaded.`);
        } catch (e) {
            console.log(`>>>>>> Failed to get file content by hive url: ${e}`);
        }
    }
}