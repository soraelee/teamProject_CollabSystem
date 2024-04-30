const contributionDAO=require("../dao/contribution_dao");

const contributionProcess = {
    showPerformanceInfo: async()=>{
        let performanceInfo={};
        performanceInfo=await contributionDAO.contributionProcess.byCodeLine();
        
       

        return performanceInfo;
    },
    showMVP : async ()=>{ 
        let MVPArr=[];
        MVPArr= await contributionDAO.contributionProcess.MVP123();
        let procMVPArr=  []  //{}== object  [] == array
        
       for(let i=0;i<MVPArr.length;i++){
           
            procMVPArr.push({ userName: MVPArr[i].USER_NAME, vote: MVPArr[i].VOTE, codeLine: MVPArr[i].CODELINE });

       }
            
       
        
        return procMVPArr;
    }

}
module.exports={contributionProcess};