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
        'subtype': body.subtype,
        'description': body.description,
        'customer_file_source': body.customer_file_source
    };
    //         'is_value_based': '1'

    try {
        // customer_file_cource types : USER_PROVIDED_ONLY, PARTNER_PROVIDED_ONLY, BOTH_USER_AND_PARTNER_PROVIDED
        const customaudiences = await (new AdAccount(process.env.FB_AD_ACCOUNT)).createCustomAudience(
            fields,
            params
        );
        return getResponseBody(true, "Created custom audience", customaudiences._data, 200);
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