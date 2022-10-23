import { useContext } from "react";
import { UserContext } from "./userContext";
import { Container, Header, Segment } from "semantic-ui-react"; 

// message format: 
// ['color', 'primary message', 'secondary message', visible ]

const Messages = () => {

    const { message } = useContext( UserContext );

    return (
        <Container>
            <Segment textAlign="center" 
                color = {message.color} 
                style = {{
                marginTop: '4.5em',
                fontSize: 'large', 
                opacity: message.visible? '100%' : '0%'
            }}>
                <Header as='h3' 
                    color = {message.color} 
                    style = {{ 
                    marginBottom: '.5em', }}> 
                    {message.primary}
                </Header>
                {message.secondary} <br /> 
                {message.error ? `Full error message: ${message.error}` : null } 
            </Segment> 
        </Container>
    )
}

export default Messages