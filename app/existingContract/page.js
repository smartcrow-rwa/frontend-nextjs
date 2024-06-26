"use client";
import { useState, useEffect } from 'react';
import Popup from '@/components/popup';
import PopupSuccess from '@/components/popupsuccess';

import { useSearchParams, useRouter } from 'next/navigation';

import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import {smartCrowContract, smartCrowABI } from '../projectConfig';
import { USDTcontract,DAIcontract,USDCcontract,WBTCcontract,WETHcontract, NativeContract } from '../projectConfig';
import { USDTmultiplier, DAImultiplier,USDCmultiplier,WBTCmultiplier,WETHmultiplier, Nativemultiplier } from '../projectConfig';
import { encryptedSecretsUrls, backend_API_URL } from '../projectConfig';

const NFTcontract=smartCrowContract;
const myabi = smartCrowABI;
const {ethers} = require('ethers');
var provider;
var MyContract;
var MyContractwSigner;


async function callContract(senderwallet, receiverwallet, APN) {
	//console.log('suggestedParams:', suggestedParams);
  //console.log(account)
  provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  console.log(signer.address);
      

  MyContract = new ethers.Contract(NFTcontract, myabi, provider);

  const resultsArray = await MyContract.bonusInfo(senderwallet,receiverwallet,APN);
  console.log(resultsArray);

  console.log(`Contract read success `);
	return resultsArray
}

async function withdrawSenderFunds(APN, senderaccount, receiveraccount) {
  console.log('Executing sender withdraw');
  provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  console.log(signer.address);
    

  MyContract = new ethers.Contract(NFTcontract, myabi, signer);
  console.log(MyContract);
  var mygaslimit = 100000;
  const result = await MyContract.withdrawFundsSender(senderaccount, receiveraccount,APN);//,{gasLimit: mygaslimit});
  
  console.log(result);
  
	return result
}

async function withdrawReceiverFunds(APN, senderaccount, receiveraccount) {
  
  provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  console.log(signer.address);
    

  MyContract = new ethers.Contract(NFTcontract, myabi, signer);
  console.log(MyContract);

  const result = await MyContract.withdrawFundsReceiver(senderaccount,receiveraccount,APN);
  
  console.log(result);

	return result
}

async function sendRequestChainlinkSubscription(APN, senderaccount, receiveraccount) {
  const stringArray = [senderaccount.toString(), receiveraccount.toString(),APN.toString(), smartCrowContract.toString()];

  provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  console.log(signer.address);
    
  MyContract = new ethers.Contract(NFTcontract, myabi, signer);
  console.log(MyContract);
  const result = await MyContract.sendRequest(encryptedSecretsUrls, stringArray);

  console.log(result);

	return result
}

const formatLongString = (str) => {
	if (str.length > 6) {
	  return str.slice(0, 3) + '...' + str.slice(-3);
	}
	return str;
};


const MyPage = () => {
  const [aseller, setSeller] = useState("");
  const [arealtor, setRealtor] = useState("");
  const [acontractamount, setAmount] = useState("");
  const [asellbydate, setSellbydate] = useState("");
  const [astartdate, setStartdate] = useState("");
  const [aactiveflag, setActiveFlag] = useState("");
  const [asalesPrice, setSalesPrice] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [fetching, setFetch] = useState(false);
	const [showPopupSuccess, setShowPopupSuccess] = useState(false);
  const [popupHeader, setPopupHeader] = useState("");
	const [popupHeaderSuccess, setPopupHeaderSuccess] = useState("");
  const [popupText, setPopupText] = useState("");
  const [accountAddress, setAccountAddress] = useState(null);
  const [usedcoin,setUsedcoin] = useState('MATIC');

  const searchParams = useSearchParams()
  const router = useRouter();
  const APN = searchParams.get('SelAPN');
	//console.log('APN = '+APN);
	const Address = searchParams.get('Address')+'\n APN : '+searchParams.get('fetchedAPN');;
 // console.log('Address = '+Address);
  const SenderAddress = searchParams.get('Sender');
  const ReceiverAddress = searchParams.get('Receiver');

  useEffect(() => {
		refresh();
	}, []);
	
// Function to create a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
  async function updateContractInfoSeller(senderwallet, receiverwallet, APN){
    // Call the contract to Send request to Chainlink functions and update
    await sendRequestChainlinkSubscription(APN, senderwallet, receiverwallet);

        // Wait for 20 seconds
        await delay(20000);

    // await withdrawSenderFunds(APN, senderwallet, receiverwallet);

    // console.log("Sender funds withdrawn");

    // We need this for condition's details and message pop ups only.
    console.log('sender: '+senderwallet);
    console.log('receiver: '+receiverwallet);
    console.log('APN: '+APN);
  
    // Example data to send in the request body
    const requestData = {
      sender: senderwallet,
      receiver: receiverwallet,
      propertyNumber: APN,
    };
  
    // Set the headers for JSON data
    const headers = {
      'Content-Type': 'application/json',
    };
  
    // Make a POST request using Axios
    axios.post(backend_API_URL, requestData, { headers })
    .then(async response => {
      // Handle the successful response
      console.log('Response:', response.data);
      if (response.data["meetSalesCondition"].condition == false && response.data["postDeadlineCheck"] == 1) {
        await withdrawSenderFunds(APN, senderwallet, receiverwallet);
        setPopupHeaderSuccess('Withdrawal Initiated. ' + response.data["meetSalesCondition"].reason);
        setShowPopupSuccess(true);
        setFetch(false)

        //router.push('/checkContract');
      }
      else {
        setPopupHeader('Unable to withdraw');
        setPopupText(response.data["meetSalesCondition"].reason);
        setShowPopup(true);
        setFetch(false)
      }
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error);
    });
  }
  
  async function updateContractInfoReceiver(senderwallet, receiverwallet, APN){
    // Call the contract to Send request to Chainlink functions and update
    await sendRequestChainlinkSubscription(APN, senderwallet, receiverwallet);

            // Wait for 20 seconds
            await delay(20000);

    // await withdrawReceiverFunds(APN, senderwallet, receiverwallet);
    

    // console.log("FUNDS WITHDRAWN BY RECEIVER");

  
    // Example data to send in the request body
    const requestData = {
      sender: senderwallet,
      receiver: receiverwallet,
      propertyNumber: APN,
    };
  
    // Set the headers for JSON data
    const headers = {
      'Content-Type': 'application/json',
    };
  
    // Make a POST request using Axios
    axios.post(backend_API_URL, requestData, { headers })
    .then(async response => {
      // Handle the successful response
      console.log('Response:', response.data);
      if (response.data["meetSalesCondition"].condition==true) {
        await withdrawReceiverFunds(APN, senderwallet, receiverwallet)
        setPopupHeaderSuccess('Withdrawal Initiated. ' + response.data["meetSalesCondition"].reason);
        setShowPopupSuccess(true);
        setFetch(false)
      }
      else {
        setPopupHeader('Unable to withdraw');
        setPopupText(response.data["meetSalesCondition"].reason);
        setShowPopup(true);
        setFetch(false)
      }
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error);
    });
  }

  const refresh = async () => {
    await handleUpdate();
	}

    const handleClosePopup = () => {
        setShowPopup(false);
      };

	  const handleClosePopupSuccess = () => {
        setShowPopupSuccess(false);
        router.push('/checkContract');
      };

    const handleWithdrawRealtor = async() => {
      await updateContractInfoReceiver(SenderAddress,ReceiverAddress, APN);
      setFetch(true)
    }

    const handleWithdrawSeller = async() => {
      await updateContractInfoSeller(SenderAddress,ReceiverAddress, APN);
      setFetch(true)
    }

  const handleUpdate = async() =>{
      var resultarray = await callContract(SenderAddress, ReceiverAddress, APN)
      var usedmultiplier=Nativemultiplier;
      var myusedcoin = resultarray[11];
      if (myusedcoin==USDTcontract){
        setUsedcoin('USDT');
        usedmultiplier = USDTmultiplier;
      }
      else if(myusedcoin==USDCcontract){
        setUsedcoin('USDC');
        usedmultiplier = USDCmultiplier;
      }
      else if(myusedcoin==WETHcontract){
        setUsedcoin('WETH');
        usedmultiplier = WETHmultiplier;
      }
      else if(myusedcoin==WBTCcontract){
        setUsedcoin('WBTC');
        usedmultiplier = WBTCmultiplier;
      }
      else if(myusedcoin==DAIcontract){
        setUsedcoin('DAI');
        usedmultiplier = DAImultiplier;
      }

      setSeller(resultarray[0]);
      setRealtor(resultarray[1]);
      setAmount(Number(resultarray[2]) / usedmultiplier);
      var resultdate = new Date(Number(resultarray[3])*1000);
      var startdate = new Date(resultdate.getTime()+36000000);
      var tempstartdate = startdate;
      //resultarray[4]=startdate;
      var startdate2 = tempstartdate.toLocaleString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      setStartdate(startdate2);

      var resultdate2 = new Date(Number(resultarray[4])*1000);
      var sellbydate = new Date(resultdate2.getTime()+36000000);
      //resultarray[5]=sellbydate;
      var sellbydate2 = sellbydate.toLocaleString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      setSellbydate(sellbydate2);

      var salesPrice = resultarray[7];
      setSalesPrice(Number(salesPrice));

      var activeflag = resultarray[10];
      if (activeflag==1){
        setActiveFlag('NO');
      }
      else {
        setActiveFlag('YES');
      }
      //determine used coin
      

  }
    
  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-10">
        <div className="flex flex-col gap-4">
          <div className='container flex flex-row'>
            <div className='left-side'>
              <h2 className="text-black text-2xl font-bold">APN/ID Address:</h2>
            </div>
            <div className='right-side ml-auto'>
              <button 
                type="button" 
                onClick={refresh}
                className="refresh_btn flex flex-row-reverse hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/60 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
              >
                <FontAwesomeIcon icon={faArrowsRotate} style={{ color: "#ffffff" }} className='' />
              </button>
            </div>
          </div>
          <div>
            <h1 className="text-default-text text-l font-bold bg-white p-2 border border-sky-200 rounded">{APN}</h1>
          </div>
          <textarea
            id="addresscheck"
            className="ml-0 resize-none flex-grow max-w-screen-m h-15 px-4 py-4 text-white bg-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
            defaultValue={Address}
            disabled
          />
          <div className="p-6 rounded border border-sky-200">
            <div className="flex rounded px-2 py-2">
              <div className="w-1/2">
                <ul className="list-inside text-black">
                  <li>Amount:</li>
                  <li>Currency:</li>
                  <li>Start date:</li>
                  <li>Sell by:</li>
                  <li>Sender Wallet:</li>
                  <li>Receiver Wallet:</li>
                  <li>Still Active:</li>
                  <li>Sales Price <span className='text-default-text'>$</span>:</li>
                </ul>
              </div>
              <div className="w-2/3 text-right text-default-text">
                <ul className="list-inside">
                  <li id="contractamount">{acontractamount}</li>
                  <li id="usedcoin">{usedcoin}</li>
                  <li>{astartdate}</li>
                  <li>{asellbydate}</li>
                  <li>{formatLongString(aseller)}</li>
                  <li>{formatLongString(arealtor)}</li>
                  <li>{aactiveflag}</li>
                  <li>{asalesPrice}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="p-6 rounded flex justify-between">
            <div className="w-full sm:w-1/2 text-center mr-10">
              <button className="bg-white border border-sky-200 hover:bg-gray-200 text-white font-semibold py-3 px-6 rounded-lg mb-4" onClick={handleWithdrawSeller}>
                <img src='/assets/images/send.png' className='h-10 w-10' alt="Send" />
              </button>
              <p className="text-default-text">Withdraw as <span><p>Sender</p></span></p>
            </div>
  
            {fetching && (
              <div className="w-full sm:w-1/2 text-center mr-10">
                <p className="text-default-text">Requesting data from county. This may take several minutes.</p>
              </div>
            )}
  
            <div className="w-full sm:w-1/2 text-center mr-10">
              <button className="bg-white border border-sky-200 hover:bg-gray-200 text-white font-semibold py-3 px-6 rounded-lg mb-4" onClick={handleWithdrawRealtor}>
                <img src='/assets/images/receive.png' className='h-10 w-10' alt="Receive" />
              </button>
              <p className="text-default-text">Withdraw as <span><p>Receiver</p></span></p>
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <Popup header={popupHeader} text={popupText} closeModal={handleClosePopup} isOpen={showPopup}/>
      )}
      {showPopupSuccess && (
        <PopupSuccess header={popupHeaderSuccess} text={""} closeModal={handleClosePopupSuccess} isOpen={showPopupSuccess}/>
      )}
    </div>
  );
  
  };
  
  export default MyPage;
