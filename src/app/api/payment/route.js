import axios from 'axios';
        

const coinbaseClient = axios.create({
  baseURL: "https://api.commerce.coinbase.com",
  headers: {
    "X-CC-Api-Key": process.env.NEXT_PUBLIC_COINBASE_API_KEY,
     'Content-Type': 'application/json', 
    'Accept': 'application/json'
  },
});

export const createCoinBasePaymentCharge = async (amount,currency) => {
   try {
      const response = await coinbaseClient.post('/charges', {
        local_price: {
          amount,
          currency,
        },
          description: 'Payment for a product',
           pricing_type: "fixed_price",
      });
      return response.data;
   } catch (error) {
     console.error('error from coinBase func:',error);
   }
}