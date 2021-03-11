const { HiveClient, OptionsBuilder } = require("../dist/HiveClient")

let run = async () => {

    let builder = new OptionsBuilder()

    await builder.setApp("org.test.app", "razor where crunch foot outer universe news cannon october clinic ski apart")

    builder.setHiveInstance({
        did: "did:elastos:if9gnMgd3KKwjLUNbn7KpnvUVdab9Bc2Qs",
        urlHost: "http://localhost:5000"
    })

    let options = builder.build()

    let qrCode = await HiveClient.getQrCode(options)
    
    console.log("code", qrCode)
}

run();