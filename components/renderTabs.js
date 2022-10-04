import React, { useContext, useEffect, useRef, useState } from "react";
// import {sha256} from 'crypto-hash';
import * as sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import { UserContext, Web3ModalContext } from "./userContext";
import { Container, Header, Button, Icon, Segment, Form, Input, Grid, StepTitle, Card, Image } from "semantic-ui-react"; 
import 'semantic-ui-css/semantic.min.css';
import { callCertificate, checkRecipient } from "../pages/index"
import { datetime } from 'timeago-react';

/* 
Part 1: Create dynamic components for tabs. 
*/

const renderListCertificates  = (certificatesArray) => { 

  const item = []
  const button = ( 
    <div className='ui two buttons'>
        <Button basic color='red'>
          Revoke
        </Button>
      </div>
      ) 

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
        fluid: true,
        header: `Certicate issued on: ${certificate.dateTime}`,
        meta: [`Issuer: ${certificate.issuer}`, <br/>,  
                `Recipient: ${certificate.recipient}`],
        description: `Description: ${certificate.description}`, 
        style: { overflowWrap: 'break-word' },
        extra: button
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
    
/* 
Part 2: Create dynamic tabs.
*/

export const RenderFullPage = () => {

  const { tab } = useContext(UserContext);
  
  if (tab == 'Home') { 

    return (     
      <Container text textAlign = 'center' >
      <Header
        as='h1'
        content='Certify.xyz' 
        style={{
          fontSize: '4em',
          fontWeight: 'normal',
          marginBottom: 0,
          marginTop: '3em',
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
        }}
      />
        <Button primary size='huge' 
          style={{ 
            marginTop: '3rem'
            }}>
        Check Authenticity
        <Icon name='right arrow' />
        </Button>
    </Container>
    ) 
  }

  if (tab == 'About') { 

    return (
      <Container text textAlign = 'center'>
      <Header
        as='h1'
        content='About section' 
        style={{
          fontSize: '4em',
          fontWeight: 'normal',
          marginBottom: 0,
          marginTop: '5em',
        }}
      />
    </Container>
    )
  }

  if (tab == 'Certify') { 
    return ( 
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
      
    //   <Container text textAlign = 'center'>
    //   <Header
    //     as='h1'
    //     content='Certify' 
    //     style={{
    //       fontSize: '4em',
    //       fontWeight: 'normal',
    //       marginBottom: 0,
    //       marginTop: '5em',
    //     }}
    //   />
    // </Container>
  
    ) 
  }
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
    setCertificatesArray, 
    callCertificate,
    checkDocHash, 
    checkIssuer,
    checkRecipient
    } = useContext(Web3ModalContext);

  // NB!!!!!!!!!!
  // If I USE *LET* INSTEAD OF *CONST* YOU ONLY USE IT WITHIN THE FUNCTION!!!!
  // THAT WAS WHAT THIS GUY IN THE UDEMY COURSE DID AS WELL!!! f ME. 
  // WILL HAVE TO DO SOME REFACTORING LATER. SIMPLIFY APP ACCORDINGLY. 
  // let fileInputRef = useRef(); 
  // const imageMimeType = /image\/(png|jpg|jpeg|pdf)/i;

  if (tab == 'DocHash_Certs') {

    const certificates = [];
    const data = []

    const changeHandler = async (e) => {
      
      const input = e.target.files[0];
      // if (!input.type.match(imageMimeType)) {
      //   alert("Image mime type is not valid");
      //   return;
      // }      
      setUserFile(input);
    }

    const handleSubmit = async () => {
      let fileReader = false;
      let result; 
      
        fileReader = new FileReader();
        fileReader.readAsDataURL(userFile);
        fileReader.onload = function () {
          result = fileReader.result; 
          setUserInput(sha256(result).toString()); // sha256
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
                      Submit File
                     
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
                      Submit Address
                  </Button>  
                  </Form>
                                 
              </Container>
              {/* The document will not leave your computer. 
              It is uploaded to your browser that will create a unique document identifier. 
              This unique identifier is uploaded to the Ethereum blockchain and used to 
              certify the document's authenticity. */}
          </Segment>
        </Container>       
    ) 
  }
}

export const RenderRigthTab = () => {

  const { tab } = useContext( UserContext );
  const { certificatesArray, userInput } = useContext(Web3ModalContext);

  if (tab == 'DocHash_Certs'||
      tab == 'Issued_Certs'||
      tab == 'Received_Certs' ) { 

      console.log(userInput)

      return (
        renderListCertificates(certificatesArray) 
        )

    }
  }

  // For file uploader and shower: https://blog.logrocket.com/using-filereader-api-preview-images-react/
  // use native tools & up to date... 
  // upload button I got form here: https://stackoverflow.com/questions/55464274/react-input-type-file-semantic-ui-react 
  // for button see also (they all use useref): https://medium.com/web-dev-survey-from-kyoto/how-to-customize-the-file-upload-button-in-react-b3866a5973d8

  