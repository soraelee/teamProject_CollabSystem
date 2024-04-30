const express = require("express");

const fs = require('fs');
const path = require('path');



const app = express();
app.use('/static', express.static('config'));
const session = require("express-session");
const bodyParser = require("body-parser");
app.use( bodyParser.urlencoded({extended:false}) );
const sessionConfig = require("./config/session/session_config");
app.use( bodyParser.json() );
const fileStore=require("session-file-store")(session);
sessionConfig.sessionConfig.store =new fileStore({path : './sessions',ttl:1800,retries:0});

app.use( session(sessionConfig.sessionConfig) );
const cookieParser = require("cookie-parser")
app.use(cookieParser());


//채팅창을 구현하기 위해서
// npm install socket.io -save 소캣을 사용
const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketIo(server);





app.set("views", ["./main_src/views", "./src/auth/views" ,"./src/board/views","./src/calendar/views","./src/contribution/views","./src/information/views","./src/board_code/views"]); //for multiple views folder path
app.set("view engine","ejs");

sessionDirectory="./sessions";
function ensureSessionExists(req, res, next) {
    const sessionFile = path.join(sessionDirectory, `${req.session.id}.json`);
    fs.promises.access(sessionFile, fs.constants.F_OK)
        .then(() => next())
        .catch(() => res.redirect('/logout'));
}
app.use('/auth/loginCheck', ensureSessionExists);


const router = require("./main_src/router/global_router")(app,io,socketIo);
app.use("/", router);


// app.listen( 3000,"192.168.42.142",()=>{ console.log("3000 port server"); });

const directory = './sessions'; // 세션 파일들이 위치한 디렉토리

function deleteNumberedFiles() {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('디렉토리를 읽는 중 에러가 발생했습니다.', err);
      scheduleNextDeletion();
      return;
    }

    let filesDeleted = 0; // 삭제된 파일 수를 추적합니다.
    files.forEach(file => {
      if (file.match(/\.\d+$/)) { // '.숫자' 형식에 매치되는지 확인
        fs.unlink(path.join(directory, file), unlinkErr => {
          if (unlinkErr) {
            console.error(`${file} 파일을 삭제하는 중 에러가 발생했습니다.`, unlinkErr);
          } else {
            console.log(`${file} 파일이 성공적으로 삭제되었습니다.`);
          }
          // 모든 파일 처리 후 다음 삭제 작업을 예약합니다.
          filesDeleted++;
          if (filesDeleted === files.length) {
            scheduleNextDeletion();
          }
        });
      } else {
        filesDeleted++;
        // 모든 파일 처리 후 다음 삭제 작업을 예약합니다.
        if (filesDeleted === files.length) {
          scheduleNextDeletion();
        }
      }
    });

    // 혹시나 모든 파일이 패턴과 매치되지 않는 경우를 대비하여,
    // 여기에서도 다음 삭제 작업을 예약합니다.
    if (files.length === 0) {
      scheduleNextDeletion();
    }
  });
}

function scheduleNextDeletion() {
  setTimeout(deleteNumberedFiles, 60000); // 1분 후 다음 삭제 작업 예약
  setTimeout(deleteJsonFilesIfConditionMet, 60000);
}

//서버를 시작할 때 모든 세션을 삭제하도록 함수 생성
function deleteAllJsonFiles() {
    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error('디렉토리를 읽는 중 에러가 발생했습니다.', err);
        return;
      }
  
      files.forEach(file => {
        if (file.endsWith('.json')) { // .json 확장자 확인
          fs.unlink(path.join(directory, file), unlinkErr => {
            if (unlinkErr) {
              console.error(`${file} 파일을 삭제하는 중 에러가 발생했습니다.`, unlinkErr);
            } else {
              console.log(`${file} 파일이 성공적으로 삭제되었습니다.`);
            }
          });
        }
      });
    });
  }

  function deleteJsonFilesIfConditionMet() {
    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error('디렉토리를 읽는 중 에러가 발생했습니다.', err);
        return;
      }
  
      files.forEach(file => {
        if (file.endsWith('.json')) {
          fs.readFile(path.join(directory, file), 'utf8', (readErr, data) => {
            if (readErr) {
              console.error(`${file} 파일을 읽는 중 에러가 발생했습니다.`, readErr);
              return;
            }
  
            try {
              const jsonData = JSON.parse(data);
              const lastAccessTime = new Date(jsonData.__lastAccess);
              const halfHourAgo = new Date(Date.now() - 30 * 60000); // 30분 전
  
              if (!jsonData.result && lastAccessTime < halfHourAgo) {
                fs.unlink(path.join(directory, file), unlinkErr => {
                  if (unlinkErr) {
                    console.error(`${file} 파일을 삭제하는 중 에러가 발생했습니다.`, unlinkErr);
                  } else {
                    console.log(`${file} 파일이 성공적으로 삭제되었습니다.`);
                  }
                });
              }
            } catch (parseErr) {
              console.error(`${file} 파일의 내용을 파싱하는 도중 에러가 발생했습니다.`, parseErr);
            }
          });
        }
      });
    });
  }




// server.listen( 3000,"192.168.42.142",()=>{ console.log("3000 port server"); 
// deleteNumberedFiles();//서버의 더미숫자 데이터 삭제 함수
// deleteAllJsonFiles();//서버 실행 시 모든 세션 데이터를 삭제
// deleteJsonFilesIfConditionMet();//30분 더미세션 삭제
// });

server.listen( 3000,()=>{ console.log("3000 port server"); 
deleteNumberedFiles();//서버의 더미숫자 데이터 삭제 함수
deleteAllJsonFiles();//서버 실행 시 모든 세션 데이터를 삭제
deleteJsonFilesIfConditionMet();//30분 더미세션 삭제
});

