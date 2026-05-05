'use strict';

// const shim = require('fabric-shim');
const ArticleContract = require('./crud');
module.exports.contracts = [ArticleContract];

// async function main() {
//     const serverOpts = {
//         ccid: process.env.CHAINCODE_ID,
//         address: process.env.CHAINCODE_SERVER_ADDRESS || '0.0.0.0:9999'
        
//     };
//     const shim = require('fabric-shim');

//     var Chaincode = class {
//         Init(stub) {
//             return stub.putState('dummyKey', Buffer.from('dummyValue'))
//                 .then(() => {
//                     console.info('Chaincode instantiation is successful');
//                     return shim.success();
//                 }, () => {
//                     return shim.error();
//                 });
//         }

//         Invoke(stub) {
//             console.info('Transaction ID: ' + stub.getTxID());
//             console.info(util.format('Args: %j', stub.getArgs()));

//             let ret = stub.getFunctionAndParameters();
//             console.info('Calling function: ' + ret.fcn);

//             return stub.getState('dummyKey')
//             .then((value) => {
//                 if (value.toString() === 'dummyValue') {
//                     console.info(util.format('successfully retrieved value "%j" for the key "dummyKey"', value ));
//                     return shim.success();
//                 } else {
//                     console.error('Failed to retrieve dummyKey or the retrieved value is not expected: ' + value);
//                     return shim.error();
//                 }
//             });
//         }
//     };

//     try {
//         shim.server(new ArticleContract(), serverOpts);
//         console.log(`Article Chaincode Server started on ${serverOpts.address}`);
//     } catch (e) {
//         console.error(`Error starting chaincode server: ${e.stack}`);
//         process.exit(1);
//     }
// }

// main();