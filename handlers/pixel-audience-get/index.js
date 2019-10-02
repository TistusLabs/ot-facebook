'use strict';

const bizSdk = require('facebook-nodejs-business-sdk');
const AdsPixel = bizSdk.AdsPixel;
const AdAccount = bizSdk.AdAccount;
const CustomAudience = bizSdk.CustomAudience;
const api = bizSdk.FacebookAdsApi.init(process.env.FB_ACCESS_TOKEN);
if (process.env.DEBUG_ON) {
    api.setDebug(true);
}

module.exports.handler = async (event, context) => {

    var body = JSON.parse(event.body);
    const pixelID = event.pathParameters.pixelid;

    let fields, params;
    fields = [
        'code',
    ];
    params = {
    };

    try {
        const customaudiences = await (new AdsPixel(pixelID)).get(
            fields,
            params
        );
        return getResponseBody(true, "Pixel Audience data retrived.", customaudiences._data, 200);
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