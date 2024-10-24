const ReviewService = async (Request, DataModel) => {
    try{
        let UserDetails = JSON.parse(Request.headers['UserDetails'])
        let postBody = Request.body;
        postBody.UserEmail = UserDetails['UserEmail']
        postBody.UserId = UserDetails['user_id']
        let data = await DataModel.create(postBody)
        return {status: 'success', message: 'Created successfull', data: data}
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}

module.exports = ReviewService;