import React, {useState} from "react";

import { Principal } from "@dfinity/principal";
import { token } from "../../../declarations/token";

function Balance() {
  
  const [inputValue, setInputValue] = useState("");
  const [balanceResult, setBalance] = useState("");
  const [cryptosymbol, setSymbol] = useState("");
  const [isHidden, setHidden] = useState(true);

  async function handleClick() {
    const principal = Principal.fromText(inputValue);

    // get token amount
    const balance = await token.balanceOf(principal);

    setBalance(balance.toLocaleString());

    // get token symbol
    const symbol = await token.getSymbol();
    setSymbol(symbol);

    setHidden(false);
  }


  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      <p hidden={isHidden}>This account has a balance of {balanceResult} {cryptosymbol}.</p>
    </div>
  );
}

export default Balance;
