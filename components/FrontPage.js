import { useContext } from "react";
import { UserContext } from "./userContext";
import { Container, Header, Button, Icon, Segment, Form, Input, Grid, StepTitle, Popup, Card, Image } from "semantic-ui-react"; 

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
            marginTop: '5em',
            fontSize: 'large',
            color: "none"
            }}>
        <Header
            as='h1'
            content='Certify.xyz' 
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
                    marginTop: '6.5em',
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
                    marginTop: '1.5em',
                    color: "white"
                    }}
                > 
                    Certify.xyz provides certifications that are immutable, non-tradable and revokable. 
                    They are easy to issue, check and revoke. 
                    <br/>
                    <br/>
                    All of this, built on the Ethereum blockchain. 
                    <br/>
                    <br/>
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