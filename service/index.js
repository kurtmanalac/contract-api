'use strict';

const shim = require('fabric-shim');
const ArticleContract = require('./crud');

async function main() {
    const serverOpts = {
        ccid: process.env.CHAINCODE_ID,
        address: process.env.CHAINCODE_SERVER_ADDRESS || '0.0.0.0:9999',
        tlsProps: {
            key: process.env.CHAINCODE_TLS_KEY,
            cert: process.env.CHAINCODE_TLS_CERT,
            clientCACert: process.env.CHAINCODE_CLIENT_CA_CERT
        }
    };

    try {
        const server = shim.server(new ArticleContract(), serverOpts);
        console.log(`Article Chaincode Server started on ${serverOpts.address}`);
        await server.start();
    } catch (e) {
        console.error(`Error starting chaincode server: ${e.stack}`);
        process.exit(1);
    }
}

main();