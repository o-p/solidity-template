/**
 * @fileoverview 協助計算符合 ERC-7201 的 Location
 *
 * @see https://eips.ethereum.org/EIPS/eip-7201
 *
 * ERC-7201: Namespaced Storage Layout
 * Conventions for the storage location of structs in the namespaced storage pattern.
 *
 * These structs should be annotated with the NatSpec tag
 * @custom:storage-location <FORMULA_ID>:<NAMESPACE_ID>
 *
 * For example, @custom:storage-location erc7201:foobar
 * annotates a namespace with id "foobar" rooted at erc7201("foobar").
 *
 * e.g.1 @custom:storage-location erc7201:example.main
 * e.g.2 @custom:storage-location erc7201:openzeppelin.storage.ERC20
 *
 * The term keccak256(id) - 1 in the formula is chosen as a location
 * that is unused by Solidity, but this is not used as the final location because
 * namespaces can be larger than 1 slot and would extend into keccak256(id) + n,
 * which is potentially used by Solidity. A second hash is added to prevent this
 * and guarantee that namespaces are completely disjoint from standard storage,
 * assuming keccak256 collision resistance and that arrays are not unreasonably large.
 */

// import { BigNumber, utils } from 'ethers'
import { task } from 'hardhat/config'
import colors from 'colors/safe'

task('erc7201', 'Compute storage location by the rule of ERC-7201')
  .addParam('id', 'The id of the namespace, such as "example.main"')
  .addFlag('example', 'Show example code')
  .setAction(async (_taskArgs, { ethers }) => {
    const {
      BigNumber,
      utils: { keccak256, toUtf8Bytes },
    } = ethers

    const id = _taskArgs.id

    const loc = keccak256(
      BigNumber.from(
        keccak256(toUtf8Bytes(id))
      ).sub(1).toHexString()
    ).slice(0, -2) + '00'

    console.log(`
id: ${colors.yellow(id)}
loc: ${colors.magenta(loc)}

${ _taskArgs.example ? exampleCode(id, loc) : colors.grey('(add --example flag to show example codes)') }`)
  })


const exampleCode = (id: string, loc: string) => `
${colors.bgBlack('example code:')}
` + colors.grey(`

// @custom:storage-location erc7201:${id}
struct ____Storage {
    ....
}

// keccak256(abi.encode(uint256(keccak256("${id}")) - 1)) & ~bytes32(uint256(0xff))
bytes32 private constant ____StorageLocation = ${loc};

function _get____Storage() private pure returns (____Storage storage $) {
    assembly {
        $.slot := ____StorageLocation
    }
}
`)
