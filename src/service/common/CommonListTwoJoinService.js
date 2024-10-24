
const CommonListTwoJoinService = async (Request, SearchKeywords, DeliveryModel, JoinStage1, JoinStage2, Project) => {

    try {

        let pageNo = Number(Request.params.pageNo)
        let PerPage = Number(Request.params.PerPage)
        let SearchValue = Request.params.keyword

        // let RowSkip = (pageNo - 1) * perPage;
        let RowSkip = (pageNo -1 ) * PerPage
        let data;

        if(SearchValue !== "0"){
            data = await DeliveryModel.aggregate([
                {$match: SearchKeywords},
                JoinStage1,
                {$unwind: '$Order'},
                JoinStage2,
                {$unwind: '$User'},
                {
                    $facet: {
                        Total: [{$count: 'Total'}],
                        Rows: [{$skip: RowSkip}, {$limit: PerPage}, Project]
                    }
                }
               
            ])
        }else{
            data = await DeliveryModel.aggregate([
                JoinStage1,
                {$unwind: '$Order'},
                JoinStage2,
                {$unwind: '$User'},
                {
                    $facet: {
                        Total: [{$count: 'Total'}],
                        Rows: [{$skip: RowSkip}, {$limit: PerPage}, Project]
                    }
                }
            ])
        }
        return {status: 'success', data: data}
        
    } catch (error) {
        return {status: 'failed', data: error.toString()}
    }

}

module.exports = CommonListTwoJoinService;