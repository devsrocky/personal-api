

const CommonListJoinService = async (Request, PortfolioModel, SearchKeywords, JoinStage) => {
    try{
        let pageNo = Number(Request.params.pageNo)
        let PerPage = Number(Request.params.PerPage)
        let SearchValue = Request.params.keyword

        // (5 - 1) * 5 
        let RowSkip = (pageNo -1 )* PerPage;
        let data;
        if(SearchValue !== "0"){
            data = await PortfolioModel.aggregate([
                JoinStage,
                {$match: SearchKeywords},
                {
                    $facet: {
                        Total: [{$count: 'Total'}],
                        Rows: [{$skip: RowSkip}, {$limit: PerPage}]
                    }
                }
            ])
        }else{
            data = await PortfolioModel.aggregate([
                JoinStage,
                {
                    $facet: {
                        Total: [{$count: 'Total'}],
                        Rows: [{$skip: RowSkip}, {$limit: PerPage}]
                    }
                }
            ])
        }
        return {status: 'success', data: data}
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}
module.exports = CommonListJoinService;