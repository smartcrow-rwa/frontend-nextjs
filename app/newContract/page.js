"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Popup from '@/components/popup';
import PopupSuccess from '@/components/popupsuccess';
import PopupInfo from '@/components/popupinfo';
import numeral from 'numeral';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

//How many days of slack? 1 for 30 and 2 for 60 days
var minRequestDays = 2;

const axios = require('axios');

import { USDTcontract,DAIcontract,USDCcontract,WBTCcontract,WETHcontract, NativeContract, smartCrowABI, smartCrowContract } from '../projectConfig';
import { USDTmultiplier, DAImultiplier,USDCmultiplier,WBTCmultiplier,WETHmultiplier,Nativemultiplier } from '../projectConfig';
import { USDTabi, DAIabi, USDCabi, WBTCabi, WETHabi } from '../projectConfig';
import { backend_EMAIL_URL } from '../projectConfig';

const {ethers, getBigInt} = require('ethers');
var provider;
var MyContract;
var MyContractwSigner;

const formatNumberWithCommas = (value) => {
  return numeral(value).format('0,0');
};

const MyForm = () => {
  const today = new Date().toISOString().substring(0, 10); // Get today's date in yyyy-mm-dd format
	const [verificationfailed, setVerified] = useState(true);
	const [showPopup, setShowPopup] = useState(false);
	const [showPopupSuccess, setShowPopupSuccess] = useState(false);
  const [popupHeader, setPopupHeader] = useState("");
	const [popupHeaderSuccess, setPopupHeaderSuccess] = useState("");
  const [popupText, setPopupText] = useState("");
	const [showBalloon,setShowBalloon] = useState(false);
	const [balloonText,setBalloonText] = useState("");
	const [accountAddress, setAccountAddress] = useState(null);
  const [isForSale, setIsForSale] = useState(false);
  const [PriceCondition, setPriceCondition] = useState(true);
  const isConnectedToPeraWallet = !!accountAddress;
  const [sendermail,setSendermail]= useState('');
  const [receiverermail,setReceivermail]= useState('');
  const [usedCoin,setUsedCoin]=useState('USDT');
  const [userconf,setUserconf]=useState(false);
  const [mybonusamount,setMybonusamount]=useState(0);
  const [mybonusamountrep,setMybonusamountrep]=useState('');
  const [mysalesprice,setMysalesprice]=useState(0);
  const [mysalespricerep,setsalespricerep]=useState('');
  const [slack, setSlack] = useState(true);

	useEffect(() => {
		// Reconnect to the session when the component is mounted
		
	  }, []);

	const searchParams = useSearchParams()
  const SelAPN = searchParams.get('SelAPN');
	const Address = searchParams.get('Address')+'\n APN : '+searchParams.get('fetchedAPN');
  //console.log(Address);
  const SenderAddress = searchParams.get('Sender');
  const ReceiverAddress = searchParams.get('Receiver');
  const router = useRouter();

  const approveUSDT = async(amount,chosenmultiplier,chosencontract,chosenabi) =>{
    const tempamount = String(amount * chosenmultiplier);
    console.log(tempamount);
    
    const myamount = ethers.getBigInt(tempamount);
    console.log(myamount);
    //const myamount = ethers.utils.parseEther(amount);
    //const largeInteger = ethers.BigNumber.from("1000000000000000000");
    //var myamount = largeInteger;

    provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const MyUSDTContract = new ethers.Contract(chosencontract, chosenabi, signer);
    var result = await(MyUSDTContract.approve(smartCrowContract,myamount));
    console.log(result);


  }

  //function to add thousand separator
  const addthousandseparator = (myvalue) => {
    console.log('myvalue : '+myvalue);
    var result='';
    if(myvalue!=''){
    var myrepvalue = String(myvalue).replace(/,/g, '');
    const [myint,myfrac] = myrepvalue.split('.');
    console.log('myfrac : '+myfrac);
    const myintrep = Number(myint).toLocaleString();
    console.log(myintrep);
    
    if (myfrac==undefined){
      result = String(myintrep);
    }
    else{
      result = String(myintrep)+'.'+myfrac;
    }}
    
    return result;
  }

  const addthousandseparator2 = (myvalue) => {
    console.log('myvalue : '+myvalue);
    var result='';
    if(myvalue!=''){
    var myrepvalue = String(myvalue).replace(/,/g, '');
    const [myint,myfrac] = myrepvalue.split('.');
    console.log('myfrac : '+myfrac);
    const myintrep = Number(myint).toLocaleString();
    console.log(myintrep);
    
    if (myfrac==undefined){
      result = String(myintrep);
    }
    else{
      result = String(myintrep)+'.'+myfrac;
    }}
    
    return result;
  }

  const sendconfirmationmail = async(mailaddress) => {
    console.log('mail address = '+mailaddress);
    const senderwallet = document.getElementById('senderwallet').value;
    const receiverwallet = document.getElementById('receiverwallet').value;
    var mymessage = 'Created a smart contract with sender wallet '+senderwallet+' and receiver wallet '+receiverwallet+' for address '+SelAPN;
  
    // Example data to send in the request body
    const requestData = {
      email: mailaddress,
      message: mymessage,

    };
  
    // Set the headers for JSON data
    const headers = {
      'Content-Type': 'application/json',
    };
  
    // Make a POST request using Axios
    axios.post(backend_EMAIL_URL, requestData, { headers })
    .then(async response => {
      console.log(response);
    })


  }

  const approvestablecoin = async() => {
    const amount = document.getElementById("bonusamount").value;
    approveUSDT(amount);
  }

	async function callBonus(account) {
		var APN = document.getElementById("parcelid").value;
		var amount = mybonusamount;//document.getElementById("bonusamount").value;
    var seller = document.getElementById("senderwallet").value;
		var realtor = document.getElementById("receiverwallet").value;
		var Sellby = new Date(document.getElementById("sellbydate").value);
		var selltimestamp = Math.floor(Sellby.getTime()/1000);
		var Startby = new Date(document.getElementById("startdate").value);
		var startdatetimestamp = Math.floor(Startby.getTime()/1000);
    var salesPrice = mysalesprice;//document.getElementById("salesprice").value;
    var boolabove = PriceCondition;
    var boolbelow = !PriceCondition;
    var intPriceCOndition;
    var chosencoin = document.getElementById("usedcoin").value;
    var minreqdays = 1;

    if (Number.isNaN(salesPrice)){
      salesPrice=0;
    }

    if (!slack){
      minreqdays=2;
    }
    console.log('chosen coin = '+chosencoin);

    intPriceCOndition=2;
    if(PriceCondition){
      intPriceCOndition=1;
    }

    //Put both conditions to false if no price condition is selected.
    if (isForSale==false){
      boolabove=false;
      boolbelow=false;
      intPriceCOndition=3;
    }

    

    var chosencontract=NativeContract;
    var chosenabi;
    var chosenmultiplier=Nativemultiplier;

    if (chosencoin=='USDT'){
      chosencontract=USDTcontract;
      chosenabi=USDTabi;
      chosenmultiplier = USDTmultiplier;
    }
    else if(chosencoin=='USDC'){
      chosencontract=USDCcontract;
      chosenabi=USDCabi;
      chosenmultiplier = USDCmultiplier;
    }
    else if(chosencoin=='WBTC'){
      chosencontract=WBTCcontract;
      chosenabi=WBTCabi;
      chosenmultiplier = WBTCmultiplier;
    }
    else if(chosencoin=='WETH'){
      chosencontract=WETHcontract;
      chosenabi=WETHabi;
      chosenmultiplier = WETHmultiplier;
    }
    else if(chosencoin=='DAI'){
      chosencontract=DAIcontract;
      chosenabi=DAIabi;
      chosenmultiplier = DAImultiplier;
    }
    
    var tempbonusamount = String(amount*chosenmultiplier);
    var bonusamount = ethers.getBigInt(tempbonusamount);
    console.log('bonus amount = '+bonusamount);
    //salesPrice /= 1e6
    if(chosencoin!='ETH'){
      await approveUSDT(amount,chosenmultiplier,chosencontract,chosenabi);
    }
    provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log(signer.address);
      

    MyContract = new ethers.Contract(smartCrowContract, smartCrowABI, signer);
    console.log(MyContract);
    //MyContractwSigner = await MyContract.connect(signer);

    console.log('minrequestdays = '+minreqdays);
    
    if (chosencoin!='ETH'){
		  const results = await MyContract.createBonusInfo(realtor,APN,startdatetimestamp,selltimestamp,intPriceCOndition,minreqdays,salesPrice,bonusamount,chosencontract);
    }
    else{
      const results2 = await MyContract.createBonusInfo(realtor,APN,startdatetimestamp,selltimestamp,intPriceCOndition,minreqdays,salesPrice,bonusamount,chosencontract,{value:bonusamount});
    }
    const sendermail = document.getElementById('sendermail').value;
    const receivermail = document.getElementById('receivermail').value;

    if (sendermail!=''){
      await sendconfirmationmail(sendermail);
    }

    if (receivermail!=''){
      await sendconfirmationmail(receivermail);
    }

		console.log(`Contract created `);
		setPopupHeaderSuccess('Contract Initiated!');
		setShowPopupSuccess(true);
	}


	
	const createbonusfunc = async () => {
    
    await callBonus();
	}

	const login = async () => {
		
	}

	const disconnect = async () => {
		
		setAccountAddress(null);
	}

	const handleClosePopup = () => {
        setShowPopup(false);
      };

	  const handleClosePopupSuccess = () => {
        setShowPopupSuccess(false);
		    router.push('/checkContract');
    };

	  const handleClickBalloon = () => {
		setBalloonText('This is your subject address for the contract. The APN/Parcel ID below should match your address.');
		setShowBalloon(true);
	  }

    const handleClickBalloonConverter = () => {
      setBalloonText('Use the crypto currency converter to calculate the contract funding amount. Press the currency name (i.e. BTC / USD) to find other currency exchange rates.');
      setShowBalloon(true);
    }

    const handleClickBalloonAmount = () => {
      setBalloonText('Choose your crypto token from the dropdown menu. Enter the amount of the crypto token. This amount will fund the contract. Use the crypto currency converter above to calculate the amount you wish to enter.');
      setShowBalloon(true);
      }

	  const handleClickBalloon2 = () => {
		setBalloonText('This is the start date of the contract.');
		setShowBalloon(true);
	  }

	  const handleClickBalloon3 = () => {
		setBalloonText('This is the end date of the contract. The real estate/subject property must record a grand deed by this date. If the contract terms are not met, then the contract expires after 30-60 days and the sender/creator of the contract can withdraw funds.');
		setShowBalloon(true);
	  }

	  const handleClickBalloon4 = () => {
		setBalloonText('The sender wallet is the creator of the contract. The sender will fund the contract from their Metamask wallet. Optional: enter an email address to receive a contract confirmation.');
		setShowBalloon(true);
	  }

	  const handleClickBalloon5 = () => {
		setBalloonText('The receiver wallet receives funds if all contract terms are met. After local county/public records publishes updated sales data of the subject property, the contract can be executed and funds released. Optional: enter an email address to receive a contract confirmation.');
		setShowBalloon(true);
	  }

    const handleClickBalloon6 = () => {
      setBalloonText('The sales price is an optional term. This contract term is the projected sales price of the subject property. This term can be set as equal or above or equal or below the projected sales price.');
      setShowBalloon(true);
      }

    const handleClickBalloonTerms = () => {
        setBalloonText('County/public records can take up to 30-60 days to update subject property sales data. The sender wallet is locked from cancelling the contract for 30 to 60 days to allow new sales data to be recorded.  After 30 to 60 days, if terms are not met, the sender wallet can cancel the contract.  The contract can execute before 30 days if subject property sales data has been updated by county/public records.');
        setShowBalloon(true);
      }

	  const handleCloseBalloon = () => {
        setShowBalloon(false);
      };

    const handleOptionChangeCoin = () => {
      setUsedCoin(document.getElementById('usedcoin').value);
      //console.log(document.getElementById('usedcoin').value);
    }

    const changeUserconfirm = () => {
      //console.log(document.getElementById('userconfirm').checked);
      setUserconf(document.getElementById('userconfirm').checked);
    }

	  const handleChange = async() => {
      console.log('Verifying input');
      //console.log('bonus : '+document.getElementById("bonusamount").value);
      const verAmount= parseFloat(document.getElementById("bonusamount").value.replace(/,/g, ''));
      const verStartdate= document.getElementById("startdate").value;
      const verSellbydate= document.getElementById("sellbydate").value;
      const verSeller = document.getElementById("senderwallet").value;
      const verRealtor = document.getElementById("receiverwallet").value;
      const salesPrice = parseFloat(document.getElementById("salesprice").value.replace(/,/g, ''));
      const userconfirmation = document.getElementById("userconfirm").checked;
      setMybonusamount(verAmount);

      if (slack) {
        minRequestDays=1;
      }
      else{
        minRequestDays=2;
      }
      console.log('slack selection = '+slack);
      console.log('slack = '+minRequestDays);
      

      //setMybonusamountrep(addthousandseparator(document.getElementById("bonusamount").value));
      //console.log('bonus amount: '+mybonusamount);
      setMysalesprice(salesPrice);
      console.log('salesprice : '+mysalesprice);
      //setsalespricerep(await addthousandseparator2(document.getElementById("salesprice").value));
      setUserconf(document.getElementById('userconfirm').checked);

      if (isForSale) {
        if (verAmount==0 || verStartdate=="" || verSellbydate=="" ||verSeller=="" || verRealtor=="" || salesPrice=="" || verSeller==verRealtor || userconfirmation==false) {
          setVerified(true);
        }
        else {
          setVerified(false);
        }
      }
      else {
        if (verAmount==0 || verStartdate=="" || verSellbydate=="" ||verSeller=="" || verRealtor=="" || verSeller==verRealtor || userconfirmation==false) {
          setVerified(true);
        }
        else {
          setVerified(false);
        }
      }
	  }

    return (
      <div className="min-h-screen max-w-xs sm:max-w-2xl">
        <nav className="flex justify-between items-center">
          <p className="text-black font-bold text-sm md:text-lg m-2">New Contract</p>
        </nav>
        <div className="container mx-auto pb-3">
          <div className="flex flex-col gap-0.5">
            
            <section className="flex mb-8 max-w-xs sm:max-w-lg">
              <input
                type="text"
                id="parcelid"
                className="m-2 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 border APN_input  max-w-screen-sm flex-grow"
                defaultValue={SelAPN}
                onChange={handleChange}
                placeholder="APN"
              />
              <button 
                type="button" 
                onClick={handleClickBalloon}
                className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
              >
                <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
              </button>
            </section>
            
            <section className="flex-start m-2 mt-0">
              <textarea
                id="addresscheck"
                className="ml-0 resize-none flex-grow max-w-screen-m h-15 px-4 py-4 text-white bg-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                disabled
                defaultValue={Address}
              ></textarea>
            </section>
            <section className="flex m-2 mt-0 items-center justify-center">
            <script async src="https://cdn.jsdelivr.net/gh/dejurin/crypto-converter-widget@1.5.2/dist/latest.min.js"></script>
              <crypto-converter-widget shadow symbol live background-color="#383a59" border-radius="0.60rem" fiat="united-states-dollar" crypto="bitcoin" amount="1" decimal-places="2"></crypto-converter-widget>
              <button 
                type="button" 
                onClick={handleClickBalloonConverter}
                className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
              >
                <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
              </button>
            </section>
    
            {/* Amount USDC */}
            <label htmlFor="bonusamount" className="font-bold mr-4 m-2 text-black">
              Amount
            </label>
            <section className="flex mb-8">
              <input
                type="text"
                placeholder=''
                inputMode='numeric'
                id="bonusamount"
                
                className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input max-w-screen-sm flex-grow"
                onChange={()=>{handleChange();setMybonusamountrep(addthousandseparator(document.getElementById("bonusamount").value));}}
                value={mybonusamountrep}
              />
              <select id="usedcoin" value={usedCoin} onChange={handleOptionChangeCoin}
                className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input max-w-screen-sm flex-grow"
              >
                
                <option value="ETH">MATIC</option>
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
                <option value="WETH">WETH</option>
                <option value="WBTC">WBTC</option>
                <option value="DAI">DAI</option>
                
              </select>
              <button 
                type="button" 
                onClick={handleClickBalloonAmount}
                className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
              >
                <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
              </button>
            </section>
    
            {/* Dates */}
            <div className='container flex flex-col sm:flex-row'>
              <div className='left-date'>
                <label htmlFor="bonusamount" className="font-bold m-2 text-black">
                  Start Date
                </label>
                <div className="flex items-center flex-row p-2">
                  <section className="flex mb-8">
                    <input
                      type="date"
                      id="startdate"
                      className="max-w-screen-m flex-grow py-2 px-3 mt-1 w-60 bg-default-bg rounded focus:outline-offset-0 outline-sky-200 border APN_input"
                      defaultValue={today}
                      onChange={handleChange}
                    />
                    <button 
                      onClick={handleClickBalloon2}
                      className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
                    >
                      <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
                    </button>
                  </section>
                </div>
              </div>
    
              <div className='right-date sm:ml-12'>
                <label htmlFor="bonusamount" className="font-bold m-2 text-black">
                  Sold By
                </label>
                <div className="flex items-center flex-row p-2">
                  <section className="flex mb-8">
                    <input
                      type="date"
                      id="sellbydate"
                      className="max-w-screen-m flex-grow py-2 px-3 mt-1 w-60 bg-default-bg rounded focus:outline-offset-0 outline-sky-200 border APN_input"
                      defaultValue={today}
                      onChange={handleChange}
                    />
                    <button 
                      onClick={handleClickBalloon3}
                      className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
                    >
                      <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
                    </button>
                  </section>
                </div>
              </div>
            </div>
            {/*Slack selection*/}
            <label htmlFor="slacksel" className="font-bold m-2 text-black">Contract Cancellation Lockout: </label>
            <div className="flex items-center flex-row p-2">
              <div className="flex items-center">
                <label className="mr-10 m-2">
                  <input
                    type="radio"
                    id="30"
                    checked={slack}
                    onChange={() => {
                      setSlack(true);
                      handleChange();
                      //console.log("handle change2");
                    }}
                    className="mr-1"
                  />
                  30 days
                </label>
                <label>
                  <input
                    type="radio"
                    id="no"
                    checked={!slack}
                    onChange={() => {
                      setSlack(false);
                      
                      handleChange();
                      //console.log("handle change");
                    }}
                    className="mr-1"
                  />
                  60 days
                </label>
              </div>
              <button 
                type="button" 
                onClick={handleClickBalloonTerms}
                className="info_btn ml-6 m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
              >
                <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
              </button>
            </div>
    
            {/* Add Sales Price */}
            <label htmlFor="bonusamount" className="font-bold m-2 text-black">Add Sales Price: </label>
            <div className="flex items-center flex-row p-2">
              <div className="flex items-center">
                <label className="mr-10 m-2">
                  <input
                    type="radio"
                    id="yes"
                    checked={isForSale}
                    onChange={() => {
                      setIsForSale(true);
                      handleChange();
                      console.log("handle change2");
                    }}
                    className="mr-1"
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    id="no"
                    checked={!isForSale}
                    onChange={() => {
                      setIsForSale(false);
                      document.getElementById("salesprice").value = 0;
                      handleChange();
                      console.log("handle change");
                    }}
                    className="mr-1"
                  />
                  No
                </label>
              </div>
            </div>
            {/* sales condition*/}
            <label htmlFor="bonuscondition" className="font-bold m-2 text-black">Sales price condition: </label>
            <div className="flex items-center flex-row p-2">
              <div className="flex items-center">
                <label className="mr-10 m-2">
                  <input
                    type="radio"
                    id="priceabove"
                    checked={PriceCondition}
                    onChange={() => {
                      setPriceCondition(true);
                      handleChange();
                      console.log("handle change price condition 2");
                    }}
                    className="mr-1"
                  />
                  Equal or Above
                </label>
                <label>
                  <input
                    type="radio"
                    id="no"
                    checked={!PriceCondition}
                    onChange={() => {
                      setPriceCondition(false);
                      //document.getElementById("salesprice").value = 0;
                      handleChange();
                      console.log("handle change price condition");
                    }}
                    className="mr-1"
                  />
                  Equal or Below
                </label>
              </div>
            </div>
            {/* Sales Price */}
            <label htmlFor="bonusamount" className="font-bold mt-4 m-2 text-black">
              Sales Price (USD) :
            </label>
            <section className="flex mb-8">
              <input
                type="text"
                inputMode='numeric'
                id="salesprice"
                
                className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input max-w-screen-sm flex-grow"
                onChange={() =>{handleChange();setsalespricerep(addthousandseparator2(document.getElementById("salesprice").value));}}
                disabled={!isForSale}
                value={mysalespricerep}
              />
              <button 
                type="button" 
                onClick={handleClickBalloon6}
                className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
              >
                <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
              </button>
            </section>
    
            {/* Sender Wallet */}
            <label htmlFor="senderwallet" className="font-bold mr-4 m-2 text-black">Sender Wallet</label>
            <section className="flex mb-2">
              <input
                type="text"
                id="senderwallet"
                defaultValue={SenderAddress}
                className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input max-w-screen-sm flex-grow"
                onChange={handleChange}
              />
              <button 
                type="button" 
                onClick={handleClickBalloon4}
                className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
              >
                <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
              </button>
            </section>
            <section className="flex mb-8">
              <input id="sendermail" type="email" placeholder="johndoe@mail.com" className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input max-w-screen-sm flex-grow"
                >
              </input>
            </section>
    
            {/* Receiver Wallet */}
            <label htmlFor="receiverwallet" className="font-bold mr-4 m-2 text-black">Receiver Wallet</label>
            <section className="flex mb-2">
              <input
                type="text"
                id="receiverwallet"
                defaultValue={ReceiverAddress}
                className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input max-w-screen-sm flex-grow"
                onChange={handleChange}
              />
              <button 
                type="button" 
                onClick={handleClickBalloon5}
                className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
              >
                <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
              </button>
            </section>
            <section className="flex mb-8">
              <input id="receivermail" type="email" placeholder="johndoe@mail.com" className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input max-w-screen-sm flex-grow"
                >
              </input>
            </section>
            <section className="flex mb-2">
              <input type="checkbox" id="userconfirm" onChange={handleChange}></input>
              <p className="ml-2 text-default-text">I confirm the data entered is accurate.  I understand once the contract is created it is permanent and can’t be edited</p>

            </section>
    
            <div className="p-6 flex items-center justify-center">
              <button 
                className={`create_blue_btn py-2 px-4 rounded ${
                  verificationfailed ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-default-bt text-default-bt-text hover:bg-gr-200 border border-default-border'
                }`} 
                disabled={verificationfailed} 
                onClick={createbonusfunc}
              >
                Create Contract
              </button>
              
            </div>
            <div className="p-6 flex items-center justify-center">
              <p className='text-xs text-red-700'>Once Create Contract button is pressed, all entered data is final and cannot be edited. Make sure all entered data is correct.</p>
            </div>
          </div>
        </div>
    
        {showPopup && (
          <Popup header={popupHeader} text={popupText} closeModal={handleClosePopup} isOpen={showPopup}/>
        )}
        {showPopupSuccess && (
          <PopupSuccess header={popupHeaderSuccess} text={""} closeModal={handleClosePopupSuccess} isOpen={showPopupSuccess}/>
        )}
        {showBalloon && (
          <PopupInfo text={balloonText} closeModal={handleCloseBalloon} isOpen={showBalloon}/>
        )}
      </div>
    );    
  };
  
  export default MyForm;
