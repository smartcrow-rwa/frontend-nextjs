"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
//import { PeraWalletConnect } from "@perawallet/connect";

const NFTcontract="0x8d4D715Cf0f146e2c60000C69EcEa973Db47Ec2a";
const myabi=[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_parcelid",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_realtor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_sellbydays",
				"type": "uint256"
			}
		],
		"name": "createBonus",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_parcelid",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_realtor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_startdate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_sellbydays",
				"type": "uint256"
			}
		],
		"name": "createBonusTest",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "parcelid",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "lastrecordedDate",
				"type": "uint256"
			}
		],
		"name": "realtorwithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "parcelid",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "lastrecordedDate",
				"type": "uint256"
			}
		],
		"name": "sellerwithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_parcelid",
				"type": "string"
			}
		],
		"name": "getBonusActive",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_parcelid",
				"type": "string"
			}
		],
		"name": "getBonusamount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_parcelid",
				"type": "string"
			}
		],
		"name": "getBonusrealtor",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_parcelid",
				"type": "string"
			}
		],
		"name": "getBonussellbydate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_parcelid",
				"type": "string"
			}
		],
		"name": "getBonusseller",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_parcelid",
				"type": "string"
			}
		],
		"name": "getBonusstartdate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastapn",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastrequestid",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastselldate",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "parcelbonus",
		"outputs": [
			{
				"internalType": "string",
				"name": "parcelid",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "realtor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startdate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sellbydate",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "parcellastselldate",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "url",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "urlresult",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const {ethers} = require('ethers');
var provider;
var MyContract;
var MyContractwSigner;

//const peraWallet = new PeraWalletConnect();

const formatLongString = (str) => {
	if (str.length > 6) {
	  return str.slice(0, 3) + '...' + str.slice(-3);
	}
	return str;
};

const Hometwo = () => {
  	const [accountAddress, setAccountAddress] = useState(null);
  	const isConnectedToPeraWallet = !!accountAddress;

	useEffect(() => {
		login();
	}, []);

	const disconnect = async () => {
		//peraWallet.disconnect();
		setAccountAddress(null);
	}

  	const login = async () => {
      if (typeof window.ethereum !== 'undefined') {
        console.log('Metamask is installed!');
      
      }
      var myprovider = window.ethereum;
  
      /*const accounts = await window.ethereum.sendAsync(
        "eth_requestAccounts"
      )*/
    
      //const address = accounts.result[0];
      provider = new ethers.BrowserProvider(window.ethereum);
	  //console.log((await provider.getNetwork()).name);
      const signer = await provider.getSigner();
      console.log(signer.address);
      

      MyContract = new ethers.Contract(NFTcontract, myabi, provider);

      MyContractwSigner = await MyContract.connect(signer);
      setAccountAddress(signer.address);
	}

  return (
    <nav className='flex-between w-full mb-16 pt-3'>
      <Link href='/' className='flex gap-2 flex-center'>
        <Image
          src='/assets/images/logosmart.png'
          alt='logo'
          width={50}
          height={50}
          className='object-contain'
        />
        <p className='logo_text'>SmartCrow</p>
      </Link>

      {/* Desktop Navigation */}
      <div className='sm:flex hidden'>
          <>
                <button
                  type='button'
                  className='black_btn'
                  onClick={isConnectedToPeraWallet ? disconnect : login}>
                  {isConnectedToPeraWallet ? formatLongString(accountAddress) : "Connect Metamask"}
                 
                </button>
          </>
      </div>

      {/* Mobile Navigation */}
      <div className='sm:hidden flex relative'>
          <>
                <button
                  type='button'
                  className='black_btn'
                  onClick={isConnectedToPeraWallet ? disconnect : login}
                >
                  {isConnectedToPeraWallet ? formatLongString(accountAddress) : "Connect Metamask"}
                </button>
          </>
        
      </div>
    </nav>
  );
  };
export default Hometwo;
