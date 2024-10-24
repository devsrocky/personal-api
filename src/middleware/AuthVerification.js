const { DecodeToken } = require("../utility/TokenHelper")

module.exports = (req, res, next) => {
    let token = req.headers['token']
    if(!token){
        token = req.cookies['token']
    }
    let decoded = DecodeToken(token)
    if(decoded === null){
        res.status(400).json({status: 'failed', message: 'Token decoded failed!'})
    }else{
        req.headers['UserDetails'] = JSON.stringify(decoded)
        next()
    }

}