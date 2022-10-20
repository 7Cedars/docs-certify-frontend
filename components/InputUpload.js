// import statements here... 
import { Container, Header, Button, Icon, Segment, Form, Grid, Input, Image } from "semantic-ui-react"; 
import { UserContext} from "./userContext";
import { useContext } from "react";
import React from "react";
import { utils } from "ethers"; 

let recipientInput = '0x0000000000000000000000000000000000000000'; 
let descriptionInput = ' '; 

const InputUpload = ({ certify }) => {

    const { tab, walletConnected, loading, userInput, setUserInput } = useContext( UserContext );

    const changeHandler = async (e) => {
        let fileInput = e.target.files[0]; 
        let fileReader = false;

        fileReader = new FileReader();
        fileReader.readAsDataURL(fileInput);
        fileReader.onload = function () {
        let result = fileReader.result; 
        // NB: Here the hashing is done! // 
        setUserInput(utils.keccak256( utils.toUtf8Bytes( result ))); // 0x12, 0x34sha256 // sha256(result).toString()
        }
    }

    const onSubmit = async (e) => {    
        certify([userInput, recipientInput, descriptionInput])
      };

    if (tab == 'Certify') {
            
        return (
            <Container textAlign = 'center' >
                { !walletConnected ?
                <Segment color = 'red' 
                    style = {{
                        marginTop: '5em',
                        fontSize: 'large', 
                     }}>
                    <Header as='h3' 
                        style = {{ 
                        color: "black",
                        marginBottom: '.5em', }}> 
                    Please connect your Ethereum wallet to this website.
                    </Header>
                    Documents can only be certified while being logged in with an Ethereum wallet.
                </Segment >
                 :
                <Segment style = {{
                    marginTop: '6.5em',
                    fontSize: 'large', 
                    opacity: '0%'
                 }}>
                    ...
                </Segment> 
                }
              <Grid padded>
                <Grid.Column width = '8' > 
                    <Container className="userInputBox"> 
                        <Segment placeholder 
                                textAlign = 'center' 
                                disabled = { !walletConnected } 
                                style={{ 
                                    marginBottom: '0em',
                                    fontSize: 'large'
                                }}>
                            <Container >
                            <Icon name='file image outline' size = 'huge' style={{
                                marginTop: '.5em'
                                }}>
                            </Icon>
                            <Form >
                                <Input
                                    disabled = { !walletConnected }
                                    type="file"                 
                                    single="true"
                                    onChange={ changeHandler }
                                />
                            </Form>
                            </Container>
                            <Container style={{
                                marginTop: '1.5em'
                                }}>
                            The document will not leave your computer. 
                            You browser will create a unique document identifier that is uploaded to the Ethereum blockchain.
                            </Container>
                        </Segment>
                    </Container>
                </Grid.Column> 
                <Grid.Column width = '8'> 
                    <Container className="userInputBox"> 
                        <Segment textAlign = 'left' 
                                disabled = { !walletConnected } 
                                style={{  
                                fontSize: 'large'
                            }}>
                            <Form onSubmit = { onSubmit } 
                                    style={{ fontSize: 'large' }}>
                                <Header as='h3' style = {{ color: "black" }}> Unique Document Hash </Header>
                                { userInput ? 
                                    <Segment color='green' style={{fontSize: 'large', overflowWrap: 'break-word' }} > 
                                    { userInput } 
                                    </Segment>
                                    :
                                    <Segment color='red' style={{fontSize: 'large'}} > 
                                    Please choose a document to certify. 
                                    </Segment>
                                }                 
                                <Form.Field  style={{ marginTop: '2em' }}>
                                <label style={{ color: "black" }} >Recipient Address </label>
                                <input 
                                    disabled = { !walletConnected }
                                    type='text'
                                    placeholder='0x00... (optional) ' 
                                    onChange= { (e) => recipientInput = e.target.value }
                                    />
                                </Form.Field>
                                <Form.Field style={{ marginTop: '2em' }}>
                                <label style={{ color: "black" }}>Description</label>
                                <input 
                                    disabled = { !walletConnected }
                                    type='text'
                                    placeholder='Brief description of document. (optional)' 
                                    onChange= { (e) => descriptionInput = e.target.value }
                                    />
                                </Form.Field>
                                <Form.Field  style={{ marginTop: '2em' }}>
                                    <Button fluid primary type='submit'
                                            loading = { loading != null } 
                                            disabled = { !userInput } 
                                            style={{     
                                            fontSize: 'large'
                                            }}> 
                                        Upload certificate to the ethereum blockchain
                                    </Button>
                                </Form.Field>
                                </Form>
                            </Segment>
                        </Container>
                    </Grid.Column> 
                </Grid>
                    <Form >
                        
                    </Form>
            </Container>         
        )
    }
  }

export default InputUpload