const hre = require("hardhat");
const axios = require('axios').default;
const ethers = hre.ethers;


async function main() {
	const TokenFactory = await ethers.getContractFactory("Token");
	const ProxyFactory = await ethers.getContractFactory("ERC1967Proxy");
    let confirmationPromises = [];

    const token = await TokenFactory.deploy();
	console.log(`Token implementation will be deployed to: ${token.address} Tx: ${token.deployTransaction.hash}`);
    confirmationPromises.push(token.deployTransaction.wait(5));

    const proxy = await ProxyFactory.deploy(token.address, "0x");
	console.log(`Token proxy will be deployed to: ${proxy.address} Tx: ${token.deployTransaction.hash}`);
    confirmationPromises.push(proxy.deployTransaction.wait(5));
    
    await Promise.allSettled(confirmationPromises);
    await run("verify:verify", { address: token.address });
    try {
        await run("verify:verify", { address: proxy.address, constructorArguments:[token.address, "0x"]});
    }catch(e){
        //ignore this, proxy is probably already verified anyway
    }
    await etherscanVerifyProxy(proxy.address, token.address);

    console.log(`Don't forget to initialize proxy! Open ${proxy.address} on the blockchain explorer and call 'initialize' on 'Write as Proxy' tab`);
}

async function etherscanVerifyProxy(proxyAddress, implementationAddress) {
    //Based on https://github.com/nomiclabs/hardhat/issues/1166#issuecomment-805980264 by marcelomorgado 
    const etherscanEndpoint = await hre.run("verify:get-etherscan-endpoint");

    console.log(`Verifying ${proxyAddress} as a proxy for ${implementationAddress} ...`);

    const url = `${etherscanEndpoint.urls.apiURL}?module=contract&action=verifyproxycontract&apikey=${process.env.ETHERSCAN_API_KEY}`
    const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: JSON.stringify({ "address": proxyAddress, "expectedimplementation": implementationAddress }),
        url,
    }
    const {
        data: { message: okOrNotOk, result: guidOrError },
    } = await axios(options)

    if (okOrNotOk === "NOTOK") {
        console.log(`Verification failed. Reason: ${guidOrError}`)
    } else {
        console.log(`Verification request sent.`)
        console.log(`To check the request status, use ${guidOrError} as GUID.`)

    }
}


main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});