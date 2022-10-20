import React, { useContext } from "react";
import { Header, Button, Card } from "semantic-ui-react"; 
import { UserContext } from "../components/userContext";
import 'semantic-ui-css/semantic.min.css';

const RenderCertificate  = ({ certificate, revokeCertificate }) => {
  const { loading, walletAddress } = useContext(UserContext);
  console.log( walletAddress )

  const optionalContent = (
         <div className='ui two buttons'>
            <Button basic color='red' content = 'revoke' onClick={ revokeCertificate } />  
        </div>  
  )

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
        <Card.Content extra>
          { certificate.issuer == `Issuer: ${walletAddress}` ||
            certificate.recipient == `Recipient: ${walletAddress}`? 
            optionalContent : null }
        </Card.Content> 
      </Card>
    )
}

export default RenderCertificate

 