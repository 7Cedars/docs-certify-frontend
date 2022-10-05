import React, { useContext, useEffect, useState } from "react";
import { UserContext, Web3ModalContext } from "./userContext";
import { Button, Grid, Container, Icon, Menu } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';


export function NavBar() {

    const { tab, setTab } = useContext(UserContext);
    const { walletConnected, connectWallet } = useContext(Web3ModalContext);

    const renderButton = () => {

        let click = false 

        // If wallet is not connected, return a button which allows them to connect their wllet
        if (!walletConnected) {

          return (
            <div> 
            <Button  primary onClick={() => connectWallet() } > 
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
                <Grid container columns= {1} fluid >
                        <Grid.Row centered>
                        <Menu secondary>
                            <Menu.Item 
                                name='Check Document'
                                active={tab === 'DocHash_Certs'}
                                onClick={() => setTab('DocHash_Certs')}
                            />

                            <Menu.Item 
                                name='Issued Certificates'
                                active={tab === 'Issued_Certs'}
                                onClick={() => setTab('Issued_Certs')}
                            />
                            <Menu.Item 
                                name='Received Certificates'
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
    ); // // positive = { connected }
};

