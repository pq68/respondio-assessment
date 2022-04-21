const receiveService = require('../util/receive.service');
const responseService = require('../util/response.service');
const userService = require('../services/user.service');
const graphApiService = require('../util/graphapi.service');

const WebhookController = {
	verify: verify,
	message: message,
	setup: setup
}

async function message(req, res) {
	try {
		const body = req.body;
		const entries = body.entry;

		entries.forEach(async(entry) => {
			const event = entry.messaging[0];
			const senderId = event.sender.id;

			// skip no message
			if (!event.message) {
				return;
			}
			
			// get text message
			const msg = await receiveService.getMessage(event.message.text);

			// find and retrieve user
			const user = await userService.getUserBySenderId(senderId);

			if (!user) {
				// user does not exist = first time user
				let userProfile = await graphApiService.callUserAPI(senderId);
				if (userProfile) {
					await userService.create(userProfile);
				}
				responseService.handleGreeting(senderId);
			} else {
				if (event.message.nlp) {
					// greeting nlp
					const greeting = await receiveService.getNlpFirstTrait(event.message.nlp,'wit$greetings');
					if (greeting && greeting.confidence > 0.8) {
						responseService.handleGreeting(senderId);
					}
				}
			}
			
			// handle message
			responseService.handleMessage(senderId, msg);
		});

		return res.status(200).end();

	} catch (error) {
		return res.status(403).send({
			success: false,
			message: error
		});
	}
}

async function verify(req, res) {
	let mode = req.query["hub.mode"];
	let token = req.query["hub.verify_token"];
	let challenge = req.query["hub.challenge"];
	
	if (mode && token) {
		if (mode === "subscribe" && token === process.env.FB_VERIFYTOKEN) {
			console.log("WEBHOOK_VERIFIED");
			return res.status(200).send(challenge);
		} else {
			return res.status(403).end();
		}
	}
}

async function setup(req, res) {
	try {
		if (!process.env.FB_APPID) {
			return res.status(403).send({
				success: false,
				message: 'FB_APPID not found'
			});
		}
		if (!process.env.FB_APPSECRET) {
			return res.status(403).send({
				success: false,
				message: 'FB_APPSECRET not found'
			});
		}
		if (!process.env.FB_PAGEID) {
			return res.status(403).send({
				success: false,
				message: 'FB_PAGEID not found'
			});
		}
		if (!process.env.FB_ACCESSTOKEN) {
			return res.status(403).send({
				success: false,
				message: 'FB_ACCESSTOKEN not found'
			});
		}

		console.log(process.env.FB_APPID);
		console.log(process.env.FB_PAGEID);

		await graphApiService.callSubscriptionsAPI();
		await graphApiService.callSubscribedApps();
		await graphApiService.callNLPConfigsAPI();

		res.status(200).send({
			success: true,
			message: 'done'
		});

	} catch (error) {
		return res.status(403).send({
			success: false,
			message: error
		});
	}
}

module.exports = WebhookController;