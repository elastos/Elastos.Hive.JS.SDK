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

    test("testAuthParallel", async () => {
        const token1 = serviceEndpoint.getAccessToken().fetch().then(value => {
            console.log(`got token1: ${value}`);
        });
        const token2 = serviceEndpoint.getAccessToken().fetch().then(value => {
            console.log(`got token2: ${value}`);
        });
        const token3 = serviceEndpoint.getAccessToken().fetch().then(value => {
            console.log(`got token3: ${value}`);
        });
        const token4 = serviceEndpoint.getAccessToken().fetch().then(value => {
            console.log(`got token4: ${value}`);
        });

        const sleep = (waitTimeInMs) => new Promise(resolve => {setTimeout(resolve, waitTimeInMs);});
        await sleep(30000);
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