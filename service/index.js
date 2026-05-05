'use strict';

const shim = require('fabric-shim');
const ArticleContract = require('./crud');
module.exports.contracts = [ArticleContract];

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
    const shim = require('fabric-shim');

    const Chaincode = class {
        async Init(stub) {
            // use the instantiate input arguments to decide initial chaincode state values

            // save the initial states
            await stub.putState(key, Buffer.from(aStringValue));

            return shim.success(Buffer.from('Initialized Successfully!'));
        }

        async Invoke(stub) {
            // use the invoke input arguments to decide intended changes

            // retrieve existing chaincode states
            let oldValue = await stub.getState(key);

            // calculate new state values and saves them
            let newValue = oldValue + delta;
            await stub.putState(key, Buffer.from(newValue));

            return shim.success(Buffer.from(newValue.toString()));
        }
    };

    try {
        shim.start(new Chaincode());
        console.log(`Article Chaincode Server started on ${serverOpts.address}`);
        await server.start();
    } catch (e) {
        console.error(`Error starting chaincode server: ${e.stack}`);
        process.exit(1);
    }
}

main();