const jwt = require('jsonwebtoken')

exports.EncodeToken = (UserEmail, UserMobile, FullName, UserPhoto, userRole, user_id) => {
    let KEY = '1069R-1069O-1069C-1069K-1060-Y-1060-port-folio-BashMuri-rOcky-DevLoper-10Prog'
    let EXPIRE = {expiresIn: '24h'}
    let PAYLOAD = {UserEmail:UserEmail, UserMobile:UserMobile, FullName:FullName, UserPhoto:UserPhoto, userRole: userRole, user_id:user_id}
    return jwt.sign(PAYLOAD, KEY, EXPIRE)
}

exports.DecodeToken = (token) => {
    try{
        let KEY = '1069R-1069O-1069C-1069K-1060-Y-1060-port-folio-BashMuri-rOcky-DevLoper-10Prog'
        return jwt.verify(token, KEY)
    }catch(err){
        return null
    }
}