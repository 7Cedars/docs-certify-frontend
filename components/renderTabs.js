import React, { useContext, useEffect, useState } from "react";
import { UserContext, Web3ModalContext } from "./userContext";
import { Container, Header, Button, Icon, Segment, Form, Input, Grid, StepTitle, Card } from "semantic-ui-react"; 
import 'semantic-ui-css/semantic.min.css';
import { callCertificate, checkRecipient } from "../pages/index"
import { datetime } from 'timeago-react';

/* 
Part 1: Create dynamic components for tabs. 
*/

const renderListCertificates  = (certificatesArray) => { 

  const { setCertificatesArray } = useContext(Web3ModalContext);

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
          header: 'No certificates found.', 
          meta: 'This can be because....etc', 
          style: { overflowWrap: 'break-word' },
          fluid: true,
          color: 'red'
        } 
      ]
    }

    if (certificatesArray.length > 0) {

      item = certificatesArray.map((certificate, id) => ({
        header: `Certicate issued on: ${certificate.dateTime}`,
        meta: [`Issuer: ${certificate.issuer}`, <br/>,  
                `Recipient: ${certificate.recipient}`],
        description: `Description: ${certificate.description}`, 
        fluid: true, 
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
          marginTop: '3em',
        }}
      />
    </Container>
    )
  }

  if (tab == 'Certify') { 
    return (    
      <Container text textAlign = 'center'>
      <Header
        as='h1'
        content='Certify' 
        style={{
          fontSize: '4em',
          fontWeight: 'normal',
          marginBottom: 0,
          marginTop: '3em',
        }}
      />
    </Container>
  
    ) 
  }
}

export const RenderLeftTab = () => {

  const { tab } = useContext(UserContext);

  const { 
    userInput, 
    setCertificatesArray, 
    certificatesArray, 
    callCertificate,
    checkIssuer,
    checkRecipient,
    setUserInput } = useContext(Web3ModalContext);

  if (tab == 'DocHash_Certs') { 
    return (    
      <Container text textAlign = 'center'>
      <Header
        as='h1'
        content='DocHash_Certs' 
        style={{
          fontSize: '4em',
          fontWeight: 'normal',
          marginBottom: 0,
          marginTop: '3em',
        }}
      />
    </Container>
  
    ) 
  }

  if (tab == 'Issued_Certs' || 
      tab == 'Received_Certs') {

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
      <Container fluid className="userInputBox">
          <Segment placeholder fluid textAlign = 'center' style={{
              marginBottom: '5em',
              marginTop: '10em',
              fontSize: 'large'
              }}>
                <Container fluid>
                  <Icon name='file outline' size = 'huge' style={{
                    marginTop: '.5em', marginBottom: '.5em' 
                    }}>
                  </Icon>
                  <Form onSubmit = {handleSubmit} fluid  >
                    <Form.Input fluid 
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

  const { tab } = useContext(UserContext);
  const { certificatesArray } = useContext(Web3ModalContext);

  if (tab == 'DocHash_Certs'||
      tab == 'Issued_Certs'||
      tab == 'Received_Certs' ) { 

      return (
        renderListCertificates(certificatesArray) 
        )
    }
  }

  // https://blog.logrocket.com/using-filereader-api-preview-images-react/