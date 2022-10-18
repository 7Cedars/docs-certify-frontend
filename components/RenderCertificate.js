// NB! To make this work properly, I first have to implement loading default wallet, 
// and implement logging in as a designated signer... see ethers docs: https://docs.ethers.io/v5/getting-started/

// The following should be implemented at the input side: this should be one of the possible outputs on the certificatesArray. 

// if (certificatesArray) {
//   if (certificatesArray.length == 0) {
//     item = [
//       {
//         fluid: true,
//         header: 'No certificates found.', 
//         meta: 'This can be because....etc', 
//         style: { overflowWrap: 'break-word' },
//         color: 'red'
//       } 
//     ]
//   }

import React, { useContext } from "react";
import { Header, Button,  Segment, Popup, Card } from "semantic-ui-react"; 

const button = ({ issuer, recipient, address, revokeCertificate }) => {
  
  if ( issuer == address ||
       recipient == address
    ) {
  
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
                onClick={ revokeCertificate } />
              </Segment>
            }
            on = 'click'
            position = "bottom"
        />
      </div>
    )
  }
}

const RenderCertificate  = ({ certificatesArray, address, revokeCertificate }) => { 

    const item = []  
  
        item = certificatesArray.map((certificate) => {
            try {
              return ({
                  header: `Certicate issued on: ${certificate.dateTime}`,
                  meta: [`Issuer: ${certificate.issuer}`, <br/>,  
                          `Recipient: ${certificate.recipient}`],
                  description: `Description: ${certificate.description}`, 
                  style: { overflowWrap: 'break-word' },
                  extra: button(certificate.issuer, certificate.recipient, address, revokeCertificate)
              })
          } catch (error) {
              return ({
                  header: `Error: Invalid certicate format.`
              })
          }      
        })
      

    if (certificatesArray) {
      return <Card.Group 
        style={{
          marginTop: '5em',
        }}
        items = {item} /> ;
    }

  }

  export default RenderCertificate