import { useContext } from "react";
import { UserContext } from "./userContext";
import { Container, Header, Segment } from "semantic-ui-react"; 

const Messages = () => {

    const { message } = useContext(UserContext);

    console.log("message is: ", message)

    let content = {}

    if (message === "invisible") {
        content = { color: 'green',
                    primary: '...', 
                    secondary: '...',
                    visible: false}
    }

    if (message === "wrongNetwork") {
        content = { color: 'red',
                    primary: 'Change the network to Goerli.',
                    secondary: 'This app needs MetaMask to be installed.',
                    visible: true}
    }

    if (message === "uploadInProgress") {
        content = { color: 'blue',
                    primary: 'Currently uploading certificate to the blockchain.',
                    secondary: 'This can take a few minutes.',
                    visible: true}
    }

    if (message === "uploadSuccessful") {
        content = { color: 'green',
                    primary: 'Upload succesfull',
                    secondary: 'Your certificate has been succesfully uploaded to the Ethereum blockchain',
                    visible: true}
    }

    if (message === "revokeInProgress") {
        content = { color: 'blue',
                    primary: 'Currently revoking certificate.',
                    secondary: 'This can take a few minutes.',
                    visible: true
                }
    }

    if (message === "revokeSuccessful") {
        content = { color: 'green',
                    primary: 'Revoke succesfull.',
                    secondary: 'Your certificate has been succesfully revoked.',
                    visible: true}
    }

    if (message === "noUserInput") {
        content = { color: 'red',
                    primary: 'No user input provided', 
                    secondary: 'Please insert an address or document.', 
                    visible: true}
    }
    
    return (
        <Container>
            <Segment textAlign="center" 
                color = {content.color} 
                style = {{
                marginTop: '4.5em',
                fontSize: 'large', 
                opacity: content.visible? '100%' : '0%'
            }}>
                <Header as='h3' 
                    color = {content.color} 
                    style = {{ 
                    marginBottom: '.5em', }}> 
                    {content.primary}
                </Header>
                {content.secondary} <br /> 
                {content.error ? `Full error message: ${content.error}` : null } 
            </Segment> 
        </Container>
    )
}

export default Messages