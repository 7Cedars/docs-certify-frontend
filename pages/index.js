import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers"; 
import { UserContext, Web3ModalContext } from "../components/userContext";
import { RenderFullPage, RenderLeftTab, RenderRigthTab } from "../components/renderTabs";
import { NavBar } from "../components/navBar";
import Web3Modal, { PROVIDER_ICON_CLASSNAME } from "web3modal";
import { CONTRACT_ADDRESS, abi } from "../constants";
import { Contract, providers, utils } from "ethers";
import { Container, Grid } from "semantic-ui-react"; 
// import  background2 from "../src/assets/images/background2.jpg"

export default function Home() {

  const [tab, setTab] = useState('Home');
  const [walletConnected, setWalletConnected] = useState(false);
  const [requestConnect, setRequestConnect] = useState(false);
  const [certificatesArray, setCertificatesArray] = useState();
  const [userInput, setUserInput] = useState('');
  const [userFile, setUserFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [account, setAccount] = useState();
  const web3ModalRef = useRef();
  
  // NB: SETTING BACKGROUND IMAGE SOMEHOW DOES NOT WORK YET... 
  // const myStyle = {
  //   backgroundImage: `url('${background2}')`,
  //   backgroundPosition: 'center',
  //   backgroundSize: 'cover',
  //   backgroundRepeat: 'no-repeat'
  // }

  // document.body.style.backgroundColor = "red"; // THIS WORKS... 
  // document.body.style.backgroundImage = myStyle; // BUT THIS DOES NOT?!... 
  // NB: SETTING BACKGROUND IMAGE SOMEHOW DOES NOT WORK YET... 

  const getProviderOrSigner = async (needSigner = false) => {

    web3ModalRef.current = new ethers.getDefaultProvider("goerli")
    const web3Provider = web3ModalRef.current

    if (needSigner) {

      web3ModalRef.current = new Web3Modal({
        providerOptions: {},
        disableInjectedProvider: false,
      });

      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      const { chainId } = await web3Provider.getNetwork();

      if (chainId !== 5) {
        window.alert("Change the network to Goerli");
        throw new Error("Change network to Goerli");
      }

      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;

  };

  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner(true);
      setWalletConnected(true);
      setRequestConnect(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProviderOrSigner(false)
  }, []);

  useEffect(() => {
    try {
      getProviderOrSigner();
    } catch (err) {
      setWalletConnected(false)
    }
  }, [walletConnected]);

  useEffect(() => {
    if (requestConnect) {
      // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      connectWallet();
    }
  }, [requestConnect]);

 const certify = async (userInput) => {

  setLoading(true)

    try {
      // get provider or signer.
      const provider = await getProviderOrSigner(true);
     
      // create link to contract.
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
      
      // call function in contract.      
      await dcContract.certify(userInput[0], userInput[1], userInput[2]);

    } catch (err) {
      console.error(err.message);
    }

    setLoading(false)
  }

  const checkDocHash = async (userInput) => {

    try {
      // get provider or signer.
      const provider = await getProviderOrSigner();
      // create link to contract.
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
      // call function in contract. 
      const certificateIndex = await dcContract.checkDocHash(userInput);

      return certificateIndex[0]

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

      return certificateIndex

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

      // certificateIndex.keys

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
      const dateTimeObj = new Date(parseInt(data[4] * 1000))
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

      const certificate = {
        id: index,
        docHash: data[0],
        issuer: data[1],
        recipient: data[2],
        description: data[3],
        dateTime: `${dateTimeObj.getDay()} ${monthNames[(dateTimeObj.getMonth() + 1)]} ${dateTimeObj.getFullYear()}`
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
  //   // document.body.style.backgroundImage = myStyle;
  //   document.body.style.backgroundImage = myStyle; // `url(${background2})`;
  //   // document.body.style.backgroundColor = "red";
  // }, []);

  useEffect(() => {
    setCertificatesArray(null)
    setFileDataURL(null)
    setUserFile(null)
    setUserInput(null)
  }, [tab]); 

  useEffect(() => {
    RenderRigthTab  
  }, [certificatesArray]); 
  
  useEffect(() => {
    let fileReader, isCancel = false;
    if (userFile) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result)
        }
      }
      fileReader.readAsDataURL(userFile);
    }

    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }
  }, [userFile]);

  return (
    
      <div > 
        <UserContext.Provider value={{ tab, setTab }}>
        <Web3ModalContext.Provider value={{ 
          walletConnected, 
          setRequestConnect, 
          userInput, setUserInput,
          userFile, setUserFile,
          fileDataURL, setFileDataURL,
          certificatesArray, setCertificatesArray,
          loading, setLoading,
          account, setAccount,
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

// NB check LEarnweb3.io class on ENS names to refactor this page. Insert ENS names
// NB: but also get rid of REF to web3modal! 
// This probably means I can just make a utils component with all wallet functions. 
// I won't have to send them through with useContext! 
// https://learnweb3.io/courses/6394ea7c-0ad6-4a4a-879f-7f9756bc5976/lessons/23bacf56-3ceb-457a-a97d-419fe3b333d9 