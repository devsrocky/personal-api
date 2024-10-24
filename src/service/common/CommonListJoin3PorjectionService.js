

const CommonListJoin3ProjectionService = async (Request, SearchKeywords, ReviewModel, JoinStage1, JoinStage2, JoinStage3, Project) => {
    try{

        let pageNo = Number(Request.params.pageNo)
        let PerPage = Number(Request.params.PerPage)
        let SearchValue = Request.params.keyword

        let RowSkip = (pageNo -1 )* PerPage;
        let data;

        if(SearchValue !== "0"){
            data = await ReviewModel.aggregate([
                JoinStage1,
                JoinStage2,
                JoinStage3,
                {$match: SearchKeywords},
                {
                    $facet: {
                        Total: [{$count: 'Total'}],
                        Rows: [{$skip: RowSkip}, {$limit: PerPage}, Project]
                    }
                }
            ])
        }else{
            data = await ReviewModel.aggregate([
                JoinStage1,
                JoinStage2,
                JoinStage3,
                {
                    $facet: {
                        Total: [{$count: 'Total'}],
                        Rows: [{$skip: RowSkip}, {$limit: PerPage}, Project]
                    }
                }
            ])
        }
        return {status: 'success', data: data}
    }catch(err){
        return {status: 'failed', data: err.toString()}
    }
}

module.exports = CommonListJoin3ProjectionService;