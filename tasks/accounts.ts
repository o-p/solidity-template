import { Signer } from '@ethersproject/abstract-signer'
import { task } from 'hardhat/config'
import colors from 'colors/safe'

task('accounts', 'Prints the list of accounts & balances')
  .addParam('unit', 'The unit of balance', 'ether')
  .setAction(async (args, { ethers, network }) => {
    const accounts: Signer[] = await ethers.getSigners()
    const {
      config: { chainId },
    } = network

    console.log(`
Network ${network.name} (${chainId}) accounts:
`)

    for (const account of accounts) {
      const address = await account.getAddress()
      const balance = await ethers.provider.getBalance(address)

      console.log(
        colors.magenta(address),
        colors.yellow(ethers.utils.formatUnits(balance, args.unit) + ' ' + args.unit)
      )
    }
  })
