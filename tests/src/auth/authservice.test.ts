import { NodeRPCException, UnauthorizedException, ServerUnknownException, VaultSubscription, ServiceEndpoint, AuthService } from "@elastosfoundation/hive-js-sdk";
import { TestData } from "../config/testdata";

describe("test auth service", () => {

	let testData: TestData;
    let serviceEndpoint: ServiceEndpoint;

	beforeAll(async () => {
		testData = await TestData.getInstance("aboutservice.test");
        serviceEndpoint = new ServiceEndpoint(testData.getAppContext(), testData.getProviderAddress());
	});

	afterAll(() => { serviceEndpoint.getAccessToken().invalidate(); });

    test("testAuth", async () => {
		let token = await serviceEndpoint.getAccessToken().fetch();
		expect(token).not.toBeNull();
    });
});

describe("authentication fail test", () => {

	let testData: TestData;
    let vaultSubscription: VaultSubscription;

    beforeAll(() => {
        let spy = jest.spyOn(AuthService.prototype, 'auth').mockImplementation(() => {throw new ServerUnknownException(NodeRPCException.SERVER_EXCEPTION, "Expected error");});
    });

    beforeEach(async () => {
        testData = await TestData.getInstance("vault subscribe.test");
        vaultSubscription = new VaultSubscription(
            testData.getAppContext(),
            testData.getProviderAddress());
    });

    afterAll(() => { jest.resetAllMocks(); });

	test("testAuthenticationFailed", async () => {
		let actualError = null;
        try {
            await vaultSubscription.getPricingPlanList();
        } catch (e) {
			actualError = e;
        }
		expect(actualError).not.toBeNull();
		expect(actualError instanceof UnauthorizedException).toBeTruthy();
    });
});