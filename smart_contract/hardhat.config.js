require("@nomiclabs/hardhat-waffle");

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/hz_xsdLlTZYQrRild3fKg5AjXIXzesZ6',
      accounts: [ 'baf2642d40b6b5cfc37ecdc964cfb54ce7a730a828945b9eafb582fa6446dd35' ]
    }
  }
};
