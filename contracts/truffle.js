const HDWallerProvider = require('truffle-hdwallet-provider');
const mnemonic = process.env.RINKEBY_MNEMONIC;
const accessToken = process.env.INFURA_ACCESS_TOKEN;

module.exports = {
    migrations_directory: "./migrations",
    networks: {
        development: {
            host: "localhost",
            port: 7545,
            network_id: "*", // Match any network id
            gas: 4600000
        },
        rinkeby: {
            provider: () => {
                return new HDWallerProvider(
                    mnemonic,
                    `https://rinkeby.infura.io/${accessToken}`,
                );
            },
            network_id: 3,
            gas: 4600000
        },
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    },
};
