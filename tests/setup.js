const { HiveClient, OptionsBuilder } = require("../dist/HiveClient")
const { ElastosClient } = require("@elastosfoundation/elastos-js-sdk")
const config = require("./config.json");
const { testHelper } = require("./testsHelper")


let run = async () => {

    let client = await testHelper.getHiveInstance(config.app1, config.user1, config.hive_host, config.appId) 
    await client.Payment.CreateFreeVault()
    await client.Database.deleteCollection("groups")
    await client.Database.deleteCollection("messages")

    let user1 = await ElastosClient.did.loadFromMnemonic(config.user1)
    let user2 = await ElastosClient.did.loadFromMnemonic(config.user2)

    let groups = await client.Database.createCollection("groups")

    let groupsResponse = await groups.insertMany([{
        "name": "Tuum Tech",
        "friends": [user1.did, user2.did]
    }, {
        "name": "Trinity",
        "friends": []
    }])

    let messages = await client.Database.createCollection("messages")
    await messages.insertOne({
        "content": "Old Message",
        "group_id": { "\$oid": groupsResponse.inserted_ids[0] },
        "friend_did": user1.did
    })


    await client.Scripting.SetScript({
        "name": "get_group_messages",
        "executable": {
            "type": "find",
            "name": "find_messages",
            "output": true,
            "body": {
                "collection": "messages",
                "filter": {
                    "group_id": "\$params.group_id"
                },
                "options": {
                    "projection": {
                        "_id": false
                    },
                    "sort": { "created": -1 }
                }
            }
        },
        "condition": {
            "type": "queryHasResults",
            "name": "verify_user_permission",
            "body": {
                "collection": "groups",
                "filter": {
                    "_id": "\$params.group_id",
                    "friends": "\$caller_did"
                }
            }
        }
    })

    await client.Scripting.SetScript({
        "name": "get_groups",
        "allowAnonymousUser": true,
        "allowAnonymousApp": true,
        "executable": {
            "type": "find",
            "name": "get_groups",
            "output": true,
            "body": {
                "collection": "groups",
                "filter": {
                    "friends": "\$caller_did"
                },
                "options": {
                    "projection": {
                        "_id": true,
                        "name": true
                    }
                }
            }
        }
    })

    await client.Scripting.SetScript({
        "name": "add_group_message",
        "executable": {
            "type": "aggregated",
            "name": "add_and_return_message",
            "body": [
                {
                    "type": "insert",
                    "name": "add_message_to_end",
                    "body": {
                        "collection": "messages",
                        "document": {
                            "group_id": "\$params.group_id",
                            "friend_did": "\$caller_did",
                            "content": "\$params.content",
                            "created": "\$params.content_created",
                            "nested_obj": {
                                "group_id_inner": "\$params.content",
                                "vault_app_did": {
                                    "hello": "\$caller_app_did",
                                    "world": "\$params.content"
                                }
                            }
                        },
                        "options": { "bypass_document_validation": false }
                    }
                },
                {
                    "type": "find",
                    "name": "get_last_message",
                    "output": true,
                    "body": {
                        "collection": "messages",
                        "filter": {
                            "group_id": "\$params.group_id"
                        },
                        "options": {
                            "projection": { "_id": false },
                            "sort": { "created": -1 },
                            "limit": 1
                        }
                    }
                }
            ]
        },
        "condition": {
            "type": "and",
            "name": "verify_user_permission",
            "body": [
                {
                    "type": "queryHasResults",
                    "name": "user_in_group",
                    "body": {
                        "collection": "groups",
                        "filter": {
                            "_id": "\$params.group_id",
                            "friends": "\$caller_did"
                        }
                    }
                },
                {
                    "type": "queryHasResults",
                    "name": "user_in_group",
                    "body": {
                        "collection": "groups",
                        "filter": {
                            "_id": "\$params.group_id",
                            "friends": "\$caller_did"
                        }
                    }
                }
            ]
        }
    })

    await client.Scripting.SetScript({
        "name": "update_group_message",
        "executable": {
            "type": "update",
            "name": "update_and_return",
            "body": {
                "collection": "messages",
                "filter": {
                    "group_id": "\$params.group_id",
                    "friend_did": "\$caller_did",
                    "content": "\$params.old_content"
                },
                "update": {
                    "\$set": {
                        "group_id": "\$params.group_id",
                        "friend_did": "\$caller_did",
                        "content": "\$params.new_content"
                    }
                },
                "options": {
                    "upsert": true,
                    "bypass_document_validation": false
                }
            }
        },
        "condition": {
            "type": "queryHasResults",
            "name": "verify_user_permission",
            "body": {
                "collection": "groups",
                "filter": {
                    "_id": "\$params.group_id",
                    "friends": "\$caller_did"
                }
            }
        }
    })

    await client.Scripting.SetScript({
        "name": "delete_group_message",
        "executable": {
            "type": "delete",
            "name": "delete_and_return",
            "body": {
                "collection": "messages",
                "filter": {
                    "group_id": "\$params.group_id",
                    "friend_did": "\$caller_did",
                    "content": "\$params.content"
                }
            }
        },
        "condition": {
            "type": "queryHasResults",
            "name": "verify_user_permission",
            "body": {
                "collection": "groups",
                "filter": {
                    "_id": "\$params.group_id",
                    "friends": "\$caller_did"
                }
            }
        }
    })
    

    console.log("All scripts OK")
}

run();