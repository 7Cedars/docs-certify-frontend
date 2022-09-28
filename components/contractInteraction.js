import { Web3ModalContext } from "../components/userContext";
import { Contract, providers, utils } from "ethers";
import { useContext } from "react";
import { CONTRACT_ADDRESS, abi } from "../constants";


//https://www.youtube.com/watch?v=vYWMyOyrbYU -- usecontext and web3 react. 
// -- this is actually a good explenation of using useContext with web3! 