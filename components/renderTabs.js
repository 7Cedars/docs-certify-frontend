import React, { useContext, useEffect, useState } from "react";
import { UserContext, Web3ModalContext } from "./userContext";
import { Container, Header, Button, Icon, Segment, Form, Input, Grid, StepTitle, Card } from "semantic-ui-react"; 
import 'semantic-ui-css/semantic.min.css';
import { callCertificate, checkRecipient } from "../pages/index"

/* 
Part 1: Create dynamic components for tabs. 
*/

const renderListCertificates  = () => { // listCertificates

  // const item = [ 
  //         {
  //           header: 'None', 
  //           meta: 'None', 
  //           style: { overflowWrap: 'break-word' }
  //         } ]

  //   if (listCertificates) 
  //   {
  //     const item = [ 
  //       {
  //         header: 'Some', 
  //         meta: 'Some', 
  //         style: { overflowWrap: 'break-word' }
  //         // header: listCertificates[0].issuer, 
  //         // meta: listCertificates[0].receiver, 
  //         // style: { overflowWrap: 'break-word' }
  //       }   
  //     ] 

  //     }
  
  //   return <Card.Group items={item} /> 
return (
    <Container text textAlign = 'center'>
    <Header
      as='h1'
      content='Rendered List' 
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
      
  // }, [listCertificates]);


    // <Segment placeholder style={{
    //   marginBottom: '2.5em',
    //   marginTop: '2.5em',
    //   }}>
    // <Card.Group>
    //    <Card fluid>
    //       <Card.Content>
    //         <Card.Header>Date: 12 October 2022 </Card.Header>
    //         <Card.Header>Issuer: ENS Name</Card.Header>
    //         <Card.Meta>Eth Address: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2</Card.Meta>
    //         <Card.Header>Recipient: ENS Name</Card.Header>
    //         <Card.Meta>Eth Address: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2</Card.Meta>
    //         <Card.Header>Description</Card.Header>
    //         <Card.Description>
    //           Here a very succint description. 
    //         </Card.Description>
    //       </Card.Content>
    //       <Card.Content extra>
    //           <Button basic color='red'>
    //           Revoke
    //           </Button>
    //       </Card.Content>
    //    </Card>
    // </Card.Group>
    // </Segment>

/* 
Part 2: Create dynamic tabs.
*/

export const RenderFullPage = () => {

  const { tab } = useContext(UserContext);

  
  if (tab == 'Home') { 

    return (     
      <Container text textAlign = 'center'>
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
}

export const RenderLeftTab = () => {

  const { tab } = useContext(UserContext);

  const { 
    userInput, 
    setListCertificates, 
    listCertificates, 
    callCertificate,
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

  if (tab == 'Issued_Certs') { 
    return (    
      <Container text textAlign = 'center'>
      <Header
        as='h1'
        content='Issued_Certs' 
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

  if (tab == 'Received_Certs') { 

    const handleSubmit = async (e) => {
      e.preventDefault(); 
  
      try {
  
      const data = await (checkRecipient(userInput))
      const certificates = [];
    
      // I think I can do this with a mapping... anyway. // this await is tricky with a mapping. 
      for (let i = 0; i < data.length; i++) {
        certificates.push(
          await callCertificate( parseInt(data[i]) - 1)
          );
        }
        
        setListCertificates(certificates)
    
        console.log ( listCertificates )
    
      } catch (err) {
          console.error(err);
        }
      }

    return (    
      <Container >
          <Segment placeholder textAlign = 'center' style={{
              marginBottom: '2.5em',
              marginTop: '2.5em',
           
              // fontSize: 'large',
              }}>
                <Container textAlign="center">
                  <Icon name='file outline' size = 'huge' style={{
                    marginTop: '.5em',
                    }}>
                  </Icon>
                  <form onSubmit = {handleSubmit}>                
                  <label>Check received certificates by address</label>
                    <input 
                      type ='text'
                      placeholder='Ethereum adress: 0x00...' 
                      value={userInput}
                      onChange ={(e) => setUserInput(e.target.value)} 
                      /> 
                  <Button primary  style={{
                      marginBottom: '2em',
                      marginTop: '1em',
                      textAlign: 'center',
                      fontSize: 'large',
                      }}>
                      Submit Address
                  </Button>  
                  </form>
                                 
              </Container>
              {/* The document will not leave your computer. 
              It is uploaded to your browser that will create a unique document identifier. 
              This unique identifier is uploaded to the Ethereum blockchain and used to 
              certify the document's authenticity. */}
          </Segment>
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

export const RenderRigthTab = () => {

  const { tab } = useContext(UserContext);

  const { 
    userInput, 
    listCertificates,   
    setUserInput } = useContext(Web3ModalContext);

  if (tab == 'DocHash_Certs'||
      tab == 'Issued_Certs'||
      tab == 'Received_Certs' ) { 

      return (
        renderListCertificates() 
        )
  }

  if (tab == 'Certify') { 
    return (    
      <Container text textAlign = 'center'>
      <Header
        as='h1'
        content='Certify User input here.' 
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

  // https://blog.logrocket.com/using-filereader-api-preview-images-react/