const TOKEN_COOKIE_NAME = "Howler"

const SECRET_KEY = process.env.SECRET_KEY;

const { verify, sign } = require('./CustomJWT');

exports.TokenMiddleware = (req, res, next) => {

    let token = null;

    if(req.cookies[TOKEN_COOKIE_NAME]) {

        token = req.cookies[TOKEN_COOKIE_NAME];

    } else {

        return res.status(401).json({error: "User Not Authenticated"})

    }

    try {

        const payload = verify(token, SECRET_KEY);

        const payloadJSON = JSON.parse(payload);

        const currentTime = Math.floor(Date.now() / 1000);

        const expTime = payload.exp; 

        if(currentTime > expTime) { // Expired
            
            throw new Error("Expired Token");

        } else {

            req.user = payloadJSON.user;

            next();

        }



    } catch(error) {
        res.status(401).json({error: "User Not Authenticated"})
    }

}


exports.generateToken = (req, res, user) => {

    let payload = {

        user: user,
        exp: Math.floor(Date.now() / 1000) + (60 * 60)

    }

    const token = sign(payload, SECRET_KEY);

    res.cookie(TOKEN_COOKIE_NAME, token, {

        httpOnly: true,
        secure: true,
        maxAge: 10 * 60 * 1000

    }) 

}

exports.removeToken = (req, res) => {

    res.cookie(TOKEN_COOKIE_NAME, "", {
        httpOnly: true,
        secure: true,
        maxAge: -360000
    })

}