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
        expect(nodeInfo.getServiceDid()).not.toBeNull();
        expect(nodeInfo.getOwnerDid()).not.toBeNull();
        expect(nodeInfo.getOwnershipPresentation()).not.toBeNull();
        expect(nodeInfo.getName()).not.toBeNull();
        expect(nodeInfo.getEmail()).not.toBeNull();
        expect(nodeInfo.getDescription()).not.toBeNull();
        expect(nodeInfo.getVersion()).not.toBeNull();
        expect(nodeInfo.getLastCommitId()).not.toBeNull();
    });
});
