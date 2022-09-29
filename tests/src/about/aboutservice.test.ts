import {NodeInfo, NodeVersion, ServiceEndpoint, Logger} from "../../../src";
import {TestData} from "../config/testdata";

describe("test about service", () => {
    const LOG = new Logger('aboutservice.test');

	let testData: TestData;
    let serviceEndpoint: ServiceEndpoint;

    beforeAll(async () => {
		testData = await TestData.getInstance("aboutservice.test");
        serviceEndpoint = new ServiceEndpoint(testData.getUserAppContext(), testData.getProviderAddress());
	});

    test("testGetNodeVersion", async () => {
        let nodeVersion: NodeVersion = await serviceEndpoint.getNodeVersion();
        expect(nodeVersion).toBeTruthy();
        expect(nodeVersion.getMajor()).toBeTruthy();
        expect(nodeVersion.getMinor()).toBeTruthy();
        expect(nodeVersion.getPatch()).toBeTruthy();
        LOG.info("Hive Node version: {}", nodeVersion.toString());
    });

    test("testGetCommitId", async () => {
		let commitId = await serviceEndpoint.getLatestCommitId();
		expect(commitId).toBeTruthy();
        LOG.info("Hive Node commit id: {}", commitId);
    });

    test("testGetNodeInfo", async () => {
        const nodeInfo: NodeInfo = await serviceEndpoint.getNodeInfo();
        expect(nodeInfo).toBeTruthy();
        expect(nodeInfo.getServiceDid()).toBeTruthy();
        expect(nodeInfo.getOwnerDid()).toBeTruthy();
        expect(nodeInfo.getOwnershipPresentation()).toBeTruthy();
        expect(nodeInfo.getName()).toBeTruthy();
        expect(nodeInfo.getEmail()).toBeTruthy();
        expect(nodeInfo.getDescription()).toBeTruthy();
        expect(nodeInfo.getVersion()).toBeTruthy();
        expect(nodeInfo.getLastCommitId()).toBeTruthy();
    });
});
