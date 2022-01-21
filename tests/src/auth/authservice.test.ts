import { ServiceContext, AuthService } from "@elastosfoundation/elastos-hive-js-sdk";
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";

describe("test auth service", () => {

	let testData: TestData;
    let serviceContext: ServiceContext;

	beforeAll(async () => {
		testData = await TestData.getInstance("aboutservice.test", ClientConfig.CUSTOM, TestData.USER_DIR);
        serviceContext = new ServiceContext(testData.getAppContext(), testData.getProviderAddress());
	});

    test("testAuth", async () => {
		let token = await serviceContext.getAccessToken().fetch();
		expect(token).not.toBeNull();
    });
});