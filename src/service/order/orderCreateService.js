
const orderCreateService = async (Request, DataModel, OrderNumber) => {
    try{
        let UserDetails = JSON.parse(Request.headers['UserDetails'])
        let postBody = Request.body;
        postBody.UserEmail = UserDetails['UserEmail'];
        postBody.OrderNumber = OrderNumber;
        let data = await DataModel.create(postBody)
        return {status: 'success', message: 'Created successfull', data: data}
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}

module.exports = orderCreateService;