import {assertEquals} from "./util";
import {IpfsRunner} from "@elastosfoundation/hive-js-sdk";

describe.skip("test ipfs runner", () => {
    beforeAll(() => {
    });

    test("testGetProviderAddress", async () => {
        const cid = 'QmakYXmsvJzAyeH1hQzKrdpAdb1b4mqdegRRa86VF4Ni9T';
        const content = 'this is test file abcdefghijklmnopqrstuvwxyz';
        let data = await new IpfsRunner('https://ipfs-test.trinity-feeds.app').getFile(cid);
        assertEquals(content, data.toString());
        data = await new IpfsRunner().getFile(cid);
        assertEquals(content, data.toString());
    });
});
