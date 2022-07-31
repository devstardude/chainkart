import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { useCall, useContractFunction, useEthers } from "@usedapp/core";
// import { Web3Storage, getFilesFromPath, File } from "web3.storage";
import { Web3Storage,File } from 'web3.storage/dist/bundle.esm.min.js'
import FormContainer from "../components/FormContainer";
import { saveShippingAddress } from "../store/actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";
import WalletButton from "../components/connectButtons/walletButton";

function getAccessToken() {
  return process.env.WEB3STORAGE_TOKEN; //env me storage token daaldio
}
function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

//==============================================================================
function makeFileObject() {//yahan variables lene hen

  const obj = { hello: "world" }; // isme data daalna he
  const buffer = Buffer.from(JSON.stringify(obj));

  const files = [
    new File(["contents-of-file-1"], "plain-utf8.txt"),
    new File([buffer], "metadata.json"),
  ];
  return files;
}
//============================================================================

async function storeFiles (files) {
  const client = makeStorageClient()
  const cid = await client.put(files)
  console.log('stored files with cid:', cid)
  return cid;
}
const ShippingScreen = ({ history }) => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);
  const [walletAddress, setWalletAddress] = useState("0x123");

  //========================================================================================
  // Yahan pe props daalna he, app.js me se contract ko as prop pass krdio

  // const {state, send} = useContractFunction(props.contract, 'mintNFT');
  // const {status} = state;
  // const uploadNft = async (recipientAddress,warrantyPeriod,TokenUri)=>{
  //   await send(recipientAddress,warrantyPeriod,TokenUri);
  // }
//=================================================================================================
  const submitHandler = (e) => {
    e.preventDefault();
    if (walletAddress === "Click here to Connect wallet") {
      alert("Please connect wallet");
    } else {
      dispatch(
        saveShippingAddress({
          address,
          city,
          postalCode,
          country,
          walletAddress,
        })

      );
      history.push("/payment");
      //===========================================================================
      const file = makeFileObject(); //isme variales pass krne hen ,jese , user addresss, imgae link, aur warranty related data
      storeFiles(file).then((id) => {
        console.log("uploading to chain...");
        const tokenUri = "ipfs://" + id + "metadata.json";
//===============================================================================        
        // uploadNft(
        //   recipientAddress,
        //   warrantyPeriod,// in uni time
        //   tokenUri, // create from cid
        // ); // ye token id return krega
        // console.log("uploaded");
      });
      //==========================================================================
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="postalCode">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter postal code"
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* USER CONNECT WALLET BUTTON */}
        <WalletButton />

        <Form.Group controlId="wallet">
          <Form.Label>Wallet Address</Form.Label>
          <Form.Control
            style={{ cursor: "pointer" }}
            type="text"
            placeholder="Connect wallet"
            required
            value={walletAddress}
            onClick={() => {
              alert("wallet button clicked");
            }}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
