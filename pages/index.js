// import styles from "../styles/Home.module.css";
import React, { useState, useRef, useEffect } from "react";
import { ethers, BigNumber } from "ethers"; 
import { UserContext, Web3ModalContext } from "../components/userContext";
import { RenderRigthTab } from "../components/renderTabs";
import { NavBar } from "../components/navBar";
import Web3Modal, { PROVIDER_ICON_CLASSNAME } from "web3modal";
import { CONTRACT_ADDRESS, abi } from "../constants";
import { Contract, providers, utils } from "ethers";
import { Container, Grid, Card } from "semantic-ui-react"; 
import  bg from "../assets/images/background3.jpg"
import FrontPage from "../components/FrontPage";
import RenderCertificate from "../components/RenderCertificate"
import InputCheck from "../components/InputCheck"
import InputUpload from "../components/InputUpload"
import 'semantic-ui-css/semantic.min.css';

export default function Home() {

  const [tab, setTab] = useState('Home');
  const [loading, setLoading] = useState();

  const [requestConnect, setRequestConnect] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState();
  const web3ModalRef = useRef();

  const [certificatesArray, setCertificatesArray] = useState(null);
  const [userInput, setUserInput] = useState('');

  const getProviderOrSigner = async () => {

    if (!walletConnected) {
      // create a default, read only, provider. This way dapp is usable without having a web3 wallet. 
      web3ModalRef.current = new ethers.getDefaultProvider(
        "goerli", 
        // ${process.env.REACT_APP_ALCHEMY_API_KEY} 
        {alchemy: `CBr2qzLP-lXUxJFiPwPZvLJIGrv-mMt-`})
      const web3Provider = web3ModalRef.current

      console.log(web3Provider)
      
      return web3Provider;
    }
    
    if (walletConnected) {

      web3ModalRef.current = new Web3Modal({
        network: "goerli",
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
      let walletAddress = await signer.getAddress();
      setWalletAddress(walletAddress)
      
      return signer;
    }
  };

  const connectWallet = async () => {

    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (requestConnect) {     
      connectWallet();
      setRequestConnect(false)
    }
  }, [requestConnect]);

  useEffect(() => {
    getProviderOrSigner()
  }, []);

 const certify = async (userInput) => {

  setLoading('upload')

    try {
      // get provider or signer.
      const provider = await getProviderOrSigner();
     
      // create link to contract.
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
      
      // call function in contract.      
      await dcContract.certify(userInput[0], userInput[1], userInput[2]);

    } catch (err) {
      console.error(err.message);
    }

  setLoading(null)

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
      console.log("certificateIndex:", certificateIndex)
      return certificateIndex
      
    } catch (err) {
      console.error(err.message);
    }
  }

  const callCertificate = async (index) => {

    try {
      const provider = await getProviderOrSigner();
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
      const data = await dcContract.callCertificate(parseInt(index));

      const dateTimeObj = new Date(parseInt(data[4] * 1000))
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

      // this is a bit ugly, but it works. 
      const certificate = {
        id: index,
        docHash: data[0],
        issuer: (parseInt(data[4]) === 0) ?  
          `Issuer: N/A` : `Issuer: ${data[1]}`,
        recipient: data[2] === '0x0000000000000000000000000000000000000000' ? 
          `Recipient: N/A` : `Recipient: ${data[2]}`,
        description: (parseInt(data[4]) === 0) ? 
          `Description: N/A` : `Description: ${data[3]}`,
        dateTime: (parseInt(data[4]) === 0) ?  
          `Certificate has been revoked` : 
          `Certicate issued on: ${new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(dateTimeObj)}`
      }

      return (certificate)

    } catch (err) {
      console.error(err.message);
    }
  }

  const revokeCertificate = async (index) => {
    setLoading(index)
    try {
      // get provider or signer.
      const provider = await getProviderOrSigner();
      // create link to contract.
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
      // call function in contract. 
      await dcContract.revokeCertificate(index);

    } catch (err) {
      console.error(err.message);
    }

    setLoading(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(e)

    let certificates = [];
    let data = []

    if (tab == 'Issued_Certs') {
      data = await (checkIssuer(userInput))
    } 
    if (tab == 'Received_Certs') {
      data = await (checkRecipient(userInput))
    } 
    if (tab == 'DocHash_Certs') {
      data = await (checkDocHash(userInput))
    } 

    // Note that the following mapping does NOT work. 
    // data.map(async (item) => {
    //     let _certificate = await callCertificate( parseInt(item) )
    //     certificates.concat(_certificate)
    // })
    
    if (data.length === 0) {
      certificates.push(
        {
          id: 0,
          issuer: ` `,
          recipient: ` `,
          description: ['If you did expect a certificate, a few things might have happened:', <br/>,
                        '1) The address has been mispelled or the uploaded document is not the original.', <br/>,
                        '2) The certificate was not succesfully uploaded.', <br/>,
                        '3) There is a bug in this program.', <br/>],
          dateTime: `No certificates found`
        }
      )
    }

      for (let i = 0; i < data.length; i++) {
        certificates.push(
          await callCertificate( parseInt(data[i]) - 1)
          ); 
      }
          
    console.log("certificatesArray: ", certificates)
    setCertificatesArray(certificates)
    setLoading(null)
  }

  useEffect(() => {
    setCertificatesArray(null)
    setUserInput(null)
  }, [tab]); 

  useEffect(() => {
    document.body.style.backgroundImage = `url(${bg.src})`; // `url(${background2})`;
  }, []);

  return (
      <div > 
        <UserContext.Provider value={{ 
          tab, setTab,
          loading, setLoading, 
          userInput, setUserInput, 
          walletConnected, walletAddress }}> 
        <NavBar walletConnected = {walletConnected} setRequestConnect = {setRequestConnect} />
        <FrontPage />
        <InputUpload certify = {certify} /> 
        { tab == 'DocHash_Certs'||
          tab == 'Issued_Certs'||
          tab == 'Received_Certs' ? 
            <Container>
              <Grid padded>
                <Grid.Column width = '8' > 
                  <InputCheck handleSubmit = {handleSubmit} /> 
                </Grid.Column> 
                <Grid.Column width = '8'> 
                <Card.Group 
                      style={{
                        marginTop: '12.7em',
                      }} > 
                      { certificatesArray ?
                           certificatesArray.map(
                            certificate => <RenderCertificate
                              key = {certificate.id} 
                              certificate = {certificate}
                              revokeCertificate = {() => revokeCertificate(certificate.id) }
                              /> 
                          ) 
                      : [null] }
                    </Card.Group> 
                </Grid.Column> 
              </Grid>
            </Container>            
          :
            <></>
        }
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
// https://learnweb3.io/courses/6394ea7c-0ad6-4a4a-879f-7f9756bc5976/lessons/23bacf56-3ceb-457a-a97d-419fe3b333d9 