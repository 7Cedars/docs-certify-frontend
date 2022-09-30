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
            <Button  primary onClick={() => checkDocHash('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')} > 
            test
            </Button>
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
                <Button  primary onClick={() => checkDocHash('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')} > 
                test
                </Button>
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
                name='About'
                active={tab === 'About'}
                onClick={() => setTab('About')}
            />
            <Menu.Item 
                name='Check Document'
                active={tab === 'Check Document'}
                onClick={() => setTab('Check Document')}
            />
            <Menu.Item 
                name='Certify Document'
                active={tab === 'Certify Document'}
                onClick={() => setTab('Certify Document')}
            />
            <Menu.Item 
                name='Certifications Issued'
                active={tab === 'Certifications Issued'}
                onClick={() => setTab('Certifications Issued')}
            />
            <Menu.Item 
                name='Certifications Received'
                active={tab === 'Certifications Received'}
                onClick={() => setTab('Certifications Received')}
            />
            <Menu.Item position = 'right'>
                { renderButton() }
            </Menu.Item>
        </Menu>
    ); // // positive = { connected }
};

