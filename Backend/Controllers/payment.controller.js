import { request } from "express";


const khaltiInitiate = async ()=>{
var options = {
    'method': 'POST',
    'url': 'https://dev.khalti.com/api/v2/epayment/initiate/',
    'headers': {
    'Authorization': 'key live_secret_key_68791341fdd94846a146f0457ff7b455',
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    "return_url": "http://example.com/",
    "website_url": "https://example.com/",
    "amount": "1000",
    "purchase_order_id": "Order01",
    "purchase_order_name": "test",
    "customer_info": {
        "name": "Ram Bahadur",
        "email": "test@khalti.com",
        "phone": "9800000001"
    }
    })

};
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
}

export {khaltiInitiate}