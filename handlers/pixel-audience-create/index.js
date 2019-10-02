'use strict';

const bizSdk = require('facebook-nodejs-business-sdk');
const AdAccount = bizSdk.AdAccount;
const CustomAudience = bizSdk.CustomAudience;
const api = bizSdk.FacebookAdsApi.init(process.env.FB_ACCESS_TOKEN);
if (process.env.DEBUG_ON) {
    api.setDebug(true);
}

module.exports.handler = async (event, context) => {

    var body = JSON.parse(event.body);

    let fields, params;
    fields = [
    ];
    params = {
        'name': body.name,
    };

    try {
        const customaudiences = await (new AdAccount(process.env.FB_AD_ACCOUNT)).createAdsPixel(
            fields,
            params
        );
        return getResponseBody(true, "Created pixel audience", customaudiences._data, 200);
    } catch (e) {
        return getResponseBody(false, e.message, {}, 400);
    }
};

function getResponseBody(status, message, obj, errorCode) {
    return {
        statusCode: errorCode,
        body: JSON.stringify(
            {
                "IsSuccess": status,
                "Message": message,
                "Data": obj
            },
            null,
            2
        ),
    };
}