// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";


// This contract is here to make hardhat compile and find ERC1967Proxy
abstract contract ProxyStub is ERC1967Proxy {
}