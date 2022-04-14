# KOLnet token

## Deploy process
1. Install [Yarn](https://yarnpkg.com/)
1. Clone or download the repo
1. Install dependencies by running `yarn` in the project folder
1. Setup environment. See `.env.sample` for required keys. 
   - MNEMONIC The seed phrase for deploy account. The account with path `m/44'/60'/0'/0/0` will be used. You can use Ian Coleman's [Mnemonic Code Converter tool](https://iancoleman.io/bip39/) to generate test one. Don't forget to send some ETH to this address. And import it's private key to metamask: it will be required to confirm you are a deployer of the token. Also it'll be useful for testing purposes on testnet.
   - ALCHEMY_KEY Key used to access [Alchemy](https://www.alchemy.com/) API. Register there and generate one.
   - ETHERSCAN_API_KEY Key used to verify contract source. Register on Etherscan and generate one
   - BSCSCAN_API_KEY
   - POLYGONSCAN_API_KEY
1. Run deploy script `yarn deploy --<network>` where <network> is one of:
    - `mainnet` Ethereum mainnet
    - `rinkeby` Ethereum testnet
    - `bsc` Binance Smart Chain
    - `bscTestnet` BSC testnet
    - `polygon` Polygon (MATIC)
    - `polygonMumbai` Polygon Testnet
    - `metis` Polygon (MATIC)
    - `metisTestnet` Polygon Testnet
1. Wait for deploy script to complete. It will deploy *token implementation* (this contracts stores ony logic of the token), *token proxy* (this contract stores data of the token and should be used by all users, write down this address) and will try to verify them. Verification may fail for different reasons, it's not a problem: you can always verify manually.
1. After verification is done, *token proxy* should be *initialized*. This is very important step. The address who initializes the proxy will be assigned all manager roles for the contract. Use some secure address, hardware wallet is recommended for mainnet. For testnet - the address from MNEMONIC will be fine.

