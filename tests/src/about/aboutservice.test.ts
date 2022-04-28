import {NodeInfo, NodeVersion, ServiceEndpoint} from "@elastosfoundation/hive-js-sdk";
import { TestData } from "../config/testdata";

describe("test about service", () => {

	let testData: TestData;
    let serviceEndpoint: ServiceEndpoint;

    beforeAll(async () => {
		testData = await TestData.getInstance("aboutservice.test");
        serviceEndpoint = new ServiceEndpoint(testData.getAppContext(), testData.getProviderAddress());
	});

    test("testGetNodeVersion", async () => {
		let nodeVersion: NodeVersion = await serviceEndpoint.getNodeVersion();
		expect(nodeVersion).not.toBeNull();
        console.log("Hive Node version: " + nodeVersion.toString());
    });

    test("testGetCommitId", async () => {
		let commitId = await serviceEndpoint.getLatestCommitId();
		expect(commitId).not.toBeNull();
        console.log("Hive Node commit id: " + commitId);
    });

    test("testGetNodeInfo", async () => {
        const nodeInfo: NodeInfo = await serviceEndpoint.getNodeInfo();
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
