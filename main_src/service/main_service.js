const dao=require("../dao/main_dao")
const processStatus = (status) => {


    // Perform any necessary operations here
    return new Promise((resolve, reject) => {
      // Simulate asynchronous operation
      setTimeout(() => {
        resolve({ status: status });
      }, 10);
    });
  };

  const view={
    userList:async()=>{
      const userList= await dao.view.list();
      return userList;
    }
  }
  const messages={
    setter:(text)=>{
      const result=dao.messages.setter(text);
      // console.log("serSetMsg:",result);
      return result;
    },
    getter:async(req,res)=>{
      let result=await dao.messages.getter();
      result=timeModify(result);
      return result;
    },
  }
  //시간 변경
  const timeModify=(list)=>{
    list=list.map((data)=>{
      data.PDATE=data.PDATE.toLocaleString();
      return data;
    })
    return list;
  }


  module.exports={messages,processStatus,view}
  