import React, { useContext, useEffect, useState } from "react";
import { UserContext, Web3ModalContext } from "./userContext";
import { Button, Icon, Menu } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';


export function NavBar() {

    const { tab, setTab } = useContext(UserContext);
    const { walletConnected, setRequestConnect, checkDocHash } = useContext(Web3ModalContext);

    const renderButton = () => {

        let click = false 

        // If wallet is not connected, return a button which allows them to connect their wllet
        if (!walletConnected) {

          return (
            <div> 
            <Button  primary onClick={() => setRequestConnect(true)} > 
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
        <Menu fixed='top' stackable >
            <Menu.Item 
                name='Home'
                active={tab === 'Home'}
                onClick={() => setTab('Home')}
            />
            <Menu.Item 
                name='Check Document'
                active={tab === 'Check Document'}
                onClick={() => setTab('DocHash_Certs')}
            />

            <Menu.Item 
                name='Issued Certificates'
                active={tab === 'Issued Certificates'}
                onClick={() => setTab('Issued_Certs')}
            />
            <Menu.Item 
                name='Received Certificates'
                active={tab === 'Received Certificates'}
                onClick={() => setTab('Received_Certs')}
            />
            <Menu.Item 
                position = 'right'
                name='Certify Document'
                active={tab === 'Certify Document'}
                onClick={() => setTab('Certify')} >
            </Menu.Item> 
            <Menu.Item >
                { renderButton() }
            </Menu.Item>
        </Menu>
    ); // // positive = { connected }
};

