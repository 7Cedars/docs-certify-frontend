/* 
This components creates the Navbar on top of the app. 
It also handles selection of tabs and calls the wallet connect function. 
*/ 

import React, { useContext } from "react";
import { UserContext } from "./userContext";
import { Button, Grid, Icon, Menu, Segment } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';

// creates the Navbar at the top of the page. 
const NavBar = () => { 
    //  { getSigner }

    // navbar interacts with three contextual elements: tab and settab (reading and setting selected tab) 
    // and walletAddress: logging in with a wallet. 
    const { tab, setTab, walletAddress } = useContext(UserContext);

    // The login button changes appearance with user being logged in or not.
    // Login is assessed by (non)existance of const walletAddress. 
    const renderButton = () => {

        // If wallet is not connected, return a button which allows them to connect their wllet
        if (!walletAddress) {

          return (
            <div>
            <Button  primary > 
             {/* onClick={ getSigner } >  */}
                Connect (Currently in Read Only Mode)
            </Button>
            </div>
          );
        }
    
        // If wallet is  connected, return a green button that states wallet connected. 
        // Button does ntot have any functionality at the moment. 
        if (walletAddress) {

            return (
            <div> 
              <Button  positive > 
                Connected to: {walletAddress.substring(0,5)}...{walletAddress.substring(38,42)}  
                {/* .substring(0,5) */}
              </Button>
              </div>
            );
          }
        }

    // Renders the navbar. 
    // per item, if clicked, setTab is set to the name of the tab. 
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
                 {/* rendering the login button created above */}
                <Menu.Item >
                    { renderButton() }
                </Menu.Item>   
            </Menu>
    );
};

export default NavBar
