
const userOTPVerificationService = async (Request, DataModel, OTPModel) => {
    try{
        let UserEmail = Request.params.email;
        let UserOTP = Request.params.otp;
        let UserCount = await DataModel.aggregate([{$match: {email: UserEmail}}, {$count: 'count'}])
        let OTPMatch = await OTPModel.aggregate([{$match: {UserOTP: UserOTP}}, {$count: 'count'}])
        if(UserCount[0]['count'] === 1){
            if(OTPMatch[0]['count']){
                await OTPModel.updateOne({UserEmail: UserEmail, UserOTP: UserOTP}, {UserOTP: 'x-end', OTPStatus: 'verified'})
                return true
            }
        }
        // return {status: 'Unauthorized', message: 'It seems to be you aren\'t authorize user'} 
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}
module.exports = userOTPVerificationService;