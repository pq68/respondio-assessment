const GraphApiService = require('./graphapi.service');
const ProductService = require('./product.service');
const EmailService = require('./nodemailer.service');

const ResponseService = {
    handleGreeting: handleGreeting,
    handleMessage: handleMessage,
}

const MESSAGE_COMMAND = [
	"/desc",
	"/price",
	"/shipping",
	"/buy"
];

const GREETING_LIST = [
    "Hello",
    "How are you doing?",
    "It's great to see you",
    "How are you?",
    "I hope you're having a great day.",
    "I hope you're doing well.",
    "How's it going?",
    "How do you do?"
];

async function handleGreeting(senderId) {
    try {
        // select random from GREETING_LIST
        let greeting = GREETING_LIST[Math.floor(Math.random() * (GREETING_LIST.length - 1))];
        return await GraphApiService.callSendApi(senderId, greeting);
    } catch(e) {
        throw Error('Error ' + e.message);
    }
}

async function handleMessage(senderId, message) {
    try {
        const messageArray = message.split(' ');
        // incorrect message format
        if (messageArray.length < 2) {
            return await GraphApiService.callSendApi(senderId, `Try queries: \n/desc [productsku] \n/price [productsku] \n/shipping [productsku] \n/buy [productsku] \n\nEg. \n/desc 43900`);
        }

        const command = messageArray[0];
        const productSKU = messageArray[1];
        // command not found
        if (!MESSAGE_COMMAND.includes(command)) {
            return await GraphApiService.callSendApi(senderId, `Try queries: \n/desc [productsku] \n/price [productsku] \n/shipping [productsku] \n/buy [productsku] \n\nEg. \n/desc 43900`);
        }
        
        const product = ProductService.getProductById(productSKU);

        if (!product) {
            // product not found
            return await GraphApiService.callSendApi(senderId, `Product SKU '${productSKU}' not found.`);
        } else {
            // reply with product data
            if (command == '/desc') {
                return await GraphApiService.callSendApi(senderId, product.description);
            }
            if (command == '/price') {
                return await GraphApiService.callSendApi(senderId, product.price);
            }
            if (command == '/shipping') {
                return await GraphApiService.callSendApi(senderId, product.shipping);
            }
            // send email notification
            if (command == '/buy') {
                return await EmailService.buyProductNotification(product);
            }
        }
        
    } catch(e) {
        throw Error('Error ' + e.message);
    }
}

module.exports = ResponseService;