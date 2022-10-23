/*
This is a simple utility that lets users issue and check certificates of authenticity for offline documents. 
Important functional characteristics of the dapp: 
Users can use the app - in read-only mode - without having an ethereum wallet installed. 
If they wish to issue a certificate, they are introduced to MetaMask, 
Including a link and explanation. 

please note:
I built the app while learning solidity and js. It is an personal educational project.  
For an extensive explanation of the app and its aims, see the readme file and about section in the app
*/ 

// import styles from "../styles/Home.module.css";
import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers"; 
import { UserContext } from "../components/userContext";
import Web3Modal from "web3modal";
import { CONTRACT_ADDRESS, abi } from "../constants";
import { Contract, providers, utils } from "ethers";
import { Container, Grid, Card } from "semantic-ui-react"; 

import bg from "../assets/images/background3.jpg"
import NavBar  from "../components/navBar";
import FrontPage from "../components/FrontPage";
import RenderCertificate from "../components/RenderCertificate"
import InputCheck from "../components/InputCheck"
import InputUpload from "../components/InputUpload"
import Messages from "../components/Messages";
import 'semantic-ui-css/semantic.min.css';


export default function Home() {

  const [tab, setTab] = useState('Home');
  const [loading, setLoading] = useState();
  const [message, setMessage] = useState({
    color: 'green',
    primary: 'message1', 
    secondary: 'message2',
    visible: false, 
    error: ''
  });
  const [walletAddress, setWalletAddress] = useState(null);
  const [certificatesArray, setCertificatesArray] = useState(null);
  const [userInput, setUserInput] = useState('');
  const web3ModalRef = useRef();

  const getProvider = async () => {

      // create a default, read only, provider. This way dapp is usable without having a web3 wallet. 
      // somehow, the connection does not quite work correctly yet. 
      web3ModalRef.current = new ethers.getDefaultProvider( // 
        "goerli", 
        // ${process.env.REACT_APP_ALCHEMY_API_KEY} 
        {alchemy: 'CBr2qzLP-lXUxJFiPwPZvLJIGrv-mMt-'})
      const web3Provider = web3ModalRef.current

      console.log('web3 provider:', web3Provider)
      
      return web3Provider;
  }

  const getSigner = async () => {

      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);  

      console.log('web3 signer:', web3Provider)

      const { chainId } = await web3Provider.getNetwork();

      if (chainId !== 5) {
        setMessage(
          {color: 'red',
            primary: 'Change the network to Goerli.',
            secondary: 'This app needs MetaMask to be installed.',
            visible: true}
          )
        throw new Error("Change network to Goerli");
      }

      const signer = web3Provider.getSigner();
      return signer;
    }

  // See here for answer: https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
  const connectWallet = async () => {
      try {

        const signer = await getSigner(); 
        let walletAddress = await signer.getAddress();
        setWalletAddress(walletAddress)
        
      } catch (err) {
        console.error(err);
      }
    }

  const certify = async (userInput) => {
    setLoading('upload')

    try {
      // get provider or signer.
      const provider = await getSigner();     
      // create link to contract.
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);      
      // call function in contract.      
      let tx = await dcContract.certify(userInput[0], userInput[1], userInput[2]);
      setMessage(
        {color: 'blue',
          primary: 'Currently uploading certificate to the blockchain.',
          secondary: 'This can take a few minutes.',
          visible: true}
        )
      // console.log(tx.hash) 

      await tx.wait();
      setMessage(
        {color: 'green',
          primary: 'Upload succesfull',
          secondary: 'Your certificate has been succesfully uploaded to the Ethereum blockchain',
          error: err.message, 
          visible: true}
        )
      setTimeout(() => { 
        setMessage({visible: false}) 
        setUserInput('') 
      }, 5000)

    } catch (err) { 
      console.error(err.message);
    }

  setLoading(null)
  }

  const checkDocHash = async (userInput) => {

    try {
      // get provider or signer.
      const provider = await getProvider();
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
      const provider = await getProvider();
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
      const provider = await getProvider();
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
      const provider = await getProvider();
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
      const data = await dcContract.callCertificate(parseInt(index));

      const dateTimeObj = new Date(parseInt(data[4] * 1000))
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

      const certificate = {
        id: index,
        docHash: data[0],
        issuer: `Issuer: ${data[1]}`,
        recipient: data[2] === '0x0000000000000000000000000000000000000000' ? 
          `Recipient: N/A` : `Recipient: ${data[2]}`,
        description: (parseInt(data[3]) === '') ? 
          `Description: N/A` : `Description: ${data[3]}`,
        dateTime: `Certicate issued on: ${new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(dateTimeObj)}`
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
      const provider = await getSigner();
      // create link to contract.
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
      // call function in contract. 
      let tx = await dcContract.revokeCertificate(index);
      
      setMessage(
        {color: 'blue',
          primary: 'Currently revoking certificate.',
          secondary: 'This can take a few minutes.',
          visible: true}
        )
      await tx.wait();

    } catch (err) {
      console.error(err.message);
    }
    setMessage(
      {color: 'green',
        primary: 'Revoke succesfull.',
        secondary: 'Your certificate has been succesfully revoked.',
        visible: true}
      )
    setLoading(null)
    setTimeout(() => { setMessage({visible: false}) }, 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading('loading')

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
    try { 
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
      } catch (err) {
        setMessage({
          color: 'red',
          primary: 'No user input provided', 
          secondary: 'Please insert an address or document.', 
          visible: true
        }
        )
        setTimeout(() => { setMessage({visible: false}) }, 5000)
      }
          
    console.log("certificatesArray: ", certificates)
    setCertificatesArray(certificates)
    setLoading(null)
    setUserInput(null)
  }

  useEffect(() => {
    getProvider();
    document.body.style.backgroundImage = `url(${bg.src})`; // `url(${background2})`;
  }, []);

  useEffect(() => {
    setCertificatesArray(null)
    setUserInput(null)
  }, [tab]); 

  return (
      <div > 
        <UserContext.Provider value={{ 
          tab, setTab,
          loading, setLoading, 
          userInput, setUserInput, 
          walletAddress, 
          message, setMessage }}> 
        <NavBar connectWallet = {connectWallet} /> 
        {/* () => connectWallet() */}
        <Messages /> 
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
                        marginTop: '.5em',
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
// https://codesandbox.io/s/j43b10?file=/src/App.js:469-571 // 
// sandbox example: https://codesandbox.io/s/j43b10?file=/src/App.js (not with react though, needed to add useEffect)
// main part is from web3dao learning course. -- the useContext tick is from youtube: https://www.youtube.com/watch?v=vYWMyOyrbYU

// NB check LEarnweb3.io class on ENS names to refactor this page. Insert ENS names
// https://learnweb3.io/courses/6394ea7c-0ad6-4a4a-879f-7f9756bc5976/lessons/23bacf56-3ceb-457a-a97d-419fe3b333d9 