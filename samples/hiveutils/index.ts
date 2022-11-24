import {Logger} from "@elastosfoundation/hive-js-sdk";
import {TestData} from "./config/test.data";
import {HiveUrl} from "./hive.url";
const yargs = require("yargs");

const options = yargs
    .option("e", { alias: "env", describe: "Environment: 'testnet' | 'mainnet' (default)", type: "string", demandOption: false })
    .option("u", { alias: "hive_url", describe: "Hive url", type: "string", demandOption: false })
    .option("o", { alias: "output", describe: "Output file name, default 'output.o'", type: "string", demandOption: false })
    .argv;

async function main(options) {
    if (options.env && !(['mainnet', 'testnet'].includes(options.env))) {
        console.log('Invalid "env"');
        return;
    }

    await TestData.getInstance().setEnv(options.env ? options.env : 'mainnet');

    if (options.hive_url) {
        await new HiveUrl(options.hive_url, options.output).execute();
    }
}

main(options).then(() => {console.log('\n', '\n')});
