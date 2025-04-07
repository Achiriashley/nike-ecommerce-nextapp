import axios from "axios";
import { BASE_URL, transactionId } from "./constants";

export const  makePayment = async(products, totalAmount) => {

    const api_token = "sand_SP7SdVsJ67SX6al7pAHfy4tWBTfV2n";
    const api_user = "6e1250ec-4188-4d9c-9838-f17a0467fd8b";
    const api_password = "297056d5-9fa3-4e46-88dc-a631dac247e5";

    const credentials = btoa(`${api_user}:${api_password}`);
    const authorizations = `Basic ${credentials}`;

    const config = {
        headers: {
            "x-api-key": api_token,
            mode : "test",          
            "Content-Type": "application/json",
            Authorization: authorizations,
        },
    }

    const items = products.map(product => {
        return {
            "price_description": {
                "unit_amount": product.price 

            },
            "product_description": {
                "name": product.title,
                "image_url": product.image,
                "about_product": product.description
            },
            "quantity": 1,
        }
    })


    const payload = {
    "total_amount": totalAmount,
	"cancel_url":"https://example.com/cancel",
	"success_url":"https://example.com/success",
	"currency":"XAF",
	"mode":"payment",
	"transaction_id":transactionId,
	"return_url":"https://webhook.site/d457b2f3-dd71-4f04-9af5-e2fcf3be8f34",
    "notify_url":"https://webhook.site/d457b2f3-dd71-4f04-9af5-e2fcf3be8f34",
    items,
	"meta":{
		"phone_number_collection":false,
		"address_collection":false
	}
}


let data = null;
//sending payment request

await axios.post( `${BASE_URL}/api/gateway/checkout/initialize`, payload,config).then(result => {
    console.log('Mobile payment result', result.data.data.redirect);
    data = result.data.data.redirect;
}).catch(error => {
    console.log ('error for mobile payment', error);
});

return data;
}