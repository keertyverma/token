import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";

actor Token {
    let owner : Principal = Principal.fromText("f4ms3-vhmcb-hhldt-hv5zr-s7ml4-ot5jc-edrpe-5nxjb-a7gio-d2f6a-jqe");
    let totalSupply : Nat =  1000000000;
    let symbol : Text = "DKEE";

    private stable var balanceEntries : [(Principal, Nat)] = [];

    // HashMap stores key = user prinicipal ID and value = total amount of token
    private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);

    // Run on initialization
    if(balances.size() < 1){
        balances.put(owner, totalSupply);
    };
    
    public query func balanceOf(who : Principal) : async Nat{
        
        let balance : Nat = switch(balances.get(who)) {
            case null 0;
            case (?result) result;
        };
        return balance;
    };

    public query func getSymbol() : async Text {
        return symbol;
    };

    public shared(msg) func payOut() : async Text {
        Debug.print(debug_show(msg.caller));

        if(balances.get(msg.caller) == null) {
            let amount : Nat = 10000;
            let result = await transfer(msg.caller, amount);
            return result;
        } else {
            return "Already Claimed";
        }
    };

    public shared(msg) func transfer(to : Principal, amount : Nat) : async Text {
        // get available balance of current user who is transfer amount
        let fromBalance = await balanceOf(msg.caller);
        
        // check if from account has sufficient balance to transfer
        if (fromBalance >= amount){
            // Substract amount from from_account
            let newFromBalance : Nat = fromBalance - amount;
            balances.put(msg.caller, newFromBalance);

            // Add amount to to_account
            let toBalance = await balanceOf(to);
            let newToBalance = toBalance + amount;
            balances.put(to, newToBalance);

            return "Success";
        } else {
            return "Insufficient Fund.";
        }
    };

    system func preupgrade() {
        // transfer data from non-stable hashmap to stable array data type
        // Hashmap -> Iter -> toArray
        balanceEntries := Iter.toArray(balances.entries());
    };

    system func postupgrade() {
        // transfer data from stable array to non-stable hashmap
        // Array -> Iter -> HashMap
        balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash);

        if(balances.size() < 1){
            balances.put(owner, totalSupply);
        }
    };
}