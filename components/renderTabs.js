import React, { useContext, useEffect, useRef, useState } from "react";
import ethers, { utils, base64 } from "ethers";
// import {sha256} from 'crypto-hash';
import * as sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import { UserContext, Web3ModalContext } from "./userContext";
import { Container, Header, Button, Icon, Segment, Form, Input, Grid, StepTitle, Popup, Card, Image } from "semantic-ui-react"; 
import 'semantic-ui-css/semantic.min.css';
import { callCertificate, checkRecipient } from "../pages/index"
import { datetime } from 'timeago-react';

/* 
Part 1: Create dynamic components for tabs. 
*/

const renderListCertificates  = (certificatesArray) => { 

  const { address, revokeCertificate, loading, complete } = useContext(Web3ModalContext);
  console.log( address )

  const item = []  

  // NB! To make this work properly, I first have to implement loading default wallet, 
  // and implement logging in as a designated signer... see ethers docs: https://docs.ethers.io/v5/getting-started/
  const button = (issuer, recipient, id) => {

    if ( issuer == address ||
         recipient == address
      ) {

      if (complete == false) {
      
      return (
        <div className='ui two buttons'> 
          <Popup
            trigger = { 
              <Button basic color='red' content = 'revoke' />  
              } 
              content = {
                <Segment text textAlign = "center">
                <Header as = 'h3' content = 'Warning: This will erase the certificate and cannot be undone.' /> 
                <Button loading = {loading } color='red' content = 'Confirm Revoke' 
                  onClick={() => revokeCertificate(id)} />
                </Segment>
              }
              on = 'click'
              position = "bottom"
          />
        </div>
      )
      }
      if (complete == true) {
        return (
          <div className='ui two buttons'>
            <Button color='red' >
              Revoked
            </Button>
          </div>
        )
      }
    }
  }

  if (!certificatesArray) {
    item = [] 
  }

  if (certificatesArray) {
    if (certificatesArray.length == 0) {
      item = [
        {
          fluid: true,
          header: 'No certificates found.', 
          meta: 'This can be because....etc', 
          style: { overflowWrap: 'break-word' },
          color: 'red'
        } 
      ]
    }

    if (certificatesArray.length > 0) {
      item = certificatesArray.map((certificate, id) => ({
        // key: id, -- does not seem to work. 
        fluid: true,
        header: `Certicate issued on: ${certificate.dateTime}`,
        meta: [`Issuer: ${certificate.issuer}`, <br/>,  
                `Recipient: ${certificate.recipient}`],
        description: `Description: ${certificate.description}`, 
        style: { overflowWrap: 'break-word' },
        extra: button(certificate.issuer, certificate.recipient, certificate.id)
      })
      )
    }
  }

  return <Card.Group 
    style={{
      marginTop: '5em',
    }}
    items = {item} /> ;

}
  
export const RenderLeftTab = () => {

  const { tab } = useContext(UserContext);
  const { 
    userInput,
    userFile,  
    setUserInput, 
    setUserFile, 
    fileDataURL, 
    setFileDataURL,
    loading,
    setCertificatesArray, 
    callCertificate,
    checkDocHash, 
    checkIssuer,
    checkRecipient,
    walletConnected
    } = useContext(Web3ModalContext);

  // NB!!!!!!!!!!
  // If I USE *LET* INSTEAD OF *CONST* YOU ONLY USE IT WITHIN THE FUNCTION!!!!
  // THAT WAS WHAT THIS GUY IN THE UDEMY COURSE DID AS WELL!!! f ME. 
  // WILL HAVE TO DO SOME REFACTORING LATER. SIMPLIFY APP ACCORDINGLY. 
  // let fileInputRef = useRef(); 
  // const imageMimeType = /image\/(png|jpg|jpeg|pdf)/i;

  if (tab == 'Home' ||
      tab == 'About')
      { 

    return (     
      <Container className="userInputBox"  >
      <Segment basic textAlign = 'right' style={{
          marginBottom: '3em',
          marginTop: '15em',
          fontSize: 'large',
          color: "none"
          }}>
      <Header
        as='h1'
        content='Certify.xyz' 
        style={{
          fontSize: '4em',
          fontWeight: 'normal',
          marginBottom: 0,
          color: "white"
        }}
      />
      <Header
        as='h2'
        content='Providing immutable certifications 
        of documents’ authenticity. 
        Built on the Ethereum blockchain.'
        style={{
          fontSize: '1.7em',
          fontWeight: 'normal',
          marginTop: '1.5em',
          color: "white"
        }}
      />
        <Button primary 
          size='huge' 
          onClick={() => setTab('DocHash_Certs')}
          style={{ 
            marginTop: '3rem'
            }}>
        Check Authenticity
        <Icon name='right arrow' />
        </Button>
         </Segment>
    </Container>
    ) 
  }

  if (tab == 'DocHash_Certs') {

    const certificates = [];
    const data = []

    const changeHandler = async (e) => {
      
      const input = e.target.files[0]; 
      setUserFile(input);

    }

    const handleSubmit = async () => {
      let fileReader = false;
      let result; 
      
        fileReader = new FileReader();
        fileReader.readAsDataURL(userFile);
        fileReader.onload = function () {
          result = fileReader.result; 
          // NB: Here the hashing is done! // 
          setUserInput(utils.keccak256( utils.toUtf8Bytes(result) )); // 0x12, 0x34sha256 // sha256(result).toString()
          console.log()
        };    
        
        

      try {
        
        data = await (checkDocHash(userInput))
      
        // I think I can do this with a mapping... anyway. // this await is tricky with a mapping. 
        for (let i = 0; i < data.length; i++) {
          certificates.push(
            await callCertificate( parseInt(data[i]) - 1)
            );
          }
  
          console.log( certificates )
          
          setCertificatesArray(certificates)
      
        } catch (err) {
            console.error(err);
          }
        } 
            
    return (
      <Container className="userInputBox">
      <Segment placeholder textAlign = 'center' style={{
          marginBottom: '5em',
          marginTop: '5em',
          fontSize: 'large'
          }}>
            { fileDataURL ? 
              <Image src={ fileDataURL } alt="preview" />
              : 
              <Container >
                <Icon name='file image outline' size = 'huge' style={{
                  marginTop: '.5em', marginBottom: '0em' 
                  }}>
                </Icon>
                <Form >                
                    {/* <Button
                      fluid
                      content="Choose File"
                      labelPosition="left"
                      icon="file"
                      // onClick={() => fileInputRef.current.click()}
                    /> */}
                    <input
                      // ref={ fileInputRef }
                      type="file"                    
                      // hidden
                      single="true"
                      // onClick={ changeHandler }
                      onChange={ changeHandler }
                    />
                    {/* </Button> */}
                    </Form>
                    </Container>
                }
                <Container >
                <Form onSubmit = { handleSubmit }>
                  <Button primary 
                      style={{
                      marginBottom: '2em',
                      marginTop: '1em',
                      textAlign: 'center',
                      fontSize: 'large',
                      marginTop: '2em',
                      }}>
                      Check Document
                     
                  </Button>  
                </Form>
                The document will not leave your computer. 
            You browser will create a unique document identifier that is uploaded to the Ethereum blockchain.
            </Container>
            
      </Segment>
    </Container> 
    ) 
  }

  if (tab == 'Issued_Certs' || 
      tab == 'Received_Certs'
      ) {

    const certificates = [];
    const data = []

    const handleSubmit = async (e) => {
      e.preventDefault(); 
  
    try {
      if (tab == 'Issued_Certs') {
        data = await (checkIssuer(userInput))
      } else {
        data = await (checkRecipient(userInput))
        }
    
      // I think I can do this with a mapping... anyway. // this await is tricky with a mapping. 
      for (let i = 0; i < data.length; i++) {
        certificates.push(
          await callCertificate( parseInt(data[i]) - 1)
          );
        }

        console.log(certificates)
        
        setCertificatesArray(certificates)
    
      } catch (err) {
          console.error(err);
        }
      }

    return (
      <Container className="userInputBox">
          <Segment placeholder textAlign = 'center' style={{
              marginBottom: '5em',
              marginTop: '5em',
              fontSize: 'large'
              }}>
                <Container >
                  <Icon name='user outline' size = 'huge' style={{
                    marginTop: '.5em', marginBottom: '.5em' 
                    }}>
                  </Icon>
                  <Form onSubmit = { handleSubmit }  >
                    <Form.Input 
                      label=
                        {tab == 'Issued_Certs' ? 
                          'Check issued certificates by address' : 
                          'Check received certificates by address'                    
                        }
                      control={ Input }
                      placeholder='Ethereum adress: 0x00...' 
                      value={userInput}
                      onChange = {(e) => setUserInput(e.target.value)} 
                      >
                      </Form.Input>
                  <Button primary style={{
                      marginBottom: '2em',
                      marginTop: '1em',
                      textAlign: 'center',
                      fontSize: 'large',
                      }}>
                      Check Address
                  </Button>  
                  </Form>
                                 
              </Container>
          </Segment>
        </Container>       
    ) 
  }

  if (tab == 'Certify') { 

    if (!walletConnected) {
      return (

      <Segment placeholder color='red'
      style={{ 
        marginBottom: '3em',
        marginTop: '5em',
        fontSize: 'large', 
        textAlign: "center"
        }}>
      <Header>
          Please connect your Ethereum wallet to this website. 
      </Header>
      <br/>
        Documents can only be certified while being logged in with an Ethereum wallet. 
      </Segment>
      )
    }
    

    if (walletConnected) {

    const changeHandler = async (e) => {      
    
      const input = e.target.files[0]; 
      setUserFile(input);
  
      let fileReader = false;
      let result; 
  
      fileReader = new FileReader();
        fileReader.readAsDataURL(input);
        fileReader.onload = function () {
          result = fileReader.result; 
          setUserInput(sha256(result).toString());
        };  
    };

    return ( 
      <Container className="userInputBox"> 
        { walletConnected ? 
          <Segment placeholder textAlign = 'center' style={{
            marginBottom: '5em',
            marginTop: '5em',
            fontSize: 'large'
            }}>
              { fileDataURL ? 
                <Image src={ fileDataURL } alt="preview" />
                : 
                <Container >
                  <Icon name='file image outline' size = 'huge' style={{
                    marginTop: '.5em', marginBottom: '0em' 
                    }}>
                  </Icon>
                  <Form >                
                      <input
                        type="file"                 
                        single="true"
                        onChange={ changeHandler }
                      />
                  </Form>
                  </Container>
                  }
                  <Container style={{
                    marginTop: '1.5em', marginBottom: '0em' 
                    }}>
                  The document will not leave your computer. 
                  You browser will create a unique document identifier that is uploaded to the Ethereum blockchain.
                  </Container>
            </Segment>
        : null } 
      </Container>
    )
  }
  }
}

export const RenderRigthTab = () => {

  const { tab } = useContext( UserContext );
  const { certificatesArray, 
          userInput, 
          certify, 
          walletConnected,
          loading } = useContext(Web3ModalContext);
  let recipientInput;
  let descriptionInput; 

  const onSubmit = async (e) => {
           
    certify([userInput, recipientInput, descriptionInput])

    console.log(userInput)
  };

  if (tab == 'About') {
    return (     
      <Container className="userInputBox"  >
      <Segment basic textAlign = 'left' style={{
          marginBottom: '3em',
          marginTop: '16.5em',
          fontSize: 'large',
          color: "none"
          }}>
      <Header
        as='h1'
        content='social authority on the blockchain' 
        style={{
          fontWeight: 'normal',
          marginBottom: 0,
          color: "white"
        }}
      />
      <Header
        as='h2'
        style={{
          fontWeight: 'normal',
          marginTop: '1.5em',
          color: "white"
        }}
      > 
       Certify.xyz provides certifications that are immutable, non-tradable and revokable. 
        They are easy to issue, check and revoke. 
        <br/>
        <br/>
        All of this, built on the Ethereum blockchain. 
        <br/>
        <br/>
        Check out the whitepaper and github repository.

        </Header>
      </Segment>
    </Container>
    ) 
  }

  if (tab == 'DocHash_Certs'||
      tab == 'Issued_Certs'||
      tab == 'Received_Certs' || 
      tab == 'Received_Certs' ) { 

      console.log(userInput)

      return (
        renderListCertificates(certificatesArray) 
        )
    }

  if (tab == 'Certify' && walletConnected) {
    
    return ( 

    <Form onSubmit = { onSubmit } 
    style={{
    marginBottom: '5em',
    marginTop: '5em',
    fontSize: 'large'
    }}>
    <Header as='h3' style = {{ color: "white" }}> Unique Document Hash </Header>
  
    { userInput ? 
      <Segment color='green' style={{fontSize: 'large', overflowWrap: 'break-word' }} > 
      { userInput } 
      </Segment>
      :
      <Segment color='red' style={{fontSize: 'large'}} > 
      Please choose a document to certify. 
      </Segment>
    }   
  
    <Form.Field  style={{ marginTop: '1.5em' }}>
      <label style={{ color: "white" }} >Recipient Address </label>
      <input 
        type='text'
        placeholder='0x00... (optional) ' 
        onChange= { (e) => recipientInput = e.target.value }
        />
    </Form.Field>

    <Form.Field >
      <label style={{ color: "white" }}>Description</label>
      <input 
        type='text'
        placeholder='Brief description of document. (optional)' 
        onChange= { (e) => descriptionInput = e.target.value }
        />
    </Form.Field>

    <Form.Field style={{textAlign: 'center'}}>
    <Button primary type='submit'
    disabled = { !userInput }       
          style={{ 
            marginBottom: '5em',
            marginTop: '1em',
            fontSize: 'large'
            }}> 
        Upload certificate to the ethereum blockchain
      </Button>
    </Form.Field>
  </Form>
    )
  }
}

  // For file uploader and shower: https://blog.logrocket.com/using-filereader-api-preview-images-react/
  // use native tools & up to date... 
  // upload button I got form here: https://stackoverflow.com/questions/55464274/react-input-type-file-semantic-ui-react 
  // for button see also (they all use useref): https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8
