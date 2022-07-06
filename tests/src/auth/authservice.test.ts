import {
    UnauthorizedException,
    VaultSubscription,
    ServiceEndpoint,
    AuthService,
    ServerException
} from "../../../src";
import { TestData } from "../config/testdata";

describe("test auth service", () => {

	let testData: TestData;
    let serviceEndpoint: ServiceEndpoint;

	beforeAll(async () => {
		testData = await TestData.getInstance("authservice.test (auth test)");
        serviceEndpoint = new ServiceEndpoint(testData.getUserAppContext(), testData.getProviderAddress());
	});

	afterAll(async () => { await serviceEndpoint.getAccessToken().invalidate(); });

    test("testAuth", async () => {
		let token = await serviceEndpoint.getAccessToken().fetch();
		expect(token).not.toBeNull();
    });
});

describe.skip("authentication fail test", () => {

	let testData: TestData;
    let vaultSubscription: VaultSubscription;

    beforeAll(() => {
        let spy = jest.spyOn(AuthService.prototype, 'auth').mockImplementation(() => {
            throw new ServerException("Expected error");
        });
    });

    beforeEach(async () => {
        testData = await TestData.getInstance("authservice.test (fail test)");
        vaultSubscription = new VaultSubscription(
            testData.getUserAppContext(),
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