// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Lottery {
  address[] public players;
  address public manager;
  address payable public winner;

  constructor() {
    manager = msg.sender;
  }

  function enter() public payable {
    uint256 minEther = 0.0001 ether;
    require(msg.value >= minEther, "more ether is required to enter.");
    players.push(msg.sender);
  }

  function random() private view returns (uint256) {
    return
      uint256(
        keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))
      );
  }

  function getPlayers() public view returns (uint256) {
    return players.length;
  }

  function pickWinnerAndTransferMoney() public {
    winner = payable(players[random() % players.length]);
    winner.transfer(address(this).balance);
    players = new address[](0);
    winner = payable(address(0));
  }
}
