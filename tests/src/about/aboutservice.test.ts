import { NodeVersion, ServiceContext } from "@elastosfoundation/hive-js-sdk";
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";

describe("test about service", () => {

	let testData: TestData;
    let serviceContext: ServiceContext;

    beforeAll(async () => {
		testData = await TestData.getInstance("aboutservice.test", ClientConfig.CUSTOM, TestData.USER_DIR);
        serviceContext = new ServiceContext(testData.getAppContext(), testData.getProviderAddress());
	});

    test("testGetNodeVersion", async () => {
		let nodeVersion: NodeVersion = await serviceContext.getNodeVersion();
		expect(nodeVersion).not.toBeNull();
        console.log("Hive Node version: " + nodeVersion.toString());
    });

    test("testGetCommitId", async () => {
		let commitId = await serviceContext.getLatestCommitId();
		expect(commitId).not.toBeNull();
        console.log("Hive Node commit id: " + commitId);
    });
});