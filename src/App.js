import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState("");

  const contractAddress = "0x1135c01ca8A5b91Df700072Ae5Ee0Cd607B0342E"
  const contractABI = abi.abi
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      getAllWaves()
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        wavePortalContract.wave(message, { gasLimit: 300000 })
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}



  useEffect(() => {
    const contractAddress = "0x1135c01ca8A5b91Df700072Ae5Ee0Cd607B0342E"
    const contractABI = abi.abi
     /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          let date = new Date(wave.timestamp * 1000)
          let cleanDate = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`
          wavesCleaned.push({
            address: wave.waver,
            timestamp: cleanDate,
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned.reverse());
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

// Listen for new Wave event
let wavePortalContract;

const onNewWave = (from, timestamp, message) => {
  console.log("NewWave", from, timestamp, message);
  let date = new Date(timestamp * 1000)
  let cleanDate = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`
  setAllWaves(prevState => [
    {
      address: from,
      timestamp: cleanDate,
      message: message,
    },
    ...prevState,
  ]);
};

if (window.ethereum) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  wavePortalContract.on("NewWave", onNewWave);
}
checkIfWalletIsConnected();
getAllWaves()

return () => {
  if (wavePortalContract) {
    wavePortalContract.off("NewWave", onNewWave);
  }
};

    
  }, [])

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          let date = new Date(wave.timestamp * 1000)
          let cleanDate = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`
          wavesCleaned.push({
            address: wave.waver,
            timestamp: cleanDate,
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned.reverse());
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hello, there!
        </div>
        <h3 className="bio">
          My name is John and I made this application. It's deployed on the Ethereum blockchain. Connect your Ethereum wallet and wave at me! You can leave a message as well.
        </h3>
        <h3>
          <em>Current Network: Rinkeby</em>
        </h3>
        
        <textarea
        rows='8'
        className='text-input'
        placeholder='click here to type'
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        ></textarea>


        <button className="waveButton" onClick={wave}>
          👋 wave at me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} className="message-box">
              <div>Address: {wave.address}</div>
              <div>Date: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App