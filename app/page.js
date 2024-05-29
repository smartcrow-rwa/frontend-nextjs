import Link from 'next/link';
const Home = () => (
	<section className='w-full flex-center flex-col margin'>
	  <h1 className='head_text text-center'>
		Discover Real Estate
		<br className='max-md:hidden' />
		<span className='blue_gradient text-center'> Smart Contracts</span>
	  </h1>
	  <p className='desc text-center margin'>
	  SmartCrow is an easy-to-use smart contract tool to create a digital escrow.  It is designed for real estate professionals and their clients to help facilitate real estate transactions by using blockchain technology, smart contracts, and cryptocurrency.  Create escrow smart contracts for real estate anywhere, anytime, with SmartCrow!
	  </p>
  
	  <div className='flex'>
			<>
			<a href="https://www.smartcrow.info/">
				  <button
					type='button'
					className='black_btn about'
				  >
					About
				  </button>
				</a>
			</>
			<div className="mx-2"></div>
			<>
			<Link href="/checkContract">
				<button
				type='button'
				className='black_btn contract'
				>
				Create Contract
				</button>
			</Link>
			</>
		</div>
  
	</section>
  );
  
  export default Home;