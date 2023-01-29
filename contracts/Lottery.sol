// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
    특정시간대에 자동뽑기 기능 구현하기
    랜덤 알고리즘 더 예측불가능하게 하기, 그 전에 그 이유를 정확히 알기
    메인넷에 배포하기 => 배포해도 법적 문제 없는지? 
 */
contract Lottery {
  address[] public players;
  address private manager;
  address payable public winner;

  constructor() {
    manager = msg.sender;
  }

  function enter() public payable {
    uint256 minEther = 0.0001 ether;
    require(msg.value >= minEther, "more ether is required to enter.");
    players.push(msg.sender);
  }

  function random() public view returns (uint256) {
    return
      uint256(
        keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))
      );
  }

  function pickWinnerAndTransferMoney() public {
    winner = payable(players[random() % players.length]);
    winner.transfer(address(this).balance);
    players = new address[](0);
    winner = payable(address(0));
  }
}
