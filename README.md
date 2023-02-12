## 컨트렉트
1. truffle compile
2. truffle migrate

## Front
1. npm run start

## TODOs
    특정시간대에 자동뽑기 기능 구현하기
    랜덤 알고리즘 더 예측불가능하게 하기, 그 전에 그 이유를 정확히 알기
    메인넷에 배포하기 => 배포해도 법적 문제 없는지? 

## 배운 것
- GAS 소비량 줄이는 법: https://techblog.geekyants.com/how-to-save-gas-when-writing-your-smart-contract-in-solidity
  - 사용량이 많아질 수록 gas 소비량이 는다.
- contract props가 되지 않으면 컨트랙트에서 읽을수 없음
- payable: https://caileb.tistory.com/147
- .sol파일에는 영어만 작성하기 한글주석 작성시 JSON.parse에러발생
- truffle migrate 만해도 compile까지 됨