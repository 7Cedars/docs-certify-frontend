import React, { useState, useRef, useEffect } from "react";
import { UserContext, Web3ModalContext } from "../components/userContext";
import { RenderFullPage, RenderLeftTab, RenderRigthTab } from "../components/renderTabs";
import { NavBar } from "../components/navBar";
import Web3Modal from "web3modal";
import { CONTRACT_ADDRESS, abi } from "../constants";
import { Contract, providers, utils } from "ethers";
import { Container, Header, Button, Icon, Segment, Form, Input, Grid, StepTitle, Card } from "semantic-ui-react"; 

export default function Home() {

  const [tab, setTab] = useState('Home');
  const [walletConnected, setWalletConnected] = useState(false);
  const [requestConnect, setRequestConnect] = useState(false);
  const [listCertificates, setListCertificates] = useState();
  const [userInput, setUserInput] = useState('');
  const web3ModalRef = useRef();
  // const imageType = /image\/(png|jpg|jpeg|pdf)/i;
  // const [file, setFile] = useState(null);
  // const [fileDataURL, setFileDataURL] = useState(null);

  const getProviderOrSigner = async (needSigner = false) => {
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

  const connectWallet = async () => {
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

  useEffect(() => {
    try {
      connectWallet();
    } catch (err) {
      setWalletConnected(false)
    }
  }, [walletConnected]);

  // useEffect(() => {
  //   renderPage()
  // }, [tab]);

  useEffect(() => {
    if (requestConnect) {
      // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [requestConnect]);

 const certify = async (docHash, userInput, description) => {
    try {
      // get provider or signer.
      const provider = await getProviderOrSigner();
      // create link to contract.
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
      // call function in contract. 
      const certificateIndex = await dcContract.certify(docHash, userInput, description);
      console.log(certificateIndex)
    } catch (err) {
      console.error(err.message);
    }
  }

  const checkDocHash = async (userInput) => {

    try {
      // get provider or signer.
      const provider = await getProviderOrSigner();
      // create link to contract.
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
      // call function in contract. 
      const certificateIndex = await dcContract.checkDocHash(userInput);

      return certificateIndex
    } catch (err) {
      console.error(err.message);
    }
  }

  const checkIssuer = async (userInput) => {
    try {
      // get provider or signer.
      const provider = await getProviderOrSigner();
      // create link to contract.
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
      // call function in contract. 
      const certificateIndex = await dcContract.checkIssuer(userInput);
      console.log(certificateIndex)
    } catch (err) {
      console.error(err.message);
    }
  }

  const checkRecipient = async (userInput) => {
    try {
      // get provider or signer.
      const provider = await getProviderOrSigner();
      // create link to contract.
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
      // call function in contract. 
      const certificateIndex = await dcContract.checkRecipient(userInput);

      certificateIndex.keys

      return certificateIndex

    } catch (err) {
      console.error(err.message);
    }
  }

  const callCertificate = async (index) => {

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

  const revokeCertificate = async (index) => {
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

  // All functions above are made available to all nested components below.
  // Second user context communicates what tab is selected.
  
  // useEffect(() => {
  //   RenderFullPage
  // }, [tab]); 

  useEffect(() => {
    RenderRigthTab 
  }, [listCertificates]); 
  
  return (
      <div> 
        <UserContext.Provider value={{ tab, setTab }}>
        <Web3ModalContext.Provider value={{ 
          walletConnected, 
          setRequestConnect, 
          userInput, 
          setUserInput,
          listCertificates, 
          setListCertificates,
          certify, 
          checkDocHash,
          checkIssuer,
          checkRecipient,
          callCertificate,
          revokeCertificate
          }}>
        <NavBar />
        <RenderFullPage />
          <Container>
            <Grid padded>
              <Grid.Column width = '8' > 
                <RenderLeftTab />
              </Grid.Column> 
              <Grid.Column width = '8'> 
                <RenderRigthTab />
              </Grid.Column> 
          </Grid>
          </Container>
        </Web3ModalContext.Provider>
        </UserContext.Provider>
        </div>
      )
  } 

// References: 
// <WalletConnected.Provider value={{ walletConnected, setWalletConnected }}> 
// https://codesandbox.io/s/j43b10?file=/src/App.js:469-571 // </WalletConnected.Provider>
// sandbox example: https://codesandbox.io/s/j43b10?file=/src/App.js (not with react though, needed to add useEffect)
// main part is from web3dao learning course. -- the useContext tick is from youtube: https://www.youtube.com/watch?v=vYWMyOyrbYU