/*
This is a simple utility that lets users issue and check certificates of authenticity for offline documents. 
Important functional characteristics of the dapp: 
Users can use the app - in read-only mode - without having an ethereum wallet installed. 
If they wish to issue a certificate, they are introduced to MetaMask, 
Including a link and explanation. 
It does not use all functionalities of the solidity contract yet. 

please note:
I built the app while learning solidity and js. It is an personal educational project.  
For an extensive explanation of the app and its aims, see the readme file and about section in the app
*/ 

// importing dependencies. 
import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers"; 
import { UserContext } from "../components/userContext";
import { CONTRACT_ADDRESS } from "../constants"; // was also abi 
import { Contract, providers } from "ethers";
import { Container, Grid, Card } from "semantic-ui-react"; 
import Web3Modal from "web3modal";
import bg from "../assets/images/background3.jpg"
import 'semantic-ui-css/semantic.min.css';
import ABI from '../utils/CertifyDoc.json';

// importing components. 
import NavBar  from "../components/navBar";
import Messages from "../components/Messages";
import FrontPage from "../components/FrontPage";
import AboutPage from "../components/AboutPage";
import CheckCertificates from "../components/CheckCertificates"
import RenderCertificate from "../components/RenderCertificate"
import IssueCertificate from "../components/IssueCertificate"

// Setup
export default function Home() {

  const contractAddress = "0xB4AfD5AA80a7D8e01BF3e7F3C8E3917a1De3790f";
  const abi = ABI.abi;
  
  // PART 0: setting all state and ref constants of the page. 
  // keeps track of what tab is selected. 
  const [tab, setTab] = useState('Home');
  // keeps track if app is loading (most often waiting for blockchain interaction) 
  const [loading, setLoading] = useState();
  // keeps track of meesaging to users. Both error and success messages.  
  const [message, setMessage] = useState('invisible');
  // keeps track if a wallet has been connected to the app, and if so - what address.  
  const [walletAddress, setWalletAddress] = useState(null);
  // array to store user input. 
  const [userInput, setUserInput] = useState('');
  // array to save processed certificates returned from contract.  
  const [certificatesArray, setCertificatesArray] = useState(null);

/* 
The following are functions to interact with ethereum contract. 
*/

  // issuing a new certificate. Signer is required. 
  const certify = async (userInput) => {
    setLoading('upload')

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const dcContract = new ethers.Contract(contractAddress, abi, signer);           
        let tx = await dcContract.certify(userInput[0], userInput[1], userInput[2]);
        setMessage("uploadInProgress")
        // console.log(tx.hash) 

        await tx.wait();
        setMessage("uploadSuccessful")
      }

    } catch (err) { 
      console.error(err.message);
    }

  setLoading(null)
  }

  // Checking certificates by docHash. Returns an array of indexes. Signer not required.
  const checkDocHash = async (userInput) => {

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const dcContract = new ethers.Contract(contractAddress, abi, provider);
        const certificateIndex = await dcContract.checkDocHash(userInput);

        return certificateIndex
      }

    } catch (err) {
      console.error(err.message);
    }
  }

  // Checking certificates by address of issuer. Returns an array of indexes.  Signer not required.
  const checkIssuer = async (userInput) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const dcContract = new ethers.Contract(contractAddress, abi, provider);
        const certificateIndex = await dcContract.checkIssuer(userInput);
      
      return certificateIndex
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  // Checking certificates by address of recipient. Returns an array of indexes.  Signer not required.
  const checkRecipient = async (userInput) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const dcContract = new ethers.Contract(contractAddress, abi, provider);
        const certificateIndex = await dcContract.checkRecipient(userInput);
      
      return certificateIndex
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  // Takes an array of indexes, and calls each certificate. No signer required.
  const callCertificate = async (index) => {

    console.log("at callCertificate: ", index)

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const dcContract = new ethers.Contract(contractAddress, abi, provider);
        const data = await dcContract.callCertificate(parseInt(index));
      
      const dateTimeObj = new Date(parseInt(data[4] * 1000))
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

      const certificate = {
        id: index,
        docHash: data[0],
        issuer: data[1],
        recipient: data[2],
        description: data[3],
        dateTime: new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(dateTimeObj)
      }
      
      return (certificate)
    }

    } catch (err) {
      console.error(err.message);
    }
  }

  // Revoke a certificate. Signer required. 
  const revokeCertificate = async (index) => {
    setLoading(index)
    
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const dcContract = new ethers.Contract(contractAddress, abi, signer);
        
        let tx = await dcContract.revokeCertificate(index);
        
        setMessage("revokeInProgress")
        await tx.wait();
      }

    } catch (err) {
      console.error(err.message);
    }
    setMessage("revokeSuccessful")
    setLoading(null)
  }

  // Passes user input to the requested (read only) function, based on the selected tab. 
  // All these functions return index of certificates 
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

    // calls data of each certificate, based on index received from previous call. 
    try { 
      if (data.length === 0) {
        certificates.push(
          { id: 0,
            description: "empty" }
        )}

        for (let i = 0; i < data.length; i++) {
          // console.log(data)
          certificates.push(
            await callCertificate( parseInt(data[i]) )
        )}

      } catch (err) {
        setMessage("invalidUserInput")
      }
    
    setCertificatesArray(certificates)
    setLoading(null)
    setUserInput('')
  }
  
  // everytime tab is changed, resets certificate list and userinput. 
  useEffect(() => {
    setCertificatesArray(null)
    setUserInput('')
   // setMessage('invisible') 
  }, [tab]); 

  // when certificates are listed, user input is reset.
  useEffect(() => {
    setUserInput('')
  }, [certificatesArray]); 

  // at startup calls for a (read only) provider and sets a background image. 
  useEffect(() => {
    // getProvider();
    setMessage('warningTestApp');
    // document.body.style.backgroundImage= `url(${bg.src})`; // `url(${background2})`;
    document.body.style.backgroundImage= `conic-gradient(from 90deg at 10% 15%, CornflowerBlue, fuchsia, salmon, CornflowerBlue)`;

  }, []);

/*
Here the actual (one page) app is rendered.
*/

  return (
      <div > 
        <UserContext.Provider value={{ 
          tab, setTab,
          loading, setLoading, 
          userInput, setUserInput,
          message, setMessage,
          walletAddress }}> 
        <NavBar /> 
          {/* getSigner = {getSigner} />  */}
        <Messages /> 
        <FrontPage />
        <AboutPage />
        <IssueCertificate certify = {certify} /> 
        { tab == 'DocHash_Certs'||
          tab == 'Issued_Certs'||
          tab == 'Received_Certs' ? 
            <Container>
              <Grid padded>
                <Grid.Column width = '8' > 
                  <CheckCertificates handleSubmit = {handleSubmit} /> 
                </Grid.Column> 
                <Grid.Column width = '8'>
                  <Container style={{
                      }} >  
                {/* Note that the certificates are rendered on this top level. 
                This allows for easy rendering of specific certificates.  */}
                      <Card.Group 
                      style={{
                        marginTop: '.1em',
                        height: "1000px",
                        overflowY: 'auto'
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
                    </Container>
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