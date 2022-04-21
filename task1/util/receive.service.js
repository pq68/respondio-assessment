const ReceiveService = {
    getMessage: getMessage,
    getNlpFirstTrait: getNlpFirstTrait
}

async function getMessage(message) {
    try {
        return message.trim().toLowerCase();
    } catch(e) {
        throw Error('Error ' + e.message);
    }
}

async function getNlpFirstTrait(nlp, name) {
    try {
        return nlp && nlp.traits && nlp.traits[name] && nlp.traits[name][0];
    } catch(e) {
        throw Error('Error ' + e.message);
    }
}

module.exports = ReceiveService;