import React, { useContext, useEffect, useState } from "react";
import { UserContext, Web3ModalContext } from "./userContext";
import { Container, Header, Button, Icon, Segment, Form, Input, Grid, StepTitle, Card } from "semantic-ui-react"; 
import 'semantic-ui-css/semantic.min.css';
import { callCertificate, checkRecipient } from "../pages/index"

/* 
Part 1: Create dynamic components for tabs. 
*/

const renderListCertificates  = (listCertificates) => {

  const item = [ 
          {
            header: 'None', 
            meta: 'None', 
            style: { overflowWrap: 'break-word' }
          } ]

    if (listCertificates) 
    {
      const item = [ 
        {
          header: 'Some', 
          meta: 'Some', 
          style: { overflowWrap: 'break-word' }
          // header: listCertificates[0].issuer, 
          // meta: listCertificates[0].receiver, 
          // style: { overflowWrap: 'break-word' }
        }   
      ] 

      }
  
    return <Card.Group items={item} /> 

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

export const landingPage = (tab) => {

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
}

export const aboutTab = (tab) => {
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


export const handleCheckRecipient = () => {
  
  const { tab } = useContext(UserContext);
  const { 
    address, 
    setListCertificates, 
    listCertificates, 
    callCertificate, 
    setAddress } = useContext(Web3ModalContext);

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {

    const data = await (checkRecipient(address))
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

  if (tab == 'Received_Certs') { 

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
                      value={address}
                      onChange ={(e) => address = (e.target.value)} 
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
  }

    // FROM HERE ON OLD! 


function checkDocumentTab() {

  return (
    <Container>
    <Grid padded>
      <Grid.Column width = '8' > 
         text
      </Grid.Column> 
        <Grid.Column width = '8'> 
       text
        </Grid.Column> 
    </Grid>
    </Container>
  )
}

function certifyDocumentTab() {
  return (
    <Container text textAlign = 'center'>
      About Tab.
      Here some text about the app 
    </Container>
  )
}

function certificationsIssuedTab() {
  return (
    <Container text textAlign = 'center'>
      About Tab.
      Here some text about the app 
    </Container>
  )
}


/* 
Part 3: Render tabs according to selection. 
*/
// export function RenderTabs() {

//     const {tab, setTab} = useContext(UserContext);
//     const { listCertificates, setListCertificates } = useContext(Web3ModalContext);

    // useEffect(() => { 
    //   renderListCertificates(listCertificates)
    //   //   return () => {
    //   //     setListCertificates()
    //   // }
    // }, [listCertificates]);

     // const { connected, setConnected } = useContext(WalletConnected);

    // Home tab rendering 
    // if (tab == 'Home') {
      
    // }
    
  //   // About tab rendering 
  //   if (tab == 'About') {  
  //     return (
  //       <div>
  //       { introText(
  //         'About', 
  //         'This will give an extended explanation of the dapp later on. WIP' 
  //         )}, 
  //       { aboutTab() }
  //       </div>
  //     );
  //   };

  //   // Check Document tab rendering 
  //   if (tab == 'Check Document') { 
  //     return ( 
  //       <div>
  //       { introText(
  //         'Check documents on authenticity', 
  //         'Upload a document and check if a certificate of \
  //         authenticity has been issued on the Ethereum Blockchain.'
  //       )}, 
  //       { checkDocumentTab() }
  //       </div>
  //     );
  //   };

  //   // Certify Document tab rendering 
  //   if (tab == 'Certify Document') { 
  //     return ( 
  //       <div>
  //       { introText(
  //         'Certify Document', 
  //         'Upload a document and issue a certificate of authenticity \
  //         on the Ethereum Blockchain.'
  //       )}, 
  //       { certifyDocumentTab() }
  //       </div>
  //     );
  //   };

  //   // Certifications Issued tab rendering 
  //   if (tab == 'Certifications Issued') { 
  //     return ( 
  //       <div>
  //       { introText(
  //         'Certifications Issued', 
  //         'A list of certifications issued by this address.'
  //       )}, 
  //       { certificationsIssuedTab() }
  //       </div>
  //     );
  //   };

  //   // Certifications Received tab rendering 
  //   if (tab == 'Certifications Received') { 
  //     return ( 
  //       <div>
  //       { introText(
  //         'Certifications Received', 
  //         'A list of certifications received by this address.'
  //       )}, 
  //       <Container text textAlign = 'center'>
  //       <Grid padded>
  //         <Grid.Column width = '8' > 
  //           { CheckRecipients() } 
  //           </Grid.Column> 
  //           <Grid.Column width = '8'> 
  //           { renderListCertificates(listCertificates) }
  //           </Grid.Column> 
  //       </Grid>
  //       </Container>
  //       </div>
  //     );
  //   };

  //   // Error tab rendering 
  //   { 
  //     return ( 
  //       introText(
  //         'ERROR', 
  //         'No tab name recognized.')
  //     );
  //   };

  // };

  // https://blog.logrocket.com/using-filereader-api-preview-images-react/