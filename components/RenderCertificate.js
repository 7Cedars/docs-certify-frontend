import React, { useContext } from "react";
import { Header, Button, Card } from "semantic-ui-react"; 
import { UserContext } from "../components/userContext";
import 'semantic-ui-css/semantic.min.css';

const RenderCertificate  = ({ certificate, revokeCertificate }) => {
  const { loading, walletAddress } = useContext(UserContext);
  console.log('certificate.id:', certificate.id )

  const optionalContent = (
    <Card.Content extra>
        <div className='ui two buttons'>
          <Button basic color='red' content = 'revoke' onClick={ revokeCertificate } loading = {loading === certificate.id} />  
      </div>  
    </Card.Content>
  )

  if (certificate.issuer != 'Issuer: 0x0000000000000000000000000000000000000000') {

    return (
    
      <Card overflowwrap = 'break-word' fluid >
        <Card.Content>
          <Card.Header>{certificate.dateTime}</Card.Header>
          <Card.Meta> {certificate.issuer} <br/>  
                       {certificate.recipient} </Card.Meta>
          <Card.Description> 
            <Header as='h4'> {certificate.description} </Header>
          </Card.Description>
        </Card.Content>
          { certificate.issuer == `Issuer: ${walletAddress}` ||
            certificate.recipient == `Recipient: ${walletAddress}`? 
            optionalContent : null }
      </Card>
    )
    }
}

export default RenderCertificate

 