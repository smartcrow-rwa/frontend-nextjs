export default async function GET (Request) {
    console.log('API key:'+process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
    const myString = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    //res.status(200).json({ message: myString });

    //return process.env.GOOGLE_API_KEY;

    return new Response('Hi');
};