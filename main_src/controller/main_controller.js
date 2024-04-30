// controller.js
module.exports = (app) => {
const service = require('../service/main_service');
const socketTool = app.getSocketIo();
sessionDirectory="./sessions";

const fs = require('fs');
const path = require('path');




const mainAjax ={
  updateStatus: async (req,res) =>{
    const status = req.body.status;
    
    service.processStatus(status)
    .then(result => {
      console.log("result"+result.status);

      let curr_status=result.status;
      req.session.result.status = curr_status;
      console.log(req.session.result.status)

      res.status(200).json({ message: 'Status updated successfully', data: result });
    })
    .catch(err => {
      res.status(500).json({ error: 'Internal server error' });
    });

  },
  // updateStatus: async (req,res) =>{
  //   req.session.status=req.params.status;
  //   res.json({status: req.session.status});
  // }
 
  // fetchGlobalSession: async(req,res) =>{
   
  //   sessionDirectory="./sessions";
    // Function to fetch and log session data
    // Function to read all session files from the session directory
    

    
  // const fetchAllSessionData = async() => {
  //   const currentTime = new Date().toLocaleTimeString();

  //       getAllSessionData(sessionDirectory)
  //           .then(sessionData => {
  //             console.log(`----currentTime: [${currentTime}]-----`);
  //             let userList=[];
  //             let i=0;
              
  //             sessionData.forEach((d) => {
  //             console.log(`Session ${d.result.name}:`, d.result.status);
  //             userList=[i]={};
  //             userList[i].name=d.result.name;
  //             userList[i].status=d.result.status;
  //             i++;
  //             });
              
  //           })  
  //         .catch(error => {
  //             console.error(' there is session that is not defined yet ');
  //             });
              
  //     }
  //then방식을 사용하면 return을 통해 값을 가져올 수 없다. 그래서 함수를 아래와 같이 await으로 변경

  fetchGlobalSession: async(req,res) =>{
    const dbUserList =await service.view.userList();

   
    sessionDirectory="./sessions";
      try{
        const userList=await mainAjax.fetchAllSessionData(sessionDirectory); //initial launch
        // console.log(userList);
        res.json({ userList: userList.userList, dbUserList: dbUserList });
      }catch(err){
        console.error('Error fetching session data:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
     


  },
  getAllSessionData : async (sessionDirectory)=>{
    return new Promise((resolve, reject) => {  //promise object resolve fulfills the promise and called when async operation is successful,
      // and when its called  the Promise transitions to the resolved (or fulfilled) state, and any value passed to resolve is treated as the fulfillment value 
        // reject: This function is used to reject the Promise and is typically called when an error or failure occurs during the asynchronous operation. When reject is called, the Promise transitions to the rejected state, and any value passed to reject is treated as the rejection reason (an error object).
        fs.readdir(sessionDirectory, (err, files) => {// Read all files in the session directory
            if (err) {
                reject(err);
                return;
            }

            // Array to store session data
            const sessionData = [];
            files = files.filter(file => file.endsWith('.json'));
            // Iterate through each file
            files.forEach(file => {
                // Read the contents of each file
                const filePath = path.join(sessionDirectory, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');

                // Parse the JSON data (assuming it's stored as JSON)
                try {
                    const data = JSON.parse(fileContent);
                    sessionData.push(data);
                } catch (error) {
                    console.error('Error parsing session file:', error);
                }
            });

            // Resolve with the array of session data
            resolve(sessionData);
        });
    });
},
// fetchAllSessionData : async (sessionDirectory) => {
//   try {
//       const currentTime = new Date().toLocaleTimeString();
//       const sessionData = await mainAjax.getAllSessionData(sessionDirectory); // 비동기 호출을 await로 처리
//       // console.log("Session Data:", sessionData);

//       let userList = sessionData.map(d => {
//         if (d.result!==undefined) { // result 객체가 있는지 확인
//           console.log("더미데이터")
//         }else{
//           console.log("Processing user:", d.result.name, d.result.status, "/time:", currentTime);
//           return {
//             name: d.result.name,
//             status: d.result.status
//           };
//         }
//       });

//       return { userList }; // userList와 currentTime 함께 반환
//   } catch (error) {
//       console.error('Error fetching session data:', error);
//       throw error; // 상위 try/catch 블록에서 처리하기 위해 에러를 다시 throw
//   }
// }
fetchAllSessionData : async (sessionDirectory) => {
  try {
      const currentTime = new Date().toLocaleTimeString();
      const sessionData = await mainAjax.getAllSessionData(sessionDirectory); // 비동기 호출을 await로 처리
      
      // console.log("Session Data:", sessionData); // 세션 데이터 로깅


      //데이터 삭제에 최적화된 코드가 아님
      // let userList = sessionData.map(d => {
      //   // 옵셔널 체이닝을 사용하여 안전하게 속성에 접근
      //   const name = d.result?.name;
      //   const status = d.result?.status;

      //   if (name && status) {
      //     console.log("Processing user:", name, status, "/time:", currentTime);
      //     return { name, status };
      //   } else {
      //     // console.log("Invalid or incomplete data for entry:", d);
      //     return { name: "Unknown", status: "Unknown" }; // 데이터 불완전 시 기본값 설정
      //   }
      // });

      //데이터 삭제 기능을 추가하기 위해서 형식 변경
      let userList = [];
sessionData.forEach(d => {
    const id = d.result?.userId;
    const status = d.result?.status;

    if (id && status) {
        // console.log("Processing user:", name, status, "/time:", currentTime);
        userList.push({ id, status });
    } else {
        // console.log("Invalid or incomplete data for entry:", d);
        // 여기에서 파일 삭제 로직 추가
        // 예: fs.unlink(`path_to_file/${d.sessionId}.json`);
    }
});

      return { userList }; // userList 반환
  } catch (error) {
      console.error('Error fetching session data:', error);
      throw error;
  }
},
  //세션 체크
  // check_session: (req, res) => {
  //   if (req.session.user) {
  //     res.json({ loggedIn: true });
  // } else {
  //     res.json({ loggedIn: false });
  // }
  // }
}
const process={
  logout: (req,res)=>{
    req.session.destroy();
    res.redirect(`/auth/loginForm`)
  }
}

// const messages={
//   setter:async(req,res)=>{
//     const message = req.body;
//     const result=await service.messages.setter(req.body);
//     console.log("mainctrlSet",result);
//     res.json(result)
//   },
//   getter:async(req,res)=>{
//     const messageContainer=await service.messages.getter();
//     console.log("ctrlGetMsg",messageContainer)
//     res.json(messageContainer)
//   },
// }

const io=socketTool.io;
const socket=socketTool.socketIo;

io.on('connection', (socket) => {
  console.log('A user connected');

  // 데이터베이스에서 이전 메시지 로드 및 클라이언트에 전송
  service.messages.getter().then(messages => {
    socket.emit('load old messages', messages); // 개별 소켓에 과거 메시지 전송
  });

  socket.on('chat message', async (msg) => {
    await service.messages.setter(msg); // DB에 메시지 저장
    io.emit('chat message', msg); // 모든 클라이언트에 메시지 방송
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


return { mainAjax, process };
};