import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'
import 'hardhat-abi-exporter'
import { config as dotenvConfig } from 'dotenv'
import { Wallet } from 'ethers'
import { resolve } from 'path'

import type { HardhatUpgrades } from '@openzeppelin/hardhat-upgrades/src';

import './tasks'

dotenvConfig({ path: resolve(__dirname, './.env') })

/**
 * @dev Priority:
 *   1. env: MNEMONIC
 *   2. env: KEY
 *   3. generate random accounts
 */
const accounts = (function getAccounts(mnemonic = '', privateKey = '') {
  if (mnemonic) {
    return {
      count: 10,
      mnemonic,
    }
  }

  if (privateKey) return [privateKey]

  console.log('Not assign secrets from environment variables, generate random accounts...')
  const wallet = Wallet.createRandom()
  return {
    count: 10,
    mnemonic: wallet.mnemonic!.phrase,
  }
})(process.env.MNEMONIC, process.env.KEY)

const config: HardhatUserConfig = {
  defaultNetwork: process.env.DEFAULT_NETWORK ?? 'hardhat',
  gasReporter: {
    currency: 'USD',
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
  },
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: '10000000000000000000000000',
      },
      chainId: 31337,
    },
    'bnb:mainnet': {
      accounts,
      chainId: 56,
      url: 'https://bsc-dataseed1.binance.org',
    },
    'bnb:testnet': {
      accounts,
      chainId: 97,
      // Check latency here: https://chainlist.org/chain/97
      url: 'https://data-seed-prebsc-2-s1.binance.org:8545',
    },
    'fra:mainnet': {
      accounts,
      chainId: 2152,
      url: 'https://prod-mainnet.prod.findora.org:8545',
      timeout: 20000000,
      gasMultiplier: 1.2,
    },
    'arb:goerli': {
      accounts,
      chainId: 421_613,
      url: 'https://arbitrum-goerli.publicnode.com',
    },
    'arb:sepolia': {
      accounts,
      chainId: 421_614,
      url: 'https://public.stackup.sh/api/v1/node/arbitrum-sepolia',
    },
    'linea:goerli': {
      accounts,
      chainId: 59_140,
      // url: `https://rpc.goerli.linea.build`,
      url: `https://linea-goerli.blockpi.network/v1/rpc/public`,
      // gasPrice: 0.5e9,
    },
    'opbnb:testnet': {
      accounts,
      chainId: 5_611,
      url: `https://opbnb-testnet-rpc.bnbchain.org`,
      gasPrice: 1500000008, // 1.500000008 gwei
    },
    'linea:mainnet': {
      accounts,
      chainId: 59_144,
      url: `https://linea.blockpi.network/v1/rpc/public`,
    },
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './tests',
  },
  solidity: {
    compilers: [
      {
        version: '0.8.20',
        settings: {
          metadata: {
            // Not including the metadata hash
            // https://github.com/paulrberg/solidity-template/issues/31
            bytecodeHash: 'none',
          },
          // Disable the optimizer when debugging
          // https://hardhat.org/hardhat-network/#solidity-optimizer-support
          optimizer: {
            enabled: true,
            runs: 200,
          },
          // evmVersion: 'default',
        },
      },
      // {
      //   version: '0.8.12',
      //   settings: {
      //     metadata: { bytecodeHash: 'none' },
      //     optimizer: { enabled: true, runs: 200 },
      //   },
      // },
    ],
  },
  typechain: {
    outDir: 'build/types',
    target: 'ethers-v5',
  },
  abiExporter: {
    path: './build/abi',
    format: 'json',
    spacing: 2,
    clear: true,
    flat: true,
  },
  etherscan: {
    apiKey: {
      'linea:mainnet': process.env.LINEA_MAINNET_ETHERSCAN_API_KEY ?? '',
      'arb:goerli': process.env.ARBISCAN_API_KEY ?? '',
      'arb:one': process.env.ARBISCAN_API_KEY ?? '',
    },
    customChains: [
      {
        network: 'linea:mainnet',
        chainId: 59_144,
        urls: {
          apiURL: 'https://api.lineascan.build/api',
          browserURL: `https://lineascan.build`,
        },
      },
      {
        network: 'arb:one',
        chainId: 42_161,
        urls: {
          apiURL: `https://api.arbiscan.io/api`,
          browserURL: `https://arbiscan.io`,
        },
      },
      {
        network: 'arb:goerli',
        chainId: 421_613,
        urls: {
          apiURL: `https://api-goerli.arbiscan.io/api`,
          browserURL: `https://goerli.arbiscan.io/`,
        },
      },
    ],
  },
}

export default config

declare module 'hardhat/types/runtime' {
  export interface HardhatRuntimeEnvironment {
    upgrades: HardhatUpgrades;
  }
}
