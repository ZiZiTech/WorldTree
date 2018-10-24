// const {Signale} = require('signale');
// const pino = require('pino')({
//     customLevels: {
//         log: 30
//     }
// });

const Cabin = require('cabin');
const cabin = new Cabin({
    // (optional: your free API key from https://cabinjs.com)
    // key: 'YOUR-CABIN-API-KEY',
    // axe: {
    //     logger: pino
    // }
});


export default cabin;