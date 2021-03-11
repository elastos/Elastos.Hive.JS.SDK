const config = require("./config.json");
const { testHelper } = require("./testsHelper")
const { HiveClient, OptionsBuilder } = require("../dist/HiveClient")

let run = async () => {
    
    let client = await testHelper.getHiveInstance(config.app1, config.user1, config.hive_host, config.appId) 

    
    // Just for the first time
    await client.Payment.CreateFreeVault()
    console.log("is connected", client.isConnected)

    let collection = await client.Database.createCollection("Test")

    let response = await collection.insertMany([
        { "Name": "Test 1" },
        { "Name": "Test 2" },
        { "Name": "Test 3" },
        { "Name": "Test 4" }
    ])
    console.log("response", response)

    let findMany = await collection.findMany()
    console.log("Items", findMany)

    let updated = await collection.updateOne({ "Name": "Test 3" }, { "$set": { "Name": "Test 3 Updated" } })
    console.log("Updated", updated)

    let deleteResponse = await collection.deleteOne({ "Name": "Test 2" })
    console.log("Delete Response", deleteResponse)

    let count = await collection.count()
    console.log("Count", count)

    await collection.drop()
}

run();