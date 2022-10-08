import * as http from "http";
import * as https from "https";

export class IpfsRunner {
    private readonly ipfsGatewayUrl: string;
    private readonly https: any;

    constructor(ipfsGatewayUrl?: string) {
        this.ipfsGatewayUrl = ipfsGatewayUrl ? ipfsGatewayUrl : 'https://ipfs.trinity-tech.io'
        this.https = this.ipfsGatewayUrl.startsWith('https://') ? https : http;
    }

    public getFile(cid: string): Promise<Buffer> {
        let data = [];
        const url = `${this.ipfsGatewayUrl}/ipfs/${cid}`
        return new Promise(resolve => {
            const request = this.https.get(url, function (response) {
                response.on('data', function (chunk) {
                    data.push(chunk);
                }).on('end', function () {
                    //at this point data is an array of Buffers
                    //so Buffer.concat() can make us a new Buffer
                    //of all of them together
                    resolve(Buffer.concat(data));
                });
            })
        });
    }
}
