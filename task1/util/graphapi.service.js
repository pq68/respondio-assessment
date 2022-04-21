const fetch = require('node-fetch');
const { URL, URLSearchParams } = require('url');

const GraphApiService = {
	callSendApi: callSendApi,
	callSubscriptionsAPI: callSubscriptionsAPI,
	callSubscribedApps: callSubscribedApps,
	callNLPConfigsAPI: callNLPConfigsAPI,
	callUserAPI: callUserAPI,
	callUserAccessTokenAPI: callUserAccessTokenAPI,
	callPageAccessTokenAPI: callPageAccessTokenAPI
}

const FACEBOOK_APIURL = `${process.env.FB_APIDOMAIN}/${process.env.FB_APIVERSION}`;

// send page messages
// https://developers.facebook.com/docs/messenger-platform/reference/send-api/
async function callSendApi(senderId, message) {
	try {
		let url = new URL(`${FACEBOOK_APIURL}/me/messages`);

		const pageAccessToken = await callPageAccessTokenAPI();

		url.search = new URLSearchParams({
			access_token: pageAccessToken.access_token
		});

		let response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				messaging_type: "RESPONSE",
				message: {
					text: message
				},
				recipient: {
					id: senderId
				},
			})
		});

		if (!response.ok) {
			console.error(
				`Could not sent message. ${response.statusText}`,
				await response.json()
			);
		}
		
		return response;
	} catch(e) {
        throw Error('Error ' + e.message);
	}
}

// configure webhook to app
// https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge
async function callSubscriptionsAPI() {
	try {
		console.log(`Setting app ${process.env.FB_APPID} callback url to ${process.env.FB_WEBHOOKURL}`);
		
		let fields ="messages, messaging_postbacks";
		
		let url = new URL(`${FACEBOOK_APIURL}/${process.env.FB_APPID}/subscriptions`);
		url.search = new URLSearchParams({
			access_token: `${process.env.FB_APPID}|${process.env.FB_APPSECRET}`,
			object: "page",
			callback_url: process.env.FB_WEBHOOKURL,
			verify_token: process.env.FB_VERIFYTOKEN,
			fields: fields,
			include_values: "true"
		});
		
		let response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" }
		});
		
		if (response.ok) {
			console.log(`Request sent.`);
		} else {
			console.error(`Unable to callSubscriptionsAPI: ${response.statusText}`, await response.json());
		}
	
	} catch(e) {
        throw Error('Error ' + e.message);
	}
}

// manage subscribe page to app
// https://developers.facebook.com/docs/graph-api/reference/page/subscribed_apps
async function callSubscribedApps() {
	try {
		console.log(`Subscribing app ${process.env.FB_APPID} to page ${process.env.FB_PAGEID}`);

		let fields = "messages, messaging_postbacks";

		const pageAccessToken = await callPageAccessTokenAPI();

		let url = new URL(`${FACEBOOK_APIURL}/${process.env.FB_PAGEID}/subscribed_apps`);

		url.search = new URLSearchParams({
		access_token: pageAccessToken.access_token,
		subscribed_fields: fields
		});

		let response = await fetch(url, {
			method: "POST"
		});

		if (response.ok) {
			console.log(`Request sent.`);
		} else {
			console.error(`Unable to callSubscriptionsAPI: ${response.statusText}`, await response.json());
		}
	} catch(e) {
		throw Error('Error ' + e.message);
	}
}

// configure NLP Configs to true
// https://developers.facebook.com/docs/graph-api/reference/page/nlp_configs/
async function callNLPConfigsAPI() {
	try {
		console.log(`Enable Built-in NLP for Page ${process.env.FB_PAGEID}`);

		const pageAccessToken = await callPageAccessTokenAPI();

		let url = new URL(`${FACEBOOK_APIURL}/${process.env.FB_PAGEID}/nlp_configs`);

		url.search = new URLSearchParams({
		  access_token: pageAccessToken.access_token,
		  nlp_enabled: true
		});
	
		let response = await fetch(url, {
		  method: "POST"
		});
	
		if (response.ok) {
		  console.log(`Request sent.`);
		} else {
		  console.warn(`Unable to activate built-in NLP: ${response.statusText}`);
		}
	} catch(e) {
		throw Error('Error ' + e.message);
	}
}

// retrieve user facebook profile with senderID
// https://developers.facebook.com/docs/graph-api/reference/user
async function callUserAPI(senderId) {
	try {
		const pageAccessToken = await callPageAccessTokenAPI();

		let url = new URL(`${FACEBOOK_APIURL}/${senderId}`);

		url.search = new URLSearchParams({
			access_token: pageAccessToken.access_token,
			fields: "first_name, last_name"
		});

		let response = await fetch(url);
		if (response.ok) {
			let userProfile = await response.json();
			return {
				firstname: userProfile.first_name,
				lastname: userProfile.last_name,
				sender_id: senderId
			};
		} else {
			console.warn(`Could not load profile for ${senderId}: ${response.statusText}`, await response.json());
			return null;
		}
	} catch(e) {
		throw Error('Error ' + e.message);
	}
}

// retrieve user access token using user access token provided
// https://developers.facebook.com/docs/facebook-login/guides/access-tokens
async function callUserAccessTokenAPI() {
	try {
		let url = new URL(`${FACEBOOK_APIURL}/oauth/access_token`);

		url.search = new URLSearchParams({
			grant_type: "fb_exchange_token",
			fb_exchange_token: process.env.FB_ACCESSTOKEN,
			client_id: process.env.FB_APPID,
			client_secret: process.env.FB_APPSECRET,
		});

		let response = await fetch(url);
		if (response.ok) {
			let token = await response.json();
			return token;
		} else {
			console.warn(`Could not load user access token: ${response.statusText}`, await response.json());
			return null;
		}

	} catch(e) {
		throw Error('Error ' + e.message);
	}
}

// retrieve page access token using user access token provided
// https://developers.facebook.com/docs/facebook-login/guides/access-tokens
async function callPageAccessTokenAPI() {
	try {
		let url = new URL(`${FACEBOOK_APIURL}/${process.env.FB_PAGEID}`);

		url.search = new URLSearchParams({
			access_token: process.env.FB_ACCESSTOKEN,
			fields: "access_token"
		});

		let response = await fetch(url);
		if (response.ok) {
			let token = await response.json();
			return token;
		} else {
			console.warn(`Could not load page access token: ${response.statusText}`, await response.json());
			return null;
		}

	} catch(e) {
		throw Error('Error ' + e.message);
	}
}

module.exports = GraphApiService;