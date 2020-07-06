import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  gasReporter: {
    currency: 'USD',
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: './contracts',
  },
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: '10000000000000000000000000',
      },
      chainId: 31337,
    },
  },
  paths: {
    artifacts: './cache/testing/artifacts',
    cache: './cache/testing/cache',
    sources: './contracts',
    tests: './tests',
  },
  solidity: {
    compilers: [
      {
        version: '0.8.21',
        settings: {
          metadata: {
            bytecodeHash: 'none',
          },
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  typechain: {
    outDir: 'build/types',
    target: 'ethers-v5',
  },
}

export default config
