
pragma solidity ^0.4.15;
// contract for class attendees Registry
contract Registry {

    address[] public accounts;
    mapping(address => string) public class;

    function Registry() public { }

    function addTutor(string name) public {
        class[msg.sender] = name;
        accounts.push(msg.sender);
    }

    function getTutor(address adr) public constant returns (string) {
       return class[adr];
    }

    function whoAmI() public constant returns (string) {
       return class[msg.sender];
    }

    // Retrieving the adopters
  	function getTutorsAccounts() public returns (address[]) {
  	  return accounts;
  	}
}
