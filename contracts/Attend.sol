/* Smart Contract for logging stundent attendace and sending 10 BCT award */
pragma solidity ^0.4.15;
import "./HumanStandardToken.sol";

contract Attend {

    bool public class_on; // On / Off the attendace control process
    mapping (bytes32 => uint) rewards; // auth codes hashes => amounts BCT to send
    bytes32[] activeCodes;
    address owner;
    HumanStandardToken tokenContract;

    modifier duringClass {
        require(class_on);
        _;
    }

    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }

    function Attend() { owner = msg.sender; }

    function setTokenContract(address _address) onlyOwner
    {
        tokenContract = HumanStandardToken(_address);
    }

    // add codes for authentication
    function addCodes(bytes32[] hashes, uint[] amounts) onlyOwner
    {
        require(hashes.length == amounts.length);
        for(uint i = 0; i < hashes.length; i++) {
            addCode(hashes[i], amounts[i]);
        }
    }

    function addCode(bytes32 hashCode, uint amount) private onlyOwner {
        rewards[hashCode] = amount;
        activeCodes.push(hashCode);
    }

    function deleteCode(bytes32 codeHash) private
    {
        rewards[codeHash] = 0;
    }

    function submit(uint code) duringClass
    {
        bytes32 codeHash = keccak256(code);
        uint amount = rewards[codeHash];
        if (amount != 0) {
            // make reward payout
            tokenContract.transfer(msg.sender, amount);
            deleteCode(codeHash);
        }
    }

    function setState(bool state) onlyOwner
    {
        if (class_on && !state) removeUnusedCodes();
        class_on = state;
    }

    function removeUnusedCodes() private {
        for (uint i = 0; i < activeCodes.length; ++i) {
            delete rewards[activeCodes[i]];
        }
        activeCodes.length = 0;
    }

    function withdraw() onlyOwner {
        uint remaining = tokenContract.balanceOf(this);
        tokenContract.transfer(owner, remaining);
    }
}
