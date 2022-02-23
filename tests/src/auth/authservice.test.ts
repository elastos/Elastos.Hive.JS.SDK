import { NodeRPCException, UnauthorizedException, ServerUnknownException, VaultSubscriptionService, ServiceContext, AuthService } from "@elastosfoundation/hive-js-sdk";
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";

describe("test auth service", () => {

	let testData: TestData;
    let serviceContext: ServiceContext;

	beforeAll(async () => {
		testData = await TestData.getInstance("aboutservice.test", ClientConfig.CUSTOM, TestData.USER_DIR);
        serviceContext = new ServiceContext(testData.getAppContext(), testData.getProviderAddress());
	});

	afterAll(() => { serviceContext.getAccessToken().invalidate(); });

    test("testAuth", async () => {
		let token = await serviceContext.getAccessToken().fetch();
		expect(token).not.toBeNull();
    });
});

describe("authentication fail test", () => {

	let testData: TestData;
    let vaultsubscriptionService: VaultSubscriptionService;

    beforeAll(() => {
        let spy = jest.spyOn(AuthService.prototype, 'auth').mockImplementation(() => {throw new ServerUnknownException(NodeRPCException.SERVER_EXCEPTION, "Expected error");});
    });

    beforeEach(async () => {
        testData = await TestData.getInstance("vault subscribe.test", ClientConfig.CUSTOM, TestData.USER_DIR);
        vaultsubscriptionService = new VaultSubscriptionService(
            testData.getAppContext(),
            testData.getProviderAddress());
    });

    afterAll(() => { jest.resetAllMocks(); });

	test("testAuthenticationFailed", async () => {
		let actualError = null;
        try {
            await vaultsubscriptionService.getPricingPlanList();
        } catch (e) {
			actualError = e;
        }
		expect(actualError).not.toBeNull();
		expect(actualError instanceof UnauthorizedException).toBeTruthy();
    });
});