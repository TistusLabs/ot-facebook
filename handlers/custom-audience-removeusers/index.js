'use strict';

const bizSdk = require('facebook-nodejs-business-sdk');
const crypto = require('crypto');
const AdAccount = bizSdk.AdAccount;
const CustomAudience = bizSdk.CustomAudience;
const api = bizSdk.FacebookAdsApi.init(process.env.FB_ACCESS_TOKEN);
if (process.env.DEBUG_ON) {
    api.setDebug(true);
}

module.exports.handler = async (event, context) => {

    var body = JSON.parse(event.body);

    let params;
    params = {
        "payload": {
            "schema": [
                "FN",
                "LN",
                "EMAIL"
            ],
            "data": [
                [
                    getHashValue(body.fname, "FN"),
                    getHashValue(body.lname, "LN"),
                    getHashValue(body.email, "EMAIL")
                ]
            ]
        }
    };

    try {
        const newuser = await (new CustomAudience("6129734888036")).deleteUsers(
            params
        );
        return getResponseBody(true, "User removed from the custom audience collection.", newuser._data, 200);
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

function getHashValue(value, key) {
    return crypto.createHmac('sha256', key)
        .update(value)
        .digest('hex');
}