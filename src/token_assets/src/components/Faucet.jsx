import React, { useState } from "react";
import { token, canisterId, createActor } from "../../../declarations/token";
// import { AuthClient } from "@dfinity/auth-client";

function Faucet() {

  const [isDisabled, setDisabled] = useState(false);
  const [buttonText, setText] = useState("Gimme gimme");

  async function handleClick(event) {
    setDisabled(true)

    //// Below code will give - 403 Forbidden Error on console because 
    //// inorder to have the sign-off and to get the authenticated session, 
    //// we need to deploy our project live on the ICP blockchain
    
    // const authClient = await AuthClient.create();
    // const identity = await authClient.getIdentity();

    // const authenticatedCanister = createActor(canisterId, {
    //   agentOptions: {
    //     identity
    //   },
    // });

    // const result = await authenticatedCanister.payOut();
    const result = await token.payOut();
    setText(result);
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free DKeerty tokens here! Claim 10,000 DKEE tokens to your account.</label>
      <p className="trade-buttons">
        <button 
        id="btn-payout" 
        disabled={isDisabled}
        onClick={handleClick}>
          {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
