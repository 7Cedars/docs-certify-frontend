import React, { useContext } from "react";
import { UserContext } from "./userContext";
import { Container, Button, Icon, Segment, Form, Input } from "semantic-ui-react"; 
import { utils } from "ethers"; 

let fileInput; 

const CheckCertificates = ({ handleSubmit }) => {

  const { setUserInput, tab, userInput, loading } = useContext(UserContext);

  const changeHandler = async (e) => {

    fileInput = e.target.files[0]; 
    let fileReader = false;
    let result; 
  
    fileReader = new FileReader();
    fileReader.readAsDataURL(fileInput);
    fileReader.onload = function () {
    result = fileReader.result; 
    // NB: Here the hashing is done! // 
    setUserInput(utils.keccak256( utils.toUtf8Bytes(result) )); // 0x12, 0x34sha256 // sha256(result).toString()
    // console.log(utils.keccak256( utils.toUtf8Bytes(result))) 
    }
  }

    if (tab == 'Issued_Certs' || 
        tab == 'Received_Certs') {

        return (
            <Container className="userInputBox">
                <Segment placeholder textAlign = 'center' style={{
                    marginBottom: '5em',
                    marginTop: '.5em',
                    fontSize: 'large'
                    }}>
                        <Container >
                        <Icon name='user outline' size = 'huge' style={{
                            marginTop: '.5em', marginBottom: '.5em' 
                            }}>
                        </Icon>
                        <Form onSubmit = { handleSubmit }>
                            <Form.Input 
                            label=
                                {tab == 'Issued_Certs' ? 
                                'Check issued certificates by address' : 
                                'Check received certificates by address'                    
                                }
                            control={ Input }
                            placeholder='Ethereum adress: 0x00...' 
                            onChange = {(e) => setUserInput(e.target.value)} 
                            >
                            </Form.Input>
                        <Button primary loading = { loading == 'loading' }
                            style={{
                            marginBottom: '2em',
                            marginTop: '1em',
                            textAlign: 'center',
                            fontSize: 'large',
                            }}>
                            Check Address
                        </Button>  
                        </Form>                
                        </Container>

                    </Segment>
            </Container>       
        ) 
    }

    if (tab == 'DocHash_Certs') {

        return (
          <Container className="userInputBox">
          <Segment placeholder textAlign = 'center' style={{
              marginBottom: '5em',
              marginTop: '.5em',
              fontSize: 'large'
              }}> 
                  <Container >
                    <Icon name='file image outline' size = 'huge' style={{
                      marginTop: '.5em', marginBottom: '0em' 
                      }}>
                    </Icon>
                    <Form onSubmit = { handleSubmit } > 
                        <input
                          type="file"                    
                          single="true"
                          onChange={ changeHandler }
                        />
                      <Button primary loading = { loading == 'loading'  }
                          style={{
                          marginBottom: '2em',
                          marginTop: '1em',
                          textAlign: 'center',
                          fontSize: 'large',
                          marginTop: '2em',
                          }}>
                          Check Document
                      </Button>  
                    </Form>
                    The document will not leave your computer. 
                    You browser will create a unique document identifier that is uploaded to the Ethereum blockchain.
                </Container>
          </Segment>
        </Container> 
        ) 
      }
}

export default CheckCertificates