/**
 * VoxxUp
 */
// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

// MEETUP CODE ----------------------------------------------------------------------------------
const document = require('./templates.json');
const data = require('./data-source.json');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        console.log('inside LaunchIntent');
        const speechText = 'Welcome, Here is a list of all your favourite items. Please select one to explore more.';

        const doc = document["videoOnly"];
        const ds = data["videoOnly"];

        handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: doc,
            datasources: ds,
        });

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
// MEETUP CODE ----------------------------------------------------------------------------------

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// MEETUP CODE ----------------------------------------------------------------------------------
const EventHandler = {
    canHandle(handlerInput) {
        const { request } = handlerInput.requestEnvelope;
        return request.type.startsWith('Alexa.Presentation.APL.UserEvent');
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;// as interfaces.alexa.presentation.apl.UserEvent;
        //  request.arguments will follow following syntax
        //  Since APL argument does not support a map right now, so we can use below formats for different usecase
        //  [key] - item pressed id
        //  [KEY, VALUE] - item type pressed with unique id
        //
        //  Note: VALUE must be unique for each key to identify the item clicked.
        //  Ex:
        //  ["LISTITEM","item1"]
        const touchEventRequest = request.arguments;

        if (touchEventRequest[0] === 'LIST') {
            let dataSourceName = '';
            switch (touchEventRequest[1]) {
                case 'games':
                    dataSourceName = "touchWrapperListAppGame"; break;
                case 'songs':
                    dataSourceName = "touchWrapperListAppSongs"; break;
                case 'food':
                    dataSourceName = "touchWrapperListAppFood"; break;
                case 'movies':
                    dataSourceName = "touchWrapperListAppMovies"; break;

                default:

            }
            const doc = document["touchWrapperListApp"];
            const ds = data[dataSourceName];
            handlerInput.responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                document: doc,
                datasources: ds,
            });
        } else if (touchEventRequest[0] === 'BACK') {
            return LaunchRequestHandler.handle(handlerInput);
        }

        return handlerInput.responseBuilder
            .speak(`You touched ${touchEventRequest[1]}`)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
// MEETUP CODE ----------------------------------------------------------------------------------

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler,
        EventHandler // MEETUP CODE --------------------------Add Entry--------------------------------------------------------
    ) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
