/* 
This is an entirely static page, that provides background information on the Dapp. 
*/ 

import { useContext } from "react";
import { UserContext } from "./userContext";
import { Container, Header, Segment } from "semantic-ui-react"; 

const AboutPage = () => {
    
    const { tab, setTab } = useContext(UserContext);

    if (tab == "About") {

    return (        
            <Container className="userInputBox"  >
                <Segment basic textAlign = "left" style={{
                    marginBottom: "3em",
                    marginTop: "2em",
                    fontSize: "large",
                    color: "none"
                    }}>
                <Header
                    as="h1"
                    content="Certify.doc: social authority on the blockchain" 
                    style={{
                    fontWeight: "normal",
                    marginBottom: 0,
                    color: "white"
                    }}
                />
                <Header
                    as="h2"
                    style={{
                    fontWeight: "normal",
                    Height: "100px",
                    overflowY: "scroll",
                    marginTop: "1.5em",
                    color: "white"
                    }}
                > 
                    Certify.doc provides a single utility: It issues a record on the ethereum blockchain that relates two addresses (an issuer and recipient) to an offline document. 
                    These records are immutable, non-tradable and revokable. They are similar to non-fungible tokens (NFTs) but have a a few important differences.
                    <br/>
                    <br/>
                    Certificates of authenticity
                    <li> cannot be traded or exchanged. They can only revoked.</li>
                    <li> are accessed by uploading the original document.</li>
                    <br/>
                    It means that
                    <li> a person or organisation can issue a certificate to vouch for the authenticity of a document and credibility of another person or organisation.</li>
                    <li> certificates are readily accesible to those that are not familiar with blockchain technology.</li>
                    <br/>
                    Certificates can be used by 
                    <li> Educators to certify the authenticity of their degrees.</li> 
                    <li> Employers to certify authenticy of employers statements.</li> 
                    <li> Individuals to authenticate wills and estates. </li> 
                    <br/>
                    In brief, certify.doc relates the social authority behind an ethereum address to a digital document, 
                    and expresses a relationship between two social actors.
                    <br/>
                    <br/>
                    {/* Still need to include links here. */}
                    Check out the github repository for the react frontend and solidity backend.  
                    </Header>
                </Segment>
            </Container>
        )
    }
}

export default AboutPage