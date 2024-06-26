"use client";
import PopupInfo from '@/components/popupinfo';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import { useRouter } from 'next/router';
import { NextRequest, NextResponse } from 'next/server';

import _fetch from 'isomorphic-fetch';
import dotenv from 'dotenv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Autocomplete from "react-google-autocomplete";
import { GOOGLE_API_KEY, PROPERTY_API_KEY, RENTCAST_KEY, smartCrowContract, smartCrowABI } from '../projectConfig';
//const myrouter = useRouter();

const axios = require('axios');
const apiUrl = 'https://api.propmix.io/pubrec/assessor/v1/GetPropertyDetails';


const NFTcontract= smartCrowContract;
const myabi= smartCrowABI;

const {ethers} = require('ethers');
var provider;
var MyContract;
var MyContractwSigner;



export default function Home() {
	const [showBalloon,setShowBalloon] = useState(false);
	const [balloonText,setBalloonText] = useState("");
	const [buttonNewContract,setbuttonNewContract] = useState(true);
	const [buttonExistingContract,setbuttonExistingContract] = useState(true);
  	const [accountAddress, setAccountAddress] = useState(null);
  	const isConnectedToPeraWallet = !!accountAddress;
  	const router = useRouter();
	const [myaddress,setMyaddress] = useState('');
	const [streetaddress, setStreetaddress]=useState('');
	const [mystate, setMyState]=useState('');
	const [zipcode, setZipcode]=useState(0);
	const [fetchedAPN,setFetchedAPN] = useState('');

	useEffect(() => {
		// Reconnect to the session when the component is mounted
		
	}, []);

	/*const getMyKey = async() =>{
		console.log('executing this function');
		const response = fetch('/api/getGoogle',{
			method:'GET',
			body:''
		});
		console.log('response : '+response);
	}*/

	const getPropertyInfoRentCast = async(propertyID) => {
		console.log('Getting Rentcast info');
		const url = `https://api.rentcast.io/v1/properties?address=${encodeURIComponent(myaddress)}`;
		const headers = { accept: 'application/json', 'X-Api-Key': RENTCAST_KEY };
	  
		try {
		  const response = await axios.get(url, { headers });
		  const json = response.data;
	  
		  if (json) {
			console.log(json);
			const APN = json[0].assessorID;
			//const lastSalePrice = json.lastSalePrice;
			return APN;
		  } else {
			throw new Error('No property found for the given ID');
		  }
		} catch (error) {
		  throw new Error('Error fetching property information: ' + error.message);
		}
	  }

	const getPropDetails = async() => {
		console.log('streetaddress = '+streetaddress);
		console.log('zipcode = '+zipcode);
		const responser = await fetch('/api/propmix?myaddress='+streetaddress+'&myzipcode='+zipcode+'&mystate='+mystate);
		const data = await responser.json();
		//console.log('Do we get a response??');
		console.log(data.message);
		return data.message;

	}

	const getPropertyDetails = async(
		accessToken, 
		streetAddress, 
		postalCode, 
		orderId) => {
			console.log('Checking propmix');
			  const headers = {
				  'Access-Token': PROPERTY_API_KEY,
				};
				
				// Define query parameters
				const params = {
				  OrderId: orderId,
				  StreetAddress: streetaddress,
				  PostalCode: zipcode,
				};
				
				// Make the API call using Axios
				axios
				  .get(apiUrl, { headers, params })
				  .then((response) => {
					// Handle the API response
					console.log('API Response:', response.data);
				  })
				  .catch((error) => {
					// Handle errors
					console.error('Error calling API:', error.message);
				  });
	  }
	  

	const disconnect = async () => {
		//peraWallet.disconnect();
		setAccountAddress(null);
	}

  	const login = async () => {
		//Do we need to log in here?
		
	}

	async function callContract(APN) {
		
		provider = new ethers.BrowserProvider(window.ethereum);
      	const signer = await provider.getSigner();
      	console.log(signer.address);
      

      	MyContract = new ethers.Contract(NFTcontract, myabi, provider);

      	MyContractwSigner = await MyContract.connect(signer);
      	

	
		try {
			
			const active = results.methodResults[0].returnValue

			if (!active) {
				setbuttonExistingContract(false);
				setbuttonNewContract(true);
			}
			else {
				setBalloonText('Contract is no longer active');
				setShowBalloon(true);
			}
		} catch (e) {
			console.log(e);
			setbuttonNewContract(false);
			setbuttonExistingContract(true);
		}
	}

	const handleClickBalloon = () => {
		setBalloonText('Enter wallet addresses. The sender wallet is the creator and funder of the contract. The receiver wallet receives funds if contract terms are met.  Enter address and press check address button.  The address will display with its APN/Parcel ID.  Confirm the address and APN/Parcel ID match your records.');
		setShowBalloon(true);
	}

	const handleCloseBalloon = () => {
		setShowBalloon(false);
	};

	async function checkAPN(APN) {

		
		provider = new ethers.BrowserProvider(window.ethereum);
      	const signer = await provider.getSigner();
      	console.log(signer.address);
      

      	MyContract = new ethers.Contract(NFTcontract, myabi, provider);

      	MyContractwSigner = await MyContract.connect(signer);
		const mysenderwallet = document.getElementById('mysenderwallet').value;
		const myreceiverwallet = document.getElementById('myreceiverwallet').value;
		
		console.log('myaddress = '+myaddress);
		var result = await MyContract.bonusInfo(mysenderwallet,myreceiverwallet,myaddress);
		console.log('contract paid out = '+result[10]);
		var contractInactive = result[10];
		var returnresult=1;
		if (result[0]!=mysenderwallet || contractInactive==1){
			console.log('No active contract found');
			setbuttonExistingContract(true);
			setbuttonNewContract(false);
			returnresult=0;
		}
		else {
			console.log('Active contract found');
			setbuttonExistingContract(false);
			setbuttonNewContract(true);
		}
		console.log(result);
		return returnresult;
	}

	const handleExistingContract = async() => {
		var data = myaddress;
		const data2 = myaddress;
		const data3 = document.getElementById("mysenderwallet").value;
		const data4 = document.getElementById("myreceiverwallet").value;
		const data5 = fetchedAPN;
		router.push(`/existingContract?SelAPN=${data}&Address=${data2}&Sender=${data3}&Receiver=${data4}&fetchedAPN=${data5}`);
	};

	const handleNewContract = async() => {
		var data = myaddress;
		const data2 = myaddress;
		const data3 = document.getElementById("mysenderwallet").value;
		const data4 = document.getElementById("myreceiverwallet").value;
		const data5 = fetchedAPN;
		router.push(`/newContract?SelAPN=${data}&Address=${data2}&Sender=${data3}&Receiver=${data4}&fetchedAPN=${data5}`);
	};
	
	const handleSelect = async(place) => {
		console.log(place);
		console.log(place['formatted_address']);
		setMyaddress(place['formatted_address']);
		setStreetaddress(place['address_components'][0]['long_name']+' '+place['address_components'][1]['long_name']);
		for (var i=0;i<8;i++){
			console.log(place['address_components'][i]['types'][0]);
			if(place['address_components'][i]['types'][0]=='postal_code'){
				setZipcode(place['address_components'][i]['long_name']);
			}
		};
		
		setMyState(place['address_components'][5]['long_name']);
	}

	const checkaddress = async() => {
		// we need to change this one where the address is put in, with the Google API
		
		console.log('street = '+streetaddress);
		console.log('zip = '+zipcode);
		var myorder = streetaddress+'_'+zipcode;
		//await getPropDetails();
		var response = await checkAPN();
	
		//var myAPN = await getPropertyInfoRentCast(myaddress);
		var myAPN = await getPropDetails();
		
		console.log(myAPN);
		console.log(typeof myAPN);
		const myText = document.getElementById("addresscheck");
		var APNtext = 'no APN known';
		if (typeof myAPN!='undefined'){
			APNtext = myAPN;
		}
		setFetchedAPN(APNtext);
		myText.value = myaddress+'\n APN : '+APNtext;

		
		
	} 

	return (
		<section className='contract-wrapper'>
		  <div className='mb-2 pb-20 container flex space-between flex-end'>
			<div className='flex-col flex-start pt-4 pb-0 contract-left'>
			<input
				  type="text"
				  id="mysenderwallet"
				  className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input"
				  placeholder="Enter Sender Wallet Address"
				  required
			/>
			<input
				  type="text"
				  id="myreceiverwallet"
				  className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input"
				  placeholder="Enter Receiver Wallet Address"
				  required
			/>
			  
				
			 
			  <Autocomplete
                
                apiKey={GOOGLE_API_KEY}
                className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input"
				
                options={{
                    types: [],
                    componentRestrictions: { country: "us" },
                }}
                onPlaceSelected={(place) => {
                    handleSelect(place);
                }}
            />
			
			<section className="flex mb-8">
				<button
				  type='button'
				  className='m-2 blue_btn about px-4 py-2'
				  onClick={checkaddress}
				>
				  Check Address
				</button>
				<button
				  type="button"
				  onClick={handleClickBalloon}
				  className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
				>
				  <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
				</button>
			  </section>
	  
			  <section className="flex-start mb-6 mt-0 w-120">
				<textarea
				  id="addresscheck"
				  className="resize-none m-2 sm:w-96 h-15 px-4 py-4 text-white bg-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
				  disabled
				  placeholder="Address Will Display Here"
				></textarea>
			  </section>
			  <section className="flex-start">
				<div className="w-full sm:w-1/2 text-center mr-10 m-2">
				  <button
					className={`hover:bg-gray-200 text-white font-semibold py-3 px-6 rounded-lg mb-4  border border-sky-200 ${buttonNewContract ? 'bg-white cursor-not-allowed' : 'bg-white'}`}
					onClick={handleNewContract}
					disabled={buttonNewContract}
				  >
					<img src="/assets/images/newfile.png" alt="New File Image" className="h-12 w-12" />
				  </button>
				  <p className="text-default-text">New <span><p>Contract</p></span></p>
				</div>
				<div className="w-full sm:w-1/2 text-center m-2">
				  <button
					className={`hover:bg-gray-200 text-white font-semibold py-3 px-6 rounded-lg mb-4  border border-sky-200 ${buttonExistingContract ? 'bg-white cursor-not-allowed' : 'bg-default-bg'}`}
					onClick={handleExistingContract}
					disabled={buttonExistingContract}
				  >
					<img src="/assets/images/existingfile.png" alt="Existing File Image" className="h-12 w-12" />
				  </button>
				  <p className="text-default-text">Existing <span><p>Contract</p></span></p>
				</div>
			  </section>
			  <footer className="flex justify-start pt-5">
				<a href="https://scv1-docs.vercel.app/docs/intro/" className="m-2 font-semibold text-default-bt-text hover:underline">
				  About Us
				</a>
			  </footer>
			  {showBalloon && <PopupInfo text={balloonText} closeModal={handleCloseBalloon} isOpen={showBalloon} />}
			</div>
	  
			
	  
		  </div>
		</section>
	  );	  
}