import { CONTRACT_ADDRESS, abi } from "../constants";
import { Contract, providers, utils } from "ethers";



export const connectWallet = async () => {
    try {
        // Get the provider from web3Modal, which in our case is MetaMask
        // When used for the first time, it prompts the user to connect their wallet
        await getProviderOrSigner();
        setWalletConnected(true);
        setRequestConnect(false);
    } catch (err) {
        console.error(err);
    }
};

export const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
        window.alert("Change the network to Goerli");
        throw new Error("Change network to Goerli");
    }

    if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
    }

    return web3Provider;

};

export const certify = async (docHash, address, description) => {
    try {
        // get provider or signer.
        const provider = await getProviderOrSigner();
        // create link to contract.
        const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
        // call function in contract. 
        const certificateIndex = await dcContract.certify(docHash, address, description);
        console.log(certificateIndex)
    } catch (err) {
        console.error(err.message);
    }
}

export const checkDocHash = async (_docHash) => {

    try {
        // get provider or signer.
        const provider = await getProviderOrSigner();
        // create link to contract.
        const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
        // call function in contract. 
        const certificateIndex = await dcContract.checkDocHash(_docHash);

        return certificateIndex
    } catch (err) {
        console.error(err.message);
    }
}

export const checkIssuer = async (address) => {
    try {
        // get provider or signer.
        const provider = await getProviderOrSigner();
        // create link to contract.
        const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
        // call function in contract. 
        const certificateIndex = await dcContract.checkIssuer(address);
        console.log(certificateIndex)
    } catch (err) {
        console.error(err.message);
    }
}

export const checkRecipient = async (address) => {
    try {
        // get provider or signer.
        const provider = await getProviderOrSigner();
        // create link to contract.
        const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
        // call function in contract. 
        const certificateIndex = await dcContract.checkRecipient(address);

        certificateIndex.keys

        return certificateIndex

    } catch (err) {
        console.error(err.message);
    }
}

export const callCertificate = async (index) => {

    try {
        // get provider or signer.
        const provider = await getProviderOrSigner();
        // create link to contract.
        const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
        // call function in contract. 
        const data = await dcContract.callCertificate(index);
        const certificate = {
            id: index,
            docHash: data[0],
            issuer: data[1],
            recipient: data[2],
            description: data[3],
            dateTime: data[4]
        }

        return (certificate)

    } catch (err) {
        console.error(err.message);
    }
}

export const revokeCertificate = async (index) => {
    try {
        // get provider or signer.
        const provider = await getProviderOrSigner();
        // create link to contract.
        const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
        // call function in contract. 
        const certificate = await dcContract.revokeCertificate(index);

        console.log(certificate)
    } catch (err) {
        console.error(err.message);
    }
}

