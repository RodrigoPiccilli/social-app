const { createHmac } = require("crypto");

const base64UrlEncode = (string) => {
    return Buffer.from(string)
        .toString('base64')    
        .replace(/\+/g, '-')   
        .replace(/\//g, '_')   
        .replace(/=+$/, '');   
};

const base64UrlDecode = (base64UrlString) => {
    let base64String = base64UrlString
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .replace(/=+$/, '');

    const decodedBuffer = Buffer.from(base64String, 'base64');
    return decodedBuffer.toString('utf8');
};


exports.verify = (token, secretKey) => {

    const [headerBase64, payloadBase64, receivedSignature] = token.split('.');

    const hmac = createHmac('sha256', secretKey);

    hmac.update(headerBase64 + "." + payloadBase64);

    const signature = base64UrlEncode(hmac.digest());

    if(signature === receivedSignature) {

        return base64UrlDecode(payloadBase64);
    
    } else {

        throw new Error("Signatures Do Not Match");


    }

}

exports.sign = (payload, secretKey) => {

    const header = {
        "alg": "HS256",
        "typ": "JWT"
    }

    const headerBase64 = base64UrlEncode(JSON.stringify(header));

    const payloadBase64 = base64UrlEncode(JSON.stringify(payload));

    const hmac = createHmac('sha256', secretKey);

    hmac.update(headerBase64 + "." + payloadBase64);

    const signature = base64UrlEncode(hmac.digest());

    return `${headerBase64}.${payloadBase64}.${signature}`; 


}