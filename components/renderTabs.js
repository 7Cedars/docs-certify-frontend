import React, { useContext } from "react";
import { UserContext } from "./userContext";
import { Container, Header, Button, Icon } from "semantic-ui-react"; 
import 'semantic-ui-css/semantic.min.css';

function introText(title, body) {
  return (
    <Container text >
          <Header
            size='large'
            content={title}
            style={{
              textAlign: 'center',
              fontWeight: 'normal',
              marginBottom: 0,
              marginTop: '3em',
            }}
          />
          <Header
            size='medium'
            content={body}
            style={{
              textAlign: 'center',
              fontWeight: 'normal',
              marginTop: '1.5em',
              maxWidth: '50em'
            }}
          />
        </Container>
    )
}

export function RenderTabs() {

    const {tab, setTab} = useContext(UserContext);

    // Home tab rendering 
    if (tab == 'Home') {
      return (     
        <Container text textAlign='center'>
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
          <Button primary size='huge' textAlign='center' style={{ marginTop: '3rem'}}>
          Check Authenticity
          <Icon name='right arrow' />
          </Button>
      </Container>
      ) 
    }
    
    // About tab rendering 
    if (tab == 'About') { 
      return ( 
        introText(
          'About', 
          'This will give an extended explanation of the dapp later on. WIP')
      );
    };

    // Check Document tab rendering 
    if (tab == 'Check Document') { 
      return ( 
        introText(
          'Check documents on authenticity', 
          'Upload a document and check if a certificate of \
          authenticity has been issued on the Ethereum Blockchain.')
      );
    };

    // Certify Document tab rendering 
    if (tab == 'Certify Document') { 
      return ( 
        introText(
          'Certify Document', 
          'Upload a document and issue a certificate of authenticity \
          on the Ethereum Blockchain.')
      );
    };

    // Certifications Issued tab rendering 
    if (tab == 'Certifications Issued') { 
      return ( 
        introText(
          'Certifications Issued', 
          'A list of certifications issued by this address.')
      );
    };

    // Certifications Received tab rendering 
    if (tab == 'Certifications Received') { 
      return ( 
        introText(
          'Certifications Received', 
          'A list of certifications received by this address.')
      );
    };

    // Error tab rendering 
    { 
      return ( 
        introText(
          'ERROR', 
          'No tab name was recognized.')
      );
    };

  };
