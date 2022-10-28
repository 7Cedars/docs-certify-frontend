import React, { useContext } from "react";
import { Header, Button, Card, Container, Segment } from "semantic-ui-react"; 
import { UserContext } from "../components/userContext";
import 'semantic-ui-css/semantic.min.css';

const RenderCertificate  = ({ certificate, revokeCertificate }) => {
  const { loading, walletAddress } = useContext(UserContext);
  console.log('certificate.id:', certificate.id )

  if (certificate.id === 0) {
    return (
      <Container >
      <Segment placeholder color = 'red' textAlign = 'left' style={{
          marginBottom: '.5em',
          marginTop: '.5em',
          }}>    
          <Header as ="h3" content = "No Certificate Found" /> 
          <Segment style={{ marginBottom: '.5em', marginTop: '.5em' }}>
            <Header as ="h4" content = "Why did I not find a certificate?" />
            <Container>
            If you did expect a certificate, a few things might have happened:
            <br /> 
            <li>  The address has been mispelled or the uploaded document is not the original.</li> 
            <li>  The certificate was not succesfully uploaded.</li> 
            <li>  The certificate was revoked.</li> 
            <li> There is a bug in the application.</li> 
            </Container>
          </Segment>
        </Segment>
      </Container>
    )
  }

  if (certificate.issuer != '0x0000000000000000000000000000000000000000') {

    return (
      <Container >
      <Segment placeholder color = 'green' textAlign = 'left' style={{
          marginBottom: '.5em',
          marginTop: '.5em',
          }}>    
          <Header as ="h3" content = {`Certificate No. ${certificate.id}`} /> 
          <Segment style={{ marginBottom: '.5em', marginTop: '.5em' }}>
            <Header as ="h4" content = {`Issued on ${certificate.dateTime}`} />
          </Segment>
          <Segment style={{ marginBottom: '.5em', marginTop: '.5em' }}>
            <Header as ="h4" style={{ marginBottom: '.3em' }} content = "Issuer" />
            {/* Here I can later include possible ENS name.  */}
            <Container content = {`Eth Address: ${certificate.issuer}`} />
          </Segment>
          {certificate.recipient === '0x0000000000000000000000000000000000000000' ? 
            null
            :
            <Segment style={{ marginBottom: '.5em', marginTop: '.5em' }}>
            <Header as ="h4" style={{ marginBottom: '.3em' }} content = "Recipient" />
            {/* Here I can later include possible ENS name.  */}
            <Container content = {`Eth Address: ${certificate.recipient}`} />
          </Segment> } 
          {certificate.description === '' ? 
            null
            :
            <Segment style={{ marginBottom: '.5em', marginTop: '.5em' }} >
            <Header as ="h4"  style={{ marginBottom: '.3em' }} content = "Description" />
            <Container content = {certificate.description} />
          </Segment> } 
          { certificate.issuer == walletAddress ||
            certificate.recipient == walletAddress ? 
            <Button basic fluid color='red' 
                    style={{ marginBottom: '.5em', marginTop: '1em' }}
                    content = 'revoke' 
                    onClick={ revokeCertificate } 
                    loading = {loading === certificate.id} 
                    />   
            : null }
        </Segment>
      </Container>
    )
  }
}

export default RenderCertificate

 