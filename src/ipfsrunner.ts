import * as http from "http";
import * as https from "https";

/**
 * The IPFS runner is for communicating with IPFS node.
 */
export class IpfsRunner {
    private readonly ipfsGatewayUrl: string;
    private readonly https: any;

    constructor(ipfsGatewayUrl?: string) {
        this.ipfsGatewayUrl = ipfsGatewayUrl ? ipfsGatewayUrl : 'https://ipfs.trinity-tech.io'
        this.https = this.ipfsGatewayUrl.startsWith('https://') ? https : http;
    }

    /**
     * Get the file content from the IPFS node.
     * @param cid the cid of the file.
     */
    getFile(cid: string): Promise<Buffer> {
        return new Promise(resolve => {
            let data = [];
            this.https.get(`${this.ipfsGatewayUrl}/ipfs/${cid}`, function (response) {
                response.on('data', (chunk) => data.push(chunk)).on('end', () => {
                    //at this point data is an array of Buffers
                    //so Buffer.concat() can make us a new Buffer
                    //of all of them together
                    resolve(Buffer.concat(data));
                })
            })
        })
    }
}
