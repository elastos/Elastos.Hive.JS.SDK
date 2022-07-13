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

    test("testAuthParallel", async () => {
        // TODO: please clean token cache before run this.

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

    async function getVersion(appDid: string) {
        const token1 = new VaultSubscription(await testData.createContext(null, appDid), testData.getProviderAddress())
                                             .getVersion().then(value => {
            console.log(`got token1: ${value}`);
        });
    }

    test("testAuthParallel2", async () => {
        // TODO: please clean token cache before run this.

        await getVersion('applicationDid1');
        await getVersion('applicationDid2');
        await getVersion('applicationDid3');
        await getVersion('applicationDid4');
        await getVersion('applicationDid5');

        const sleep = (waitTimeInMs) => new Promise(resolve => {setTimeout(resolve, waitTimeInMs);});
        await sleep(300000);
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