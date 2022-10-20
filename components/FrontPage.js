import { Component, useContext } from "react";
import { UserContext } from "./userContext";
import { Container, Header, Button, Segment, Grid } from "semantic-ui-react"; 

const FrontPage = () => {
    
    const { tab, setTab } = useContext(UserContext);

    if (tab == 'Home' ||
        tab == 'About') { 

    return (
        <Container>
            <Grid padded>
              <Grid.Column width = '8' > 
              <Container className="userInputBox"  >
        <Segment basic textAlign = 'right' style={{
            marginBottom: '3em',
            marginTop: '.5em',
            fontSize: 'large',
            color: "none"
            }}>
        <Header
            as='h1'
            content='Certify.doc' 
            style={{
            fontSize: '4em',
            fontWeight: 'normal',
            marginBottom: 0,
            color: "white"
            }}
        />
        <Header
            as='h2'
            content='Providing immutable certifications 
            of documents’ authenticity. 
            Built on the Ethereum blockchain.'
            style={{
            fontSize: '1.7em',
            fontWeight: 'normal',
            marginTop: '1.5em',
            color: "white"
            }}
        />
            <Button primary 
            size='huge' 
            onClick={() => setTab('DocHash_Certs')}
            style={{ 
                marginTop: '3rem'
                }}>
            Check Authenticity
            </Button>
            </Segment>
        </Container>
    </Grid.Column> 
    <Grid.Column width = '8'> 
        { tab == 'Home' ?
            <></>
        : 
            <Container className="userInputBox"  >
                <Segment basic textAlign = 'left' style={{
                    marginBottom: '3em',
                    marginTop: '2em',
                    fontSize: 'large',
                    color: "none"
                    }}>
                <Header
                    as='h1'
                    content='social authority on the blockchain' 
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
                    Possible use cases: 
                    <li> Educators certifing the authenticity of their degrees.</li> 
                    <li> Employers certifing declaratons of work experience.</li> 
                    <li> Individuals certifing their wills and estates. </li> 
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
            }
            </Grid.Column> 
            </Grid>
        </Container>
        )    
    }
}

export default FrontPage