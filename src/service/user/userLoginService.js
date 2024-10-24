const { EncodeToken } = require("../../utility/TokenHelper");

const userLoginService = async (Request, DataModel) => {
    try{
        let PostBody = Request.body;
        let UserCount = await DataModel.aggregate([
            {$match: PostBody},
            {$project: { _id: 1, email: 1, mobile: 1, fullName: 1, userPhoto: 1, profileStatus:1, userRole:1}}
            
        ])
        if(UserCount.length> 0){
            if(UserCount[0]['profileStatus'] === 'approved'){
                // Create token
                let token = await EncodeToken(UserCount[0]['email'], UserCount[0]['mobile'], UserCount[0]['fullName'], UserCount[0]['userPhoto'], UserCount[0]['userRole'], UserCount[0]['_id'])

                return {status: 'success', token:token, UserDetails: UserCount[0]}
            }
            return {status: 'pending',  message: 'Before login approve your profile by email verification'}
        }else{
            return {status: 'Unauthorized', message: 'It\'s seems to be you aren\'t authorize user'}
        }
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}
module.exports = userLoginService;