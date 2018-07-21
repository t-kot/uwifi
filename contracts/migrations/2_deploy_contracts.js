const UWifiCore = artifacts.require('./UWifiCore.sol');

module.exports = function(deployer) {
    deployer.deploy(UWifiCore);
};
