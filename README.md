This is the **frontend** of a simple dapp project: certify.doc. The github repository for the backend can be found [here](https://github.com/7Cedars/docs-certify-backend.git).

The dapp provides a single utility. It issues records on the blockchain that relate two ethereum addresses (an issuer and recipient address) to the hash of a digital offline document. 
They are somewhat similar to non-fungible tokens (NFTs).

But in contrast to NFTs 
- These records cannot be traded or exchanged. They can only revoked. 
- These records can be easily accessed by uploading the original document. 

Because these records immutable, non-tradable and revokable, they can be used by one party (the issuer) to vouch for the authenticity of the document and, at the same time, the credibility of a second party (the recipient). 

Because these records are related to an offline document that can be send via email, social media or any other traditional method, it is extremely accesible to those that are not familiar with blockchain technology. 

## Getting Started
To view and use the deployed dapp, please visit its deployed instance on vercel: [http://localhost:3000](http://localhost:3000). Please note that the dapp only runs on the Goerli Ethereum test network. 

To run the app locally, clone the files, install all dependencies and run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Notes on Development
This dapp is under active development and does not come with any guarantees what so ever. It can - and will - break at any time. 

I used this app as an educational project while learning solidity and javascript (react/next).

## To Dos 
### Current Dapp (v0.1) 
- Improve error messaging to users. 
- Improve interaction with alchemy APIs. 
- Implement recognition of ENS addresses. 
- Implement preview for images and (possibly) PDFs.   
- Implement reading of Eth contract emitted event. 
- Implement reading of owner of document. 
- Fixing bugs. Many bugs. 

### Future Dapp (v0.2) 
- Implement optional upload of files to IPFS. 
- The contract will be upgradable, the frontend should adapt accordingly. 
- Possibly integrate the Graph into dapp and frontend. 
