import { useContext } from "react";
import { UserContext } from "./userContext";
import { Container, Header, Button, Segment, Grid, Sticky } from "semantic-ui-react"; 

const AboutPage = () => {
    
    const { tab, setTab } = useContext(UserContext);

    if (tab == 'About') {

    return (        
            <Container className="userInputBox"  >
                <Segment basic textAlign = 'left' style={{
                    marginBottom: '3em',
                    marginTop: '2em',
                    fontSize: 'large',
                    color: "none"
                    }}>
                <Header
                    as='h1'
                    content='Certiy.xyz: social authority on the blockchain' 
                    style={{
                    fontWeight: 'normal',
                    marginBottom: 0,
                    color: "white"
                    }}
                />
                <Header
                    as='h2'
                    style={{
                    fontWeight: 'normal',
                    Height: '100px',
                    overflowY: 'scroll',
                    marginTop: '1.5em',
                    color: "white"
                    }}
                > 
                    Certify.doc provides certificates of authenticity that are immutable, non-tradable and revokable. 
                    <li> The issuer of a certificate vouches for the authenticity of an offline document.</li> 
                    <li> Recipients can be related to a certificate of authenticity.</li> 
                    <li> Certificates cannot be traded, but can be revoked by both the issuer and recipient. </li> 
                    <br/>
                    Certificates that can be used by 
                    <li> Educators to certify the authenticity of their degrees.</li> 
                    <li> Employers to certify authenticy of employer's statements.</li> 
                    <li> Individuals to authenticate wills and estates. </li> 
                    <br/>
                    Certify.doc relates the social authority behind an ethereum address to a digital document, 
                    and expresses a relationship between two social actors.
                    <br/>
                    <br/>
                    All of this, built on the Ethereum blockchain. 
                    <br/>
                    <br/>
                    {/* Still need to include links here. */}
                    Check out the whitepaper and github repository.  
                    </Header>
                </Segment>
            </Container>
        )
    }
}

export default AboutPage