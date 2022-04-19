import {NodeInfo, NodeVersion, ServiceContext} from "@elastosfoundation/hive-js-sdk";
import { TestData } from "../config/testdata";

describe("test about service", () => {

	let testData: TestData;
    let serviceContext: ServiceContext;

    beforeAll(async () => {
		testData = await TestData.getInstance("aboutservice.test");
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

    test("testGetNodeInfo", async () => {
        const nodeInfo: NodeInfo = await serviceContext.getNodeInfo();
        expect(nodeInfo).not.toBeNull();
        expect(nodeInfo.service_did).not.toBeNull();
        expect(nodeInfo.owner_did).not.toBeNull();
        expect(nodeInfo.ownership_presentation).not.toBeNull();
        expect(nodeInfo.name).not.toBeNull();
        expect(nodeInfo.email).not.toBeNull();
        expect(nodeInfo.description).not.toBeNull();
        expect(nodeInfo.version).not.toBeNull();
        expect(nodeInfo.last_commit_id).not.toBeNull();
    });
});
