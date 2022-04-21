# respond.io assessment

Project consist of 2 folders:
1. Task 1
2. Task 2

## Task 1
Service is build with Node.js with Express.js framework. 
MySQL Database in XAMPP is used.

To run the service:
- Run `npm install` to install all required dependencies

### Database
- Setup the database configuration at ``.env/.dev.env`` file. The database needs to be created in order to run the service.
```
HOST=localhost
USER=root
PASSWORD=
DATABASE=respondio-db
PREFIX=respondio_
DIALECT=mysql
```
### Facebook page and application
- Create a facebook page and retrieve the PAGEID
- Create a facebook application and retrieve the APPID and APPSECRET
- Add 'Messenger' product to the application and under Access Tokens, click on Add or Remove Pages to link the facebook page. Check allow "Manage and access Page conversations" in Messenger and retrieve the ACCESSTOKEN
- Setup the facebook page & app configuration at ``.env/.dev.env`` file.
```
FB_APPID=
FB_APPSECRET=
FB_PAGEID=
FB_ACCESSTOKEN=
FB_VERIFYTOKEN=[ANY-VERIFICATION-TOKEN]
```
### SMTP
Gmail SMTP is used in the nodemailer as an alternative to SendGrid because SendGrid account was not approved in time.
- Setup the gmail username and password in the configuration file at ``.env/.dev.env`` file to send email notification
```
EMAIL_USERNAME=
EMAIL_PASSWORD=
```
- To receive the email notification, update the email address at the configuration file
```
EMAIL_NOTIFY=
```
### To enable send email from google account in nodemailer:
- Enable less secure apps - https://www.google.com/settings/security/lesssecureapps
- Disable Captcha temporarily so you can connect the new device/server - https://accounts.google.com/b/0/displayunlockcaptcha

https://support.google.com/mail/answer/7126229?p=BadCredentials&visit_id=637860714319431171-954885423&rd=2#cantsignin&zippy=%2Ci-cant-sign-in-to-my-email-client

### Webhook URL
- `ngrok` is run separately to expose the local development server. Sign up and download `ngrok` at https://ngrok.com/download and run `ngrok http 5001`
- Retrieve the Forwarding URL. Setup the webhook URL in the configuration file at ``.env/.dev.env`` file
```
FB_WEBHOOKURL=[YOUR-FORWARDING-URL-FROM-NGROK]/webhook
```
- Run `[YOUR-FORWARDING-URL-FROM-NGROK]/webhook/setup` to setup the webhook in the facebook app

### Run app locally
Run `npm run start` to start the service. Send message to the facebook page

## Task 2
- Run `node index.js` to run the function
