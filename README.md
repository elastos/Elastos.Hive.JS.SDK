# Elastos Hive JS SDK

===================

Elastos Hive is an essential service infrastructure as a decentralized network of Hive nodes presenting data storage capabilities to dApps. And the JS SDK provides a group of APIs for Elastos dApps to easily access and store application data to remote Vault services on Hive nodes with the following features:

- Subscribe/unsubscribe to vault or backup vault
- Scripting execution
- Upload/Download files
- Structured data object access and store onto MongoDB (Not supported yet)
- Key/Values (Not supported yet);

Elastos Hive will keep the promise that **users remain in full control of their own data** and committing the practice on it.

## SDK integration with NodeJS

To add the Hive JS SDK dependency to your project, run the following command from your source folder:

```shell
npm i --save @elastosfoundation/elastos-hive-js-sdk
```

## Build from source

Preparing with the developer tool **git**, and then run the following commands to clone the source:

```shell
git clone https://github.com/elastos/Elastos.NET.Hive.JS.SDK
cd Elastos.NET.Hive.JS.SDK
npm install
npm run types
npm run build
```

## Test configuration

Before running tests, the local user directory must be defined with the following command:

```shell
export HIVE_USER_DIR=/path/to/user/dir
```

Then, modify the "provider" field tests/src/res/custom.json to point to your own local hive node.

## Run NodeJS tests

From the source folder, build the project, then run the following commands:

```shell
cd tests
npm run clean
npm install
npm run test:node
```

## Run Browser tests

From the source folder, build the project, then run the following commands:

```shell
cd tests
npm run clean
npm install
npm run test:browser
```

## Writing tests

The test context is based on the TestData class located in `/tests/src/config/testdata.ts`. The creation of this class will create the test context and set the user directory. The class should be created before each test using the following code:

`testData = await TestData.getInstance("TEST SUITE NAME", CONFIGURATION, "OPTIONAL USER DIRECTORY");`

Example:

```javascript
testData = await TestData.getInstance("My service tests", ClientConfig.LOCAL);
```

**Note:** The optional third parameter of the TestData.getInstance method is the user directory which defaults to the path defined by the HIVE_USER_DIR environment variable (See [Test configuration](#test-configuration). You may also specify a custom folder, but it's recommended to only use this parameter on local workstation for validation.

### Test example

```javascript
import {
  VaultSubscriptionService,
  PricingPlan,
} from "@elastosfoundation/elastos-hive-js-sdk";
import { ClientConfig } from "../config/clientconfig";
import { TestData } from "../config/testdata";

describe("pricing plans", () => {
  let testData: TestData;
  let vaultSubscriptionService: VaultSubscriptionService;

  beforeEach(async () => {
    testData = await TestData.getInstance(
      "pricingplans.test",
      ClientConfig.DEV
    );
    vaultsubscriptionService = new VaultSubscriptionService(
      testData.getAppContext(),
      testData.getProviderAddress()
    );
  });

  test("get vault pricing plans", async () => {
    let plans: PricingPlan[] =
      await vaultsubscriptionService.getPricingPlanList();
    expect(plans).not.toBeNull();
    expect(plans.length).toBeGreaterThan(0);
  });
});
```

## Usage

In order to subscribe to a vault (create) a user needs to implement AppContextProvider

```javascript
export class ApiServiceContextProvider implements AppContextProvider {
    getLocalDataDir = () : string => {
        ...
    };

    getAppInstanceDocument = async () : Promise<DIDDocument> => {
       ...
    };

    getAuthorization = async (authenticationChallengeJWtCode: string): Promise<string> => {
      ...
    }
}

let vaultSubscriptionService : VaultSubscriptionService = new VaultSubscriptionService(appContext, "[hiveNode address]");
let vaultInfo = await vaultSubscriptionService.subscribe();
```

The same mechanics is used by VaultService, which provides all services to interact with hive vault

```javascript
let vaultServices = new VaultServices(appContext, "[hiveNode address]");
let scriptingService = vaultServices.getScriptingService();
let filesService = vaultServices.getFilesService();
let databaseService = vaultServices.getDatabaseService();
...
```
