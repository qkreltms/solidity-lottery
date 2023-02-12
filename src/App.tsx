import { useEffect, useState } from "react";
import "src/styles/index.scss";
import Web3 from "web3";

/**
 * 복권 구입, 매니저 버튼, 당첨자 뽑기 버튼
 * 일정 주기로 자동 당첨자 뽑기 기능 (백엔드 서버에서 해야될까?)
 * 테스트 케이스 작성
 * 프론트 스타일링
 * 리팩토링
 */
interface TypeWeb3Data {
  artifact: any;
  web3: any;
  accounts: any[];
  networkId: number | null;
  contract: any;
  manager: any;
  players: number;
  winner: any;
  prize: number;
}
const App = () => {
  const [web3Data, setWeb3Data] = useState<TypeWeb3Data>({
    artifact: null,
    web3: null,
    accounts: [],
    networkId: null,
    contract: null,
    manager: null,
    players: 0,
    winner: null,
    prize: 0,
  });
  const [transactionHash, setTransactionHash] = useState<string[]>([]);
  const isManager = Boolean(web3Data.manager);

  useEffect(() => {
    const init = async () => {
      try {
        const artifact = await import("./contracts/Lottery.json");
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:9545");
        const networkId = await web3.eth.net.getId();
        const accounts = await web3.eth.requestAccounts();
        const { abi } = artifact;
        const { address } = artifact.networks
          ? (artifact.networks as any)[networkId]
          : { address: undefined };
        const contract = new web3.eth.Contract(abi as any, address);
        const balance = await web3.eth.getBalance(contract.options.address);
        setWeb3Data({
          artifact,
          web3,
          accounts,
          networkId,
          contract,
          manager: (await contract.methods.manager().call()) || "",
          players: (await contract.methods.getPlayers().call()) || 0,
          winner: (await contract.methods.winner().call()) || "",
          prize: Number(web3.utils.fromWei(balance, "ether")) || 0,
        });
      } catch (error) {
        console.error(error);
      }
    };

    init();

    // 지갑 연동될시 발동
    const events = ["chainChanged", "accountsChanged"];
    const { ethereum } = window as any;
    events.forEach((event) => ethereum?.on(event, init));
    return () => {
      events.forEach((event) => ethereum?.removeListener(event, init));
    };
  }, []);

  const enterLottery = async () => {
    const transaction = await web3Data.contract?.methods.enter().send({
      from: web3Data.accounts[0],
      value: web3Data.web3.utils.toWei("1", "milliether"),
    });
    if (transaction) {
      setTransactionHash([...transactionHash, transaction.transactionHash]);
    }
  };

  const pickWinner = async () => {
    const transaction = await web3Data.contract?.methods
      .pickWinnerAndTransferMoney()
      .send({ from: web3Data.accounts[0] });
    if (transaction) {
      setTransactionHash([...transactionHash, transaction.transactionHash]);
    }
  };

  return (
    <div id="App">
      <ul>
        <li>
          <ol>
            <li>Manager: {web3Data.manager}</li>
            <li>Entered players: {web3Data.players}</li>
            <li>Money Sum: {web3Data.prize}</li>
            <li>Previous Winner: {web3Data.winner}</li>
          </ol>
        </li>
        <li>
          <button onClick={enterLottery}>Enter</button>
        </li>
        {isManager && (
          <li>
            <button onClick={pickWinner}>Pick Winner</button>
          </li>
        )}
        <li>
          <ol>
            {transactionHash.map((hash) => (
              <li key={hash}>{hash || ""}</li>
            ))}
          </ol>
        </li>
      </ul>
    </div>
  );
};

export default App;
