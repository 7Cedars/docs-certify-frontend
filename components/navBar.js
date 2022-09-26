import React, { useContext, useState } from "react";
import { UserContext } from "./userContext";
import { Container, Header, Button, Icon, Menu } from "semantic-ui-react"; 
import 'semantic-ui-css/semantic.min.css';


export function NavBar() {

    const {tab, setTab} = useContext(UserContext);

    return (
        <Container>
            <Menu fixed='top' size = 'large'> 
            <Menu.Item fitted position="left">
                <a 
                    onClick={() => setTab('Home') } 
                    className="item">Icon
                </a>
                <a 
                    onClick={() => setTab('About') } 
                    className="item">About
                </a>
            </Menu.Item>

            <Menu.Item fitted >
                <a 
                    onClick={() => setTab('Check Document') } 
                    className="item">Check Document
                </a>
                <a 
                    onClick={() => setTab('Certify Document') } 
                    className="item">Certify Document
                </a>
                <a 
                    onClick={() => setTab('Certifications Issued') } 
                    className="item">Certifications Issued
                </a>
                <a 
                    onClick={() => setTab('Certifications Received') } 
                    className="item">Certifications Received
                </a>
            </Menu.Item>

            {/* <Menu.Item fitted position="right">
                {
                !WalletConnected ? (
                        <Button primary onClick={connectWallet}> 
                        Connect Wallet
                        </Button>
                    ) : (
                        <Button primary > 
                        Wallet connected
                        </Button>
                    )
                }
            </Menu.Item> */}

            </Menu>
        </Container>
    );
}; 

