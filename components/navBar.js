import React, { useContext } from "react";
import { UserContext } from "./userContext";
import { Button, Grid, Icon, Menu } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';


export function NavBar( { walletConnected, setRequestConnect } ) {

    const { tab, setTab } = useContext(UserContext);

    const renderButton = () => {

        // If wallet is not connected, return a button which allows them to connect their wllet
        if (!walletConnected) {

          return (
            <div> 
            <Button  primary onClick={() => setRequestConnect(true) } > 
                Connect Wallet
            </Button>
            </div>
          );
        }
    
        // If wallet is  connected, return a green button that states wallet connected. 
        // Button does ntot have any functionality at the moment. 
        if (walletConnected) {
            return (
            <div> 
              <Button  positive > 
                Wallet Connected
              </Button>
              </div>
            );
          }
        }

    return (        
            <Menu fixed='top'  >
                <Menu.Item 
                    name='Home'
                    active={tab === 'Home'}
                    onClick={() => setTab('Home')}
                >
                    <Icon name='checkmark' size = 'large'/>
                </Menu.Item>  
                <Menu.Item 
                    name='About'
                    active={tab === 'About'}
                    onClick={() => setTab('About')}
                />
                <Grid container columns= {1} >
                        <Grid.Row centered>
                        <Menu secondary>
                            <Menu.Item 
                                name='Check Document'
                                active={tab === 'DocHash_Certs'}
                                onClick={() => setTab('DocHash_Certs')}
                            />

                            <Menu.Item 
                                name='Check Certificates Issued'
                                active={tab === 'Issued_Certs'}
                                onClick={() => setTab('Issued_Certs')}
                            />
                            <Menu.Item 
                                name='Check Certificates Received'
                                active={tab === 'Received_Certs'}
                                onClick={() => setTab('Received_Certs')}
                            />
                            <Menu.Item 
                                name='Certify Document'
                                active={tab === 'Certify'}
                                onClick={() => setTab('Certify')} >
                            </Menu.Item> 
                        </Menu>
                    </Grid.Row>
                </Grid>
                <Menu.Item >
                    { renderButton() }
                </Menu.Item>   
            </Menu>
    );
};

export default NavBar
