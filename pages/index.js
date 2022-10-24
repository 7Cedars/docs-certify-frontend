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

// importing dependencies. 
import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers"; 
import { UserContext } from "../components/userContext";
import { CONTRACT_ADDRESS, abi } from "../constants";
import { Contract, providers } from "ethers";
import { Container, Grid, Card } from "semantic-ui-react"; 
import Web3Modal from "web3modal";
import bg from "../assets/images/background3.jpg"
import 'semantic-ui-css/semantic.min.css';

// importing components. 
import NavBar  from "../components/navBar";
import FrontPage from "../components/FrontPage";
import RenderCertificate from "../components/RenderCertificate"
import CheckCertificates from "../components/CheckCertificates"
import IssueCertificate from "../components/IssueCertificate"
import Messages from "../components/Messages";

// Setup
export default function Home() {
  
  // PART 0: setting all state and ref constants of the page. 
  // keeps track of what tab is selected. 
  const [tab, setTab] = useState('Home');
  // keeps track if app is loading (most often waiting for blockchain interaction) 
  const [loading, setLoading] = useState();
  // keeps track of meesaging to users. Both error and success messages.  
  const [message, setMessage] = useState('');
  // keeps track if a wallet has been connected to the app, and if so - what address.  
  const [walletAddress, setWalletAddress] = useState(null);
  // array to store user input. 
  const [userInput, setUserInput] = useState('');
  // array to save processed certificates returned from contract.  
  const [certificatesArray, setCertificatesArray] = useState(null);
  // references to web3 instance. 
  const web3ModalRef = useRef();

/*
initiate interaction with wallet. EITHER as provider (wallet not connected = read only) 
OR as a signer (active mode, can issue and revoke certificates).
*/
  
  // getting a default provider wallet  
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

  // getting a specific signer wallet.   
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
        setMessage("wrongNetwork")
        throw new Error("Change network to Goerli");
      }

      const signer = web3Provider.getSigner();
      let walletAddress = await signer.getAddress();
      setWalletAddress(walletAddress)
      return signer;
    }

/* 
The following are functions to interact with ethereum contract. 
*/

  // issuing a new certificate. Signer is required. 
  const certify = async (userInput) => {
    setLoading('upload')

    try {
      const signer = await getSigner();     
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, signer);       
      let tx = await dcContract.certify(userInput[0], userInput[1], userInput[2]);
      setMessage("uploadInProgress")
      // console.log(tx.hash) 

      await tx.wait();
      setMessage("uploadSuccessful")
      setTimeout(() => { setMessage('invisible') }, 5000)

    } catch (err) { 
      console.error(err.message);
    }

  setLoading(null)
  }

  // Checking certificates by docHash. Returns an array of indexes. Signer not required.
  const checkDocHash = async (userInput) => {

    try {
      const provider = await getProvider();
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider); 
      const certificateIndex = await dcContract.checkDocHash(userInput);
      return certificateIndex[0]

    } catch (err) {
      console.error(err.message);
    }
  }

  // Checking certificates by address of issuer. Returns an array of indexes.  Signer not required.
  const checkIssuer = async (userInput) => {
    try {
      const provider = await getProvider();
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
      const certificateIndex = await dcContract.checkIssuer(userInput);

      return certificateIndex

    } catch (err) {
      console.error(err.message);
    }
  }

  // Checking certificates by address of recipient. Returns an array of indexes.  Signer not required.
  const checkRecipient = async (userInput) => {
    try {
      const provider = await getProvider();
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, provider);
      const certificateIndex = await dcContract.checkRecipient(userInput);
      // certificateIndex.keys
     
      return certificateIndex
      
    } catch (err) {
      console.error(err.message);
    }
  }

  // Takes an array of indexes, and calls each certificate. No signer required.
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

  // Revoke a certificate. Signer required. 
  const revokeCertificate = async (index) => {
    setLoading(index)
    
    try {
      const signer = await getSigner();
      const dcContract = new Contract(CONTRACT_ADDRESS, abi, signer);
      let tx = await dcContract.revokeCertificate(index);
      
      setMessage("revokeInProgress")
      await tx.wait();

    } catch (err) {
      console.error(err.message);
    }
    setMessage("revokeSuccessful")
    setLoading(null)
    setTimeout(() => { setMessage('') }, 5000)
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
          {
            id: 0,
            issuer: ` `,
            recipient: ` `,
            description: ['If you did expect a certificate, a few things might have happened:', <br/>,
                          '1) The address has been mispelled or the uploaded document is not the original.', <br/>,
                          '2) The certificate was not succesfully uploaded.', <br/>,
                          '3) The certificate was revoked.', <br/>,  
                          '4) There is a bug in the application.', <br/>],
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
        setMessage("noUserInput")
        setTimeout(() => { setMessage('invisible') }, 5000)
      }
          
    console.log("certificatesArray: ", certificates)
    setCertificatesArray(certificates)
    setLoading(null)
    setUserInput(null)
  }
  
  // at startup calls for a (read only) provider and sets a background image. 
  useEffect(() => {
    getProvider();
    document.body.style.backgroundImage = `url(${bg.src})`; // `url(${background2})`;
  }, []);

  // everytime tab is changed, resets certificate list and userinput. 
  useEffect(() => {
    setCertificatesArray(null)
    setUserInput(null)
  }, [tab]); 

/*
Here the actual (one page) app is rendered.
*/

  return (
      <div > 
        <UserContext.Provider value={{ 
          tab, setTab,
          loading, setLoading, 
          userInput, setUserInput, 
          walletAddress, message }}> 
        <NavBar getSigner = {getSigner} /> 
        <Messages /> 
        <FrontPage />
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
                {/* Note that the certificates are rendered on this top level. 
                This allows for easy rendering of specific certificates.  */}
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