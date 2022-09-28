import React, { useContext, useState } from "react";
import { UserContext, Web3ModalContext } from "./userContext";
import { Button, Icon, Menu } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';


export function NavBar() {

    const { tab, setTab } = useContext(UserContext);
    const { walletConnected, getCertificate } = useContext(Web3ModalContext);

    const renderButton = () => {
        // If wallet is not connected, return a button which allows them to connect their wllet
        if (!walletConnected) {
          return (
            <Button  primary onClick={() => getCertificate()} > 
            Connect Wallet
            </Button>
          );
        }
    
        // If we are currently waiting for something, return a loading button
        if (loading) {
          return <button className={styles.button}>Loading...</button>;
        }
    
        // If connected user is the owner, and presale hasnt started yet, allow them to start the presale
        if (isOwner && !presaleStarted) {
          return (
            <button className={styles.button} onClick={startPresale}>
              Start Presale!
            </button>
          );
        }
    
        // If connected user is not the owner but presale hasn't started yet, tell them that
        if (!presaleStarted) {
          return (
            <div>
              <div className={styles.description}>Presale hasnt started!</div>
            </div>
          );
        }

    return (
        <Menu tabular attached='top' size = 'large' stackable >
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
                <Button  primary onClick={() => getCertificate()} > 
                    Connect Wallet
                </Button>
            </Menu.Item>
        </Menu>
    ); // // positive = { connected }
};

