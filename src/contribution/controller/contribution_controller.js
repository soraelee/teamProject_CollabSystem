const service = require("../service/contribution_service")

const ContributionView = {
 
    selectTeam: async(req,res) =>{
        performanceInfo= await service.contributionProcess.showPerformanceInfo();
       
      
       
        let teamList=[];

        for (let j=0 ; j< performanceInfo.length;j++){
            if(performanceInfo[j][0]==null){
                teamList.push(" (might be used for client)");
            }
            teamList.push(performanceInfo[j][0].TEAM);
        }

    
        res.render("contribution_graph_ForEachTeam",{teamList});   //ajax 는 res.json 만 받는다  
        

    },
    showMVP: async(req,res) =>{
        let tempArr = [];  // it holds whole data
        let MVPArr=[];  // it will holds only top 3 data
        tempArr = await service.contributionProcess.showMVP();
        for(let i=0 ; i< 3 ; i++){
            MVPArr.push(tempArr[i]);
        }
        console.log("MVPArr:", MVPArr);
        res.render("MVP_View",{MVPArr});
    }
    
       //mainView: async (req,res) =>{   // not being used
    //     let performanceInfo=[];
    //     performanceInfo= await service.contributionProcess.showPerformanceInfo();
    //     console.log("performanceInfo1:",performanceInfo[0][0].TEAM);

    //     let teamList=[];
    //     for (let j=0 ; j< performanceInfo.length;j++){
    //         if(performanceInfo[j][0]==null){
    //             teamList.push(" (might be used for client)");
    //         }
    //         teamList.push(performanceInfo[j][0].TEAM);
    //     }

    //     let contributionsByRound = []; // whole 
    //     for(let i=0; i<performanceInfo.length;i++){
    //         let contributionsForRound=[["Employee", "contributions"]];  //each graph     // doesnt matter what to put but its essential the 0 index must be existing ;
    //         for(let j=0 ; j< performanceInfo[i].length;j++){
    //             contributionsForRound.push([  performanceInfo[i][j].USER_NAME , performanceInfo[i][j].CODELINE])
                
    //         }
            
    //         contributionsByRound.push(contributionsForRound);
            
    //     }   
       
      
      
    //    console.log("teamList:"+teamList);
        
       
    //     res.render("contribution_graph",{ contributionsByRound , teamList});
    // },

    
};

const contributionProcess={
    forEachTeamData: async(req,res) =>{
       
        let tempTeam=req.query.team;  // replace it with req.query.team (replaced)

       
        
        let curr_team;
        let contributionsForEachTeam=[["Employee", "contributions"]];
        for (let i=0 ; i< performanceInfo.length;i++){
                         
            if(performanceInfo[i][0].TEAM==tempTeam ){
                curr_team=performanceInfo[i][0].TEAM


                for(let j=0; j<performanceInfo[i].length;j++){
                    contributionsForEachTeam.push([performanceInfo[i][j].USER_NAME , performanceInfo[i][j].CODELINE]);

                }  
            }

            
        }


         console.log("req.query.team:",req.query.team);
         console.log("tempTeam",tempTeam);
         
        console.log("contributionsForEachTeam:::",contributionsForEachTeam)
        res.json({ contributionsForEachTeam ,currenTeam: curr_team});
        

    }
}
module.exports={ContributionView,contributionProcess};