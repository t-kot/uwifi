pragma solidity ^0.4.23;

import { SafeMath } from "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract UWifiCore {
  using SafeMath for uint256;

  // For now, supposing ticket has only expiration metadata.
  // it may be good to have a bandwidth
  // (But it's difficult to realize how to record bandwidth usage onchain because of tx fee)
  struct Ticket {
    uint expiration;
  }

  // For now, supposing user has 1 ticket.
  // We think it's good for user to have a variable tickets in future.
  mapping(address => Ticket) public tickets;

  /*
    buyTicket by ETH.
    But I thinks it should be done by stable coin (DAI) or stable utility coin.
    need more consideration.
  */
  function buyTicket() public payable {
    if (ticketUsable()) {
      extendTicket();
    } else {
      issueTicket();
    }
  }

  function issueTicket() internal {
    uint256 currentTime = block.timestamp;
    uint256 expiration = currentTime.add(ticketRate(msg.value));
    tickets[msg.sender].expiration = expiration;
  }

  function extendTicket() internal {
    uint256 currentExpiration = tickets[msg.sender].expiration;
    uint256 expiration = currentExpiration.add(ticketRate(msg.value));
    tickets[msg.sender].expiration = expiration;
  }

  function ticketUsable() public view returns (bool) {
    return tickets[msg.sender].expiration > block.timestamp;
  }

  function remainingTime() public view returns (uint256) {
    if (ticketUsable()) {
      return tickets[msg.sender].expiration.sub(block.timestamp);
    } else {
      return 0;
    }
  }

  /*
  @dev Returns how long sec user get for paying ETH
  @param value the amount of ETH user pay
  */
  function ticketRate(uint256 value) internal pure returns (uint256) {
    // For now, 0.01 ETH = 1 day.
    uint a = 10 finney;
    uint day = 1 days;
    uint weiPerSec = a.div(day);
    return value.div(weiPerSec);
  }

  /*
  @dev for debug only
  */
  function clearMyTicket() public {
    tickets[msg.sender].expiration = 0;
  }
}
