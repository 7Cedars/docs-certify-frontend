import { Header, Button, Segment, Popup } from "semantic-ui-react"; 

const button = (issuer, recipient, id) => {
  
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
                  onClick={() => revokeCertificate(id)} />
                </Segment>
              }
              on = 'click'
              position = "bottom"
          />
        </div>
      )
      }
}

const Certificate = ( {certificate} ) => {

    try {
        return ({
            header: `Certicate issued on: ${certificate.dateTime}`,
            meta: [`Issuer: ${certificate.issuer}`, <br/>,  
                    `Recipient: ${certificate.recipient}`],
            description: `Description: ${certificate.description}`, 
            style: { overflowWrap: 'break-word' },
            extra: button(certificate.issuer, certificate.recipient, certificate.id)
        })
    } catch (error) {
        return ({
            header: `Certicate has been revoked.`
        })
    }
}

export default Certificate

