import React, { useContext } from "react";
import { Header, Button,  Segment, Popup, Card } from "semantic-ui-react"; 
import { UserContext } from "../components/userContext";
import 'semantic-ui-css/semantic.min.css';

const RenderCertificate  = ({ certificate, walletAddress, revokeCertificate }) => {
  const { loading } = useContext(UserContext);
  console.log( walletAddress )

  const nullContent = ( 
    <Card overflowwrap = 'break-word' fluid color = "red">
      <Card.Content>
        <Card.Header>No certificates found.</Card.Header>
        <Card.Meta> This can be because....etc </Card.Meta>
        <Card.Description> Description: {certificate.description} </Card.Description>
      </Card.Content>
    </Card>
  )

  const optionalContent = (
    items = [
      
    ]
    <Card.Content extra>
         <div className='ui two buttons'>
            <Popup
              trigger = { 
                <Button basic color='red' content = 'revoke' />  
                } 
                content = {
                  <Segment text textAlign = "center">
                  <Header as = 'h3' content = 'Warning: This will erase the certificate and cannot be undone.' /> 
                  <Button loading = { loading } color='red' content = 'Confirm Revoke' 
                    onClick={ revokeCertificate } />
                  </Segment>
                }
                on = 'click'
                position = "bottom center"
            />
          </div>  
    </Card.Content>
  )

return (
    <Card overflowwrap = 'break-word' fluid >
      <Card.Content>
        <Card.Header>Certicate issued on: {certificate.dateTime}</Card.Header>
        <Card.Meta> Issuer: {certificate.issuer} <br/>  
                    Recipient: {certificate.recipient} </Card.Meta>
        <Card.Description> Description: {certificate.description} </Card.Description>
      </Card.Content>
        { certificate.issuer == walletAddress ||
          certificate.recipient == walletAddress ? 
          {optionalContent} : null } 
    </Card>
  )
}

export default RenderCertificate

 