const { HiveClient, OptionsBuilder } = require("../dist/HiveClient")
const config = require("./config.json")
const { ElastosClient } = require("@elastosfoundation/elastos-js-sdk")
const { testHelper } = require("./testsHelper")

let run = async () => {

    let clientUser1 = await testHelper.getHiveInstance(config.app1, config.user1, config.hive_host, config.appId) 
    let clientUser2 = await testHelper.getAnonymousHiveInstance(config.hive_host) 


    let user1 = await ElastosClient.did.loadFromMnemonic(config.user1)
   
    

    let groupResponse = await clientUser1.Scripting.RunScript({
        "name": "get_groups"
    })
    console.log("get_groups Response", groupResponse["get_groups"])

    let addMessageResponse = await clientUser1.Scripting.RunScript({
        "name": "add_group_message",
        "params": {
          "group_id": groupResponse["get_groups"].items[0]["_id"],
          "group_created": {"$gte": "2021-08-27 00:00:00"},
          "content": {
            "hello": {
              "world": "test"
            }
          },
          "content_created": "2021-08-27 00:00:00"
        }
      })

    console.log("add_group_message response", addMessageResponse["get_last_message"].items[0])


    let groupMessagesResponse = await clientUser2.Scripting.RunScript({
        "name": "get_group_messages",
        "context": {
          "target_did": user1.did,
          "target_app_did": config.appId
        },
        "params": {
          "group_id": groupResponse["get_groups"].items[0]["_id"]
        }
      })
    console.log("USER 2 get_group_messages Response", groupMessagesResponse["find_messages"].items)

    let updateMessageResponse = await clientUser1.Scripting.RunScript({
        "name": "update_group_message",
        "params": {
          "group_id": groupResponse["get_groups"].items[0]["_id"],
          "old_content": "Old Message",
          "new_content": "Updated Message"
        }
      })

    console.log("update_group_message Response", updateMessageResponse)


    groupMessagesResponse = await clientUser2.Scripting.RunScript({
        "name": "get_group_messages",
        "context": {
          "target_did": user1.did,
          "target_app_did": config.appId
        },
        "params": {
          "group_id": groupResponse["get_groups"].items[0]["_id"]
        }
      })
    console.log("USER 2 get_group_messages Response", groupMessagesResponse["find_messages"].items)
}

run();