var Registry = artifacts.require("./Registry.sol");
var Token = artifacts.require("./HumanStandardToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Registry);
  deployer.deploy(Token,1000,'BCT',0,'BCT');
};
