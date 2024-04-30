window.onload = function() {
  // 서버에서 세션 유효성 검증 실패시 로그인 페이지로 리다이렉트 되도록 설정
  if (window.location.pathname === '/login') {
      alert('Your session has expired. Please log in again.');
  }
  // setInterval(checkSession, 3000); 
  checkSession(); 
//   function checkSession() {
//     fetch('/checkSession')
//         .then(response => response.json())
//         .then(data => {
//             if (data.flag === 1) {
//                 window.location.href = '/auth/loginForm';
//             }
//         })
//         .catch(error => console.error('Error:', error));
//         setTimeout(checkSession, 60000); // 함수 재호출을 위한 setTimeout
// }
fetch('/checkSession', {redirect: 'follow'})  // 리다이렉트 따라가기
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
    })
    .catch(error => console.error('Error:', error));
  if(`<%- data.CONTENT %>`!==undefined){
    const content=document.getElementById("dataContent").innerHTML=`<%= data.CONTENT %>`
  }
  delmessages();
  // setInterval(loadMessages,1000);
  setInterval(function() {
    console.log('Attempting to load messages...');
    loadMessages();
  }, 1000);
  document.getElementById("addButton").disabled = false;

 
    var mdfform = document.getElementById('mdfForm');
    if (mdfform) {
      mdfform.addEventListener('submit', function(event) {
        event.preventDefault();  // 폼의 기본 제출 기능 방지
  
        var formData = new FormData(this);  // 현재 폼의 데이터를 FormData 객체로 생성
        console.log("유저정보저장 패치사용");
        fetch('/information/modify/' + formData.get('id'), {  // id 필드를 사용하여 URL 생성
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          console.log("writeData:", data);
          if (data) {
            alert("정보가 성공적으로 수정되었습니다.");
            myInformation();  // 성공 시 다른 페이지로 리다이렉션하거나, 페이지 내용을 동적으로 업데이트
          } else {
            alert("정보 수정에 실패했습니다.");
            myInformation();
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert("네트워크 오류가 발생했습니다.");
        });
      });
    } else {
      console.error("Form not found");
    }
  


  //
//   setInterval(function() {
//     fetch('/check-session')
//         .then(response => {
//             if (!response.ok) {
//                 window.location.href = '/logout'; // 세션 만료 시 로그아웃 처리
//             }
//         })
//         .catch(console.error);
// }, 5000);
// 주기적으로 세션이 존재하는 지 검사하는 코드
};
//세션 확인
// function checkSession() {
//   fetch('/check-session')
//       .then(response => response.json())
//       .then(data => {
//           if (!data.loggedIn) {
//               console.log('Session expired or user not logged in');
//               // Optionally redirect to login page
//               // window.location.href = '/login.html';
//           } else {
//               console.log('User is still logged in');
//           }
//       })
//       .catch(error => console.error('Error checking session:', error));
// }

// Check session every 5 minutes
//reply_list조건
function fetchReplies(write_No) {
  
  fetch(`/board/reply_List/${write_No}`)
    .then(response => response.json()) // 응답을 JSON 형태로 파싱
    .then(replies => {
      const replyListContainer = document.getElementById('reply_list');
      let count=0;
      replyListContainer.innerHTML = ''; // 기존 내용을 초기화

      replies.forEach(reply => {
        count++;
        // 각 답변 데이터로 HTML 구성
        const replyDiv = document.createElement('div');
        replyDiv.style="border : 1px solid grey;background :#F5F5F5;margin: 10px; padding: 5px;";
        replyDiv.innerHTML = `
          <div>
            <p><strong>ID:</strong> ${reply.ID}</p> 
          </div>
          <div>${reply.CONTENT}</div>
          <hr>
          <strong>Date:</strong> ${new Date(reply.SAVE_DATE).toLocaleDateString()}
          <br>
        `;
        replyListContainer.appendChild(replyDiv); // 생성된 div를 reply_list에 추가
      });
      document.getElementById('replyCount').textContent=count;
    })
    .catch(error => console.error('Error fetching replies:', error));
}
function board_view(num){
  console.log(num)
    fetch(`/board/data/${num}`)
    .then(res=>res.text())
    .then(html =>{
     document.getElementById("dashboard").innerHTML=html;
       // dashboard 업데이트 후에 Observer 활성화
       const num =document.getElementById("write_No").textContent
       fetchReplies(num);
    })
    
 }
 function board(){
    fetch(`/board`)
    .then(res=>res.text())
    .then(html =>{
     document.getElementById("dashboard").innerHTML=html; 
     $('#dataTable').DataTable({
      "lengthMenu": [[3, 5, 10, 25, 50, -1], [3, 5, 10, 25, 50, "All"]],
      "language": {
        "lengthMenu": 'Display <select>'+
          '<option value="3">3</option>'+
          '<option value="5">5</option>'+
          '<option value="10">10</option>'+
          '<option value="25">25</option>'+
          '<option value="50">50</option>'+
          '<option value="-1">All</option>'+
          '</select> records'
      }
    });
     //초기화 리로드 필수
    })
 }

 function board_modify_form() {
  console.log("writeForm동작")
  const userId = document.getElementById("userId").textContent;
  const userWrite_No = document.getElementById("number").textContent;
  // const userId=session.result.name;
  fetch(`/board/modify_form/`+userWrite_No)
    .then(res => res.text())
    .then(html => {
      document.getElementById("dashboard").innerHTML = html;
      if (!window.CKEditor) {
        loadScript('../../../static/ckeditor5-build-classic-41.3.1/build/ckeditor.js', () => {
          modify_board_initializeEditor()
        });
      } else {
        modify_board_initializeEditor()
      }
    });
}
// 변경전
 function board_write_form() {
  console.log("writeForm동작")
  const userId = document.getElementById("userId").textContent;
  // const userId=session.result.name;
  fetch(`/board/write_form/` + userId)
    .then(res => res.text())
    .then(html => {
      document.getElementById("dashboard").innerHTML = html;
      if (!window.CKEditor) {
        loadScript('../../../static/ckeditor5-build-classic-41.3.1/build/ckeditor.js', () => {
          initializeEditor();
        });
      } else {
        initializeEditor();
      }
    });
}
function handleFormSubmit(event) {
  event.preventDefault();
  if (window.editor) {
    document.querySelector('#board_content').value = window.editor.getData();
  }
  const formData = new FormData(event.target);
  console.log("writeFetch동작");
  fetch('/board/write', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log("writeData:", data);
    if (data.success) {
      alert("글이 성공적으로 등록되었습니다.");
      board_view(data.num);
    } else {
      alert("글 등록에 실패했습니다.");
      board(); // 리다이렉트 대신 동적 업데이트 방식으로 변경 필요
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("네트워크 오류가 발생했습니다.");
  });
}
function initializeEditor() {
  ClassicEditor
    .create(document.querySelector('#board_content'), {
      language: 'ko',
      simpleUpload: {
        uploadUrl: '/board/upload'
      }
    })
    .then(editor => {
      window.editor = editor;
      window.CKEditor = true; // CKEditor가 초기화되었음을 표시
      const form = document.getElementById('writeformAc');
            // if (form) {
            //     form.addEventListener('submit', function (event) {
            //         event.preventDefault();
            //         document.querySelector('#board_content').value = editor.getData();  // 에디터의 데이터를 textarea에 설정
            //         handleFormSubmit(event);  // 폼 데이터 처리 함수 직접 호출
            //     });
            // }
            if (form) {
              attachFormSubmitListener(form); // 에디터 데이터 설정과 폼 제출 처리를 위한 리스너 설정
            }
    })
    .catch(error => {
      console.error('Error initializing editor:', error);
    });
}
// board_modify
function modifyFormSubmit(event) {
  event.preventDefault();
  if (window.editor) {
    document.querySelector('#board_content').value = window.editor.getData();
  }
  const formData = new FormData(event.target);
  console.log("writeFetch동작");
  fetch('/board/modify/'+formData.get("writeNo") , {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log("writeData:", data);
    if (data.success) {
      alert("글이 성공적으로 등록되었습니다.");
      board_view(data.num);
    } else {
      alert("글 등록에 실패했습니다.");
      board(); // 리다이렉트 대신 동적 업데이트 방식으로 변경 필요
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("네트워크 오류가 발생했습니다.");
  });
}
function modify_board_initializeEditor() {
  ClassicEditor
    .create(document.querySelector('#board_content'), {
      language: 'ko',
      simpleUpload: {
        uploadUrl: '/board/upload'
      }
    })
    .then(editor => {
      window.editor = editor;
      window.CKEditor = true; // CKEditor가 초기화되었음을 표시
      const form = document.getElementById('modifyformAc');
            // if (form) {
            //     form.addEventListener('submit', function (event) {
            //         event.preventDefault();
            //         document.querySelector('#board_content').value = editor.getData();  // 에디터의 데이터를 textarea에 설정
            //         handleFormSubmit(event);  // 폼 데이터 처리 함수 직접 호출
            //     });
            // }
            if (form) {
              attachFormSubmitListener(form); // 에디터 데이터 설정과 폼 제출 처리를 위한 리스너 설정
            }
    })
    .catch(error => {
      console.error('Error initializing editor:', error);
    });
}
//답글 
function reply_form() {
  // Get the element by its ID
  var replyTr = document.getElementById("trReply");
  var writeNo = document.getElementById("write_No").textContent;

  // Remove the 'trReply' class from the element
  replyTr.classList.remove("trReply");
  fetch("/board/reply_form/"+writeNo)
  .then(res => res.text())
    .then(html => {
      document.getElementById("reply_form").innerHTML = html;
      
    });
  
}
function reply_form_Cencel() {
  // Get the element by its ID
  var replyTr = document.getElementById("trReply");
  document.getElementById("replyText").textContent="";
  // Remove the 'trReply' class from the element
  replyTr.classList.add("trReply");
  
  
  
}
// CREATE TABLE reply_List (
//   id   VARCHAR2(100) NOT NULL,
//   content VARCHAR2(1000) NOT NULL,
//   write_group NUMBER NOT NULL,
//   save_date DATE NOT NULL,
//   CONSTRAINT fk_user_accounts_reply FOREIGN KEY (id)
//     REFERENCES user_accounts (USER_ID)
//     ON DELETE CASCADE
// );
//답글 테이블 조건
function replywriteFormSubmit(event) {
  event.preventDefault();
 
  const formData = new FormData(event.target);
  
  fetch('/board/reply_write/'+formData.get("write_group") , {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log("writeData:", data);
    if (data.success) {
      alert("글이 성공적으로 등록되었습니다.");
      board_view(data.num)
    } else {
      alert("글 등록에 실패했습니다.");
      // 리다이렉트 대신 동적 업데이트 방식으로 변경 필요
      board_view(num)
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("네트워크 오류가 발생했습니다.");
  });
}


document.addEventListener('DOMContentLoaded', function() {
  Maincalendar();
  const container = document.getElementById('dashboard');

  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        const form = document.getElementById('writeformAc');
        if (form && !form.dataset.listenerAdded) {
          attachFormSubmitListener(form);
          form.dataset.listenerAdded = "true"; // 리스너 추가 플래그 설정
        }
      }
    });
  });

  observer.observe(container, {
    childList: true,
    subtree: true
  });

  function attachFormSubmitListener(form) {
    form.removeEventListener('submit', handleFormSubmit); // 기존 리스너 제거
    form.addEventListener('submit', handleFormSubmit); // 새 리스너 추가
  }
//modify_board
const modifyobserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {
      const form = document.getElementById('modifyformAc');
      if (form && !form.dataset.listenerAdded) {
        modify_board_FormSubmitListener(form);
        form.dataset.listenerAdded = "true"; // 리스너 추가 플래그 설정
      }
    }
  });
});

modifyobserver.observe(container, {
  childList: true,
  subtree: true
});

function modify_board_FormSubmitListener(form) {
  form.removeEventListener('submit', modifyFormSubmit); // 기존 리스너 제거
  form.addEventListener('submit', modifyFormSubmit); // 새 리스너 추가
}

//답글 작성
const reply_write_observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {
      const form = document.getElementById('replyForm');
      if (form && !form.dataset.listenerAdded) {
        reply_write_FormSubmitListener(form);
        form.dataset.listenerAdded = "true"; // 리스너 추가 플래그 설정
      }
    }
  });
});

reply_write_observer.observe(container, {
  childList: true,
  subtree: true
});
function reply_write_FormSubmitListener(form) {
  form.removeEventListener('submit', replywriteFormSubmit); // 기존 리스너 제거
  form.addEventListener('submit', replywriteFormSubmit); // 새 리스너 추가
}


//유저임포 변경
const userInfoObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    // 자식 요소의 변화 감지
    if (mutation.type === 'childList') {
      // mdfForm ID를 가진 폼이 새롭게 추가되었는지 확인
      const form = document.getElementById('mdfForm');
      
      // 폼이 존재하고 아직 리스너가 추가되지 않았다면
      if (form && !form.dataset.listenerAdded) {
        // 폼 제출 이벤트 리스너 추가
        userInfoFormSubmitListener(form);
        form.dataset.listenerAdded = "true"; // 리스너 추가 플래그 설정
      }
    }
  });
});
userInfoObserver.observe(container, {
  childList: true,
  subtree: true
});
function userInfoFormSubmitListener(form) {
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // 폼 기본 제출 방지
    var formData = new FormData(form);
    console.log("formData:",formData);
    fetch('/information/modify/'+formData.get('id'), {
      method: 'post',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log("writeData:", data);
      if (data !== undefined && data > 0) {
        //.success
        alert("정보가 성공적으로 수정되었습니다.");
        myInformation(); // 성공 시 필요한 함수 호출
      } else {
        alert("정보 수정에 실패했습니다.");
        myInformation(); // 실패 시 필요한 함수 호출
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert("네트워크 오류가 발생했습니다.");
    });
  });
}

 
});
//코드 저장
const addCodeObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {
      const form = document.getElementById('addCode');
      if (form && !form.dataset.listenerAdded) {
        addCodeFormSubmitListener(form);
        form.dataset.listenerAdded = "true";  // 리스너 추가 플래그 설정
      }
    }
  });
});

addCodeObserver.observe(document.body, {  // container를 document.body로 변경하였습니다. 실제 container에 맞게 조정하세요.
  childList: true,
  subtree: true
});

function addCodeFormSubmitListener(form) {
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(form);
    console.log("formData:", formData);
    fetch('/board_code/upload', {
      method: 'post',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log("writeData:", data);
      if (data === 1) {
        alert("정보가 성공적으로 수정되었습니다.");
        board_code();  // 성공 시 필요한 함수 호출
      } else {
        alert("정보 수정에 실패했습니다.");
        board_code();  // 실패 시 필요한 함수 호출
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert("네트워크 오류가 발생했습니다.");
    });
  });
}



function board_FileInput() {
  var fileInputsDiv = document.getElementById('fileInputs');
  // 파일 간에 줄 바꿈을 위해 새로운 <br> 요소를 생성하여 추가합니다.
  var br = document.createElement('br');
  fileInputsDiv.appendChild(br);
  // 새로운 파일 업로드 필드 추가
  var newInput = document.createElement('input');
  newInput.type = 'file';
  newInput.name = 'image_file_name[]'; // 배열 형태로 이름을 설정합니다.
  newInput.onchange = function() { 
      readfile(this); 
      updateFileCount();
  };
  fileInputsDiv.appendChild(newInput);
  
  // 파일 업로드 필드들의 값을 가진 요소들을 다시 선택합니다.
  var fileInputs = fileInputsDiv.querySelectorAll('input[type="file"]');
  
  // 파일 업로드 필드의 수가 10개가 되면 추가 버튼을 비활성화합니다.
  if (fileInputs.length >= 10) {
      document.getElementById("addButton").disabled = true;
  }
  
  // 파일 업로드 필드들의 값이 비어있지 않은 경우에만 갯수를 세어서 표시합니다.
  function updateFileCount() {
      var nonEmptyCount = 0;
      fileInputs.forEach(function(input) {
          if (input.value) {
              nonEmptyCount++;
          }
      });

      // 파일 업로드 필드들의 값이 비어있지 않은 경우에만 갯수를 세어서 표시합니다.
      if (nonEmptyCount > 0) {
          document.getElementById("filestatus").textContent = `${nonEmptyCount}개의 파일이 선택되었습니다.`;         
      }
  }
}




function loadScript(src, callback) {
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
}

function getEditorData() {
  const data = editor.getData();
  console.log(data);  // 콘솔에 에디터의 현재 내용을 출력
  return data;
}
document.querySelector('form').addEventListener('submit', function() {
  document.getElementById('board_content').value = editor.getData();
});

function deleteboard(num){
  
  fetch(`/board/delete/${num}`)
    .then(res=>res.json())
    .then(html =>{
     
    board();
    })

}
//--------차트
function loadContribution() {     //  구글 chart api 가 로딩이안되니까 여기서 로딩 해버림 그냥
  fetch('/contribution/selectTeam')
      .then(response => response.text())
      .then(data => {
          console.log("codeline");
          document.getElementById('contributionContainer').innerHTML = data;
});
}


function loadMVP(){
  fetch('/contribution/MVP')
      .then(response => response.text())
      .then(data =>{
          console.log("MVP");     
          document.getElementById('contributionContainer').innerHTML = data;
          google.charts.load('current', {'packages':['bar']});
          google.charts.setOnLoadCallback(drawChart_MVP);
      })
}


function selectButton(button) {
let teamName = JSON.parse(button.getAttribute("data-team"));
console.log("teamname:",teamName);

$.ajax({   //ajax 는 controller의 res.json 만 받는다  
  type: "get",
  url: "/contribution/forEachTeamData" ,
  data: { team: teamName },
  success: function(response) {
    
    let contributionsForEachTeam = response.contributionsForEachTeam;
    contributionsForEachTeam=JSON.stringify(contributionsForEachTeam);
    let currenTeam= JSON.stringify(response.currenTeam);
    var piechart = document.getElementById("piechart");
    let html = `
      <a hidden id="teamName" data-teamName='${currenTeam}'></a>
      <a hidden id="ft" data-contributionsForEachTeam='${contributionsForEachTeam}'></a>
      <div id="employee_piechart_ForEachTeam" style="width: 500px; height: 500px; float: left;"></div>
    `;

    piechart.innerHTML = html;
    drawChart_contribution(currenTeam);
  },
  error: function(error) {
    console.error("Error sending data to server:", error);
  }
});
}


function drawChart_contribution(teamName) {
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(function() { //sets a callback function to be executed when the Google Charts library has finished loading

let contributionsForEachTeamData = JSON.parse(document.getElementById("ft").getAttribute("data-contributionsForEachTeam"));
  
var data = google.visualization.arrayToDataTable(contributionsForEachTeamData);
var options = {
    title: teamName
  };
  var chart = new google.visualization.PieChart(document.getElementById('employee_piechart_ForEachTeam'));
  chart.draw(data, options);
});
}

function drawChart_MVP() {

  let tempArr=[];
  let voteArr=[];
  voteArr.push( ['name', 'likes']);
  tempArr=JSON.parse(document.getElementById("voteArr").getAttribute("data-mvpArr"));
  
  for(let i=0; i < tempArr.length ; i++){
      voteArr.push([tempArr[i].userName, tempArr[i].vote ]);
  }
  console.log("voteArr(drawchart):",voteArr);

  var data1 = google.visualization.arrayToDataTable(
      voteArr
  );
  
  var options1 = {
      chart: 
          {
          title: 'Reputation',
          subtitle: '',
          },

      bars: 'vertical' ,// Required for Material Bar Charts.

      series: {
          0: { color: 'red' },   
 
      }
  };

  var chart1 = new google.charts.Bar(document.getElementById('barchart_material'));
  chart1.draw(data1, google.charts.Bar.convertOptions(options1));
}   

//--------차트 끝

//--------달력 시작
function Maincalendar(){
  // document.getElementById("dashboard").innerText="달력";

  fetch(`/calendar`)
  .then(res=>res.text())
  .then(html =>{
    console.log(html)
    const MainCalendar =document.getElementById("MainCalendar")
    // .innerHTML=html;
    MainCalendar.innerHTML = html; 
    MainCalendar.style.width = '1100px';  // 너비 설정
    MainCalendar.style.minWidth='1100px';
    MainCalendar.style.height = '800px'; // 높이 설정
    executeScripts(MainCalendar);
  
  })
}
function calendar(){
  // document.getElementById("dashboard").innerText="달력";

  fetch(`/calendar`)
  .then(res=>res.text())
  .then(html =>{
    console.log(html)
    const dashboard =document.getElementById("dashboard")
    // .innerHTML=html;
    dashboard.innerHTML = html; 
    executeScripts(dashboard);
  
  })
}
function loadScriptSequentially(scripts, index) {
  if (index >= scripts.length) return; // 모든 스크립트 로딩 완료

  const script = scripts[index];
  const newScript = document.createElement('script');
  document.body.appendChild(newScript);
  
  Array.from(script.attributes).forEach(attr => {
    newScript.setAttribute(attr.name, attr.value);
  });

  newScript.onload = () => {
    console.log(`Script loaded: ${script.src || 'inline script'}`);
    loadScriptSequentially(scripts, index + 1); // 다음 스크립트 로드
  };

  newScript.onerror = () => {
    console.error(`Script failed to load: ${script.src}`);
  };

  if (!script.src) {
    newScript.textContent = script.textContent;
  }
}

function executeScripts(container) {
  const scripts = Array.from(container.querySelectorAll("script"));
  loadScriptSequentially(scripts, 0);
}

//==========달력 끝

//유저인포
function userInfomation(){
  fetch('/information')
  .then(res=>res.text())
  .then(html =>{
    // console.log("infoooo", html)
   document.getElementById("dashboard").innerHTML=html;
   executeScripts(dashboard);
  })
}

function teamInformation(){
  fetch('/information/organization')
  .then(res=>res.text())
  .then(html =>{
   document.getElementById("dashboard").innerHTML=html;
   executeScripts(dashboard);
  })
}

function myInformation(){
  fetch('/information/userInfo')
  .then(res=>res.text())
  .then(html =>{
   document.getElementById("dashboard").innerHTML=html;
   executeScripts(dashboard);
  })
}
function loadModifyPage(userId) {
  fetch(`/information/loadModify/${userId}`) // fetch를 사용하여 서버에서 파일 가져오기
  .then(response => response.text()) // 응답 텍스트 반환
  .then(html => {
          // console.log("ooooo userID", userId )
          console.log("load:",html)
          document.getElementById("userInfo-container").innerHTML = html; // div의 내용을 서버에서 받아온 HTML 파일의 내용으로 설정
      })
      .catch(error => {
          console.error('Error:', error);
      });
}

//코드 게시판
function board_code(){
  fetch('/board_code/code_form')
  .then(res=>res.text())
  .then(html =>{
    // console.log("infoooo", html)
   document.getElementById("dashboard").innerHTML=html;
   executeScripts(dashboard);
  })

}
add_code
function boardAddCode(){
  fetch('/board_code/add_code')
  .then(res=>res.text())
  .then(html =>{
    // console.log("infoooo", html)
   document.getElementById("dashboard").innerHTML=html;
   executeScripts(dashboard);
  })

}
function codeTitle(id){
  let contentHTML=document.getElementById("code-list");
  // console.log(contentHTML);
  // console.log("id", id)
  let html=``;
  fetch(`/board_code/code_title/${id}`)
  .then(res => res.json())
  .then((responseData) => {
       console.log("codeTitle:",responseData);
      
      html+=`<h4>${responseData.teamId}팀 게시판</h4>
              <br><br><br><br><br><br>
      `;
  
      responseData.result.forEach(function(item) {
          html += `<a onclick="boardCodeDetail('${item.ID}')">${item.TITLE}</a><br>`;
      });
  contentHTML.innerHTML = html; // Clear previous codes

})
}
function boardCodeDetail(ID){
  fetch("/board_code/boardDetail/"+ID)
  .then(response => response.text()) // 응답 텍스트 반환
  .then(html => {
          // console.log("ooooo userID", userId )
          console.log("load:",html)
          document.getElementById("dashboard").innerHTML = html; // div의 내용을 서버에서 받아온 HTML 파일의 내용으로 설정
          executeScripts(dashboard);
      })
      .catch(error => {
          console.error('Error:', error);
      });
  
}

function insertComment() {
  let commentInput = document.getElementById("comment-input").value;
  let authorInput = document.getElementById("author-input").value;
  let motherArticle=document.getElementById("articleTitle").value;
  if (commentInput.trim() === "" || authorInput.trim() === "") {
      alert("댓글과 아이디를 입력해주세요.");
      return;
  }

  // 서버에 댓글 데이터 전송
  fetch('/board/codeBoard_comments', {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify({
      user_id: authorInput,
      team: 'your_team_value',  //// 로그인 한 사용자의 req.session.team  값 가져와야함
      commentContent: commentInput,
      motherArticle: motherArticle,
      upHit: 0
  })
})
.then(response => {
  if (response.ok) {
      return response.json(); // Parse the JSON response
  } else {
      console.error('댓글 저장에 실패했습니다.');
      throw new Error('댓글 저장에 실패했습니다.'); // Handle error if needed
  }
})
.then(data => {
  console.log('댓글이 성공적으로 저장되었습니다.');
  console.log('Response data:', data); // This will log the data from the server

  // Access the array directly
  const commentsArray = data;
  console.log('Array:', commentsArray); // This will log the array

  // Get the comments container
  const commentsContainer = document.getElementById('comments');

  // Clear existing comments
  commentsContainer.innerHTML = '';

  // Iterate over the comments array and create HTML elements for each comment
  commentsArray.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.classList.add('comment');
      commentElement.innerHTML = `
          <p><strong>User ID:</strong> ${comment.USER_ID}</p>
          <p><strong>Comment:</strong> ${comment.COMMENTCONTENT}</p>
          <!-- Add more details if needed -->
      `;
      commentsContainer.appendChild(commentElement);
  });

  const commentCountElement = document.getElementById('count');
  commentCountElement.textContent = commentsArray.length;
})
.catch(error => {
  console.error('Error:', error);
});

}






//  function write_form() {
//   const userId = document.getElementById("userId").textContent;
//   console.log("jsID", userId);
//   fetch(`/board/write_form/` + userId)
//     .then(res => res.text())
//     .then(html => {
//       document.getElementById("dashboard").innerHTML = html;
//       loadScripts([
//         `../../../static/ckeditor5-build-classic/ckeditor.js`, // CKEditor 스크립트를 로드
//         '../../../static/ckeditor5-build-classic/translations/ko.js'  // 언어팩 로드 (이 경로가 실제와 다를 수 있으므로 확인 필요)
//       ], () => {
//         // 모든 스크립트 로드 후 에디터 초기화
//         ClassicEditor
//           .create(document.querySelector('#board_content'), {
//             language: 'ko',
//             simpleUpload: {
//               uploadUrl: '/upload_file', // 서버 측 업로드 라우트
//               headers: {
//                   'X-CSRF-TOKEN': 'CSRF-Token', // 필요한 경우 CSRF 토큰 추가
//                   'Authorization': 'Bearer <JSON Web Token>' // 필요한 경우 JWT 추가
//               }
//           }
//           })
//           .then(editor => {
//             window.editor = editor;
//           })
//           .catch(error => {
//             console.error('Error initializing editor:', error);
//           });
//       });
//     });
// }

// function loadScripts(scripts, callback) {
//   const loadScript = (index) => {
//     if (index < scripts.length) {
//       let script = document.createElement('script');
//       script.type = 'text/javascript';
//       script.src = scripts[index];
//       script.onload = () => loadScript(index + 1); // 다음 스크립트 로드
//       document.head.appendChild(script);
//     } else {
//       callback(); // 모든 스크립트 로드 완료 후 콜백 실행
//     }
//   };

//   loadScript(0);
// }

 

  function updateStatus(event, element) {
    event.preventDefault();//a링크 이동을 막기 위해 사용
    var status = element.getAttribute('data-status');
    console.log(status)
    document.getElementById("sessionView").innerText=status;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/update-status", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var responseData = JSON.parse(xhr.responseText);
        // console.log("responseData.data.status2",responseData.data.status)
        
        alert("current status changed to:" + responseData.data.status);
        

      }
    };
    xhr.send(JSON.stringify({ status: status }));
    //json
    // var status = document.getElementById('status').value;
    // fetch("/update-status/"+status,{method:"get"})
    //   .then(res=>res.json())
    //   .then(data=>{
    //       console.log("data:",data)
    //       alert(`${data.status} 상태입니다.`)
    //       // document.getElementById("status").textContent=data;
    //   })
  }

  



// function loadSessionData() {
//   fetch('/ForSessions')
//       .then(response => response.json())
//       .then(data => {
//           const onlineUsersDiv = document.getElementById('onlineUsers');
//           onlineUsersDiv.innerHTML = ''; // 기존 내용을 비웁니다.
//           data.userList.forEach(user => {
//               const userStatus = document.createElement('h3');
//               userStatus.textContent = `${user.name} ${user.status}`;
//               onlineUsersDiv.appendChild(userStatus);
//           });
//       })
//       .catch(error => {
//           console.error('Error loading session data:', error);
//       });
// }

//변경
let retryCount = 0;
const maxRetries = 5; // 최대 재시도 횟수를 정의합니다.
function loadSessionData() {
  fetch('/ForSessions')
      .then(response => {
         // 성공적으로 응답을 받으면 재시도 횟수를 리셋합니다.
      retryCount = 0;
      return response.json();
      })
      .then(data => {
        console.log("LoadData:",data);
          const onlineUsersDiv = document.getElementById('onlineUsers');
          onlineUsersDiv.innerHTML = ''; // 기존 내용을 비웁니다.
//---------------------2번쨰 방법
data.dbUserList.forEach(dbuser => {
      const userDiv = document.createElement('div');
              
              const userName = document.createElement('span');
              const bar = document.createElement('span');
              const userStatus = document.createElement('span');
              const statusCircle = document.createElement('span');
              const userStatusView= document.getElementById("sessionView");
              userName.textContent = dbuser.USER_NAME;
              bar.textContent="-";
              let userView="";

  // userList에서 현재 dbuser의 상태를 찾습니다.
  const currentUser = data.userList.find(user => user.id === dbuser.USER_ID);

  // 상태를 설정합니다.
  if (currentUser) {
    statusCircle.className = `status-circle ${getStatusClass(currentUser.status)}`;
    userStatus.textContent = currentUser.status;
    userView = currentUser.status;
  } else {
    statusCircle.className = `status-circle ${getStatusClass("offline")}`;
    userStatus.textContent = "offline";
    userView = "offline";
  }
     userDiv.appendChild(userName);
             userDiv.appendChild(bar);
             userDiv.appendChild(userStatus);
             userDiv.appendChild(statusCircle);
             onlineUsersDiv.appendChild(userDiv);  
        userName.addEventListener('click', function() {
              showmessages(); // currentUser를 display 함수에 인자로 전달
     });        
});

          setTimeout(loadSessionData, 1000);  
             
          
      })
      .catch(error => {
        console.error('Error loading session data:', error);
        
      });
}

function getStatusClass(status) {
  switch (status.toLowerCase()) {
      case 'online':
          return 'online';
      case 'offline':
          return 'offline';
      case 'away':
          return 'away';
      case 'do not disturb':
          return 'do-not-disturb';
      default:
          return 'offline';
  }
}
document.addEventListener('DOMContentLoaded', () => {
  loadSessionData();
});

// document.addEventListener('DOMContentLoaded',()=>{
// setInterval(loadSessionData, 1000);  // 5000 밀리초(5초) 간격으로 반복 호출
// });


//유저목록에 따른 메신저 위치 지정
function updateMessengerPosition() {
  const onlineUsers = document.getElementById('onlineUsers');
  const messenger = document.getElementById('messenger');

  // online-users의 visible 클래스가 있는지 확인하고 위치를 가져옴
  if (onlineUsers.classList.contains('visible')) {
    // getBoundingClientRect() 메소드를 사용하여 요소의 상대 위치 및 크기 정보를 가져옴
    const rect = onlineUsers.getBoundingClientRect();

    // online-users의 하단 위치에 messenger를 배치
    messenger.style.top = `${rect.bottom}px`; // rect.bottom은 online-users의 하단 위치
  } else {
    // online-users가 숨겨져 있으면 messenger를 상단으로 이동
    messenger.style.top = '0px';
  }
}

// 페이지 로드시 위치 업데이트
window.onload = updateMessengerPosition;

// 윈도우 크기 변경에 따라 위치 재조정
window.onresize = updateMessengerPosition;

// online-users의 상태 변경에 따라 위치 업데이트 필요시 호출
function OnlineUsers() {
  const onlineUsers = document.getElementById('onlineUsers');
  onlineUsers.classList.toggle('visible');
  updateMessengerPosition(); // 상태 변경 후 위치 업데이트
}
// msgElement.classList.add('user-message'); // 사용자 메시지 클래스 추가


// -------------------------소캣으로 재구현 필요
//메세지 전송
// function sendMessage() {
//   const message = document.getElementById('chatInput').value;

//   const userName=document.getElementById('userName').textContent;
//   if (message.trim() === '') return;

//   // 메시지를 서버에 전송(post)
//   fetch('/setmessages', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ text: message,userName:userName })
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log('Message sent:', data);
//     document.getElementById('chatInput').value = ''; // 입력 필드 초기화
//     loadMessages(); // 새 메시지를 포함하여 메시지를 다시 로드
//   })
//   .catch(error => console.error('Error sending message:', error));
// }
// //메세지 받기(get)
// function loadMessages() {
//   console.log("load함수 시작")
//   fetch('/getmessages')
//   .then(response => response.json())
//   .then(messages => {
//     console.log("funcMessage:",messages)
//     const chatMessages = document.getElementById('chatMessages');
//     const userName=document.getElementById('userName').textContent;
//     chatMessages.innerHTML = ''; // 기존 메시지를 지우고 새로운 메시지로 대체
//     messages.forEach(message => {
//       const msgElement = document.createElement('div');
//       let msg=``
//       if(userName==message.ID){
//         msgElement.classList.add('user-message');
//         msg+=`<span style="font-size: 16px;">${message.CONTENT}</span>`        
//       }else{
//         msg+=`<span style="font-size: 8px;">${message.ID}</span><br>`
//         msg+=`<span style="font-size: 16px;">${message.CONTENT}</span>`
//       }
//       msgElement.innerHTML = msg;
//       chatMessages.appendChild(msgElement);
//     });
//     chatMessages.scrollTop = chatMessages.scrollHeight; // 스크롤을 아래로
//     setTimeout(loadMessages,3000);
//   })
//   .catch(error => {console.error('Error loading messages:', error);setTimeout(loadMessages, 3000);});
  
// }

// // 페이지 로드 시 메시지 로드
// document.addEventListener('DOMContentLoaded', loadMessages);

//소켓을 이용한 방식
var socket = io();

socket.on('load old messages', function(messages) {
  console.log("Received messages:", messages);
  messages.forEach(message => {
    displayMessage(message);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var chatForm = document.getElementById('chatForm');
  if (chatForm) {
    chatForm.onsubmit = function(e) {
      e.preventDefault();
      var input = document.getElementById('chatInput');
      
      if (input.value) {
        socket.emit('chat message', { CONTENT: input.value, ID: document.getElementById('userName').textContent,TEAM:document.getElementById("team") });
        input.value = '';
      }
    }
  };

  socket.on('chat message', function(msg) {
    displayMessage(msg);
  });
});

function displayMessage(msg) {
  const chatMessages = document.getElementById('chatMessages');
  const msgElement = document.createElement('div');
  let messageContent = `<span style="font-size: 8px;">${msg.ID}</span><br><span style="font-size: 16px;">${msg.CONTENT}</span>`;
  msgElement.innerHTML = messageContent;
  chatMessages.appendChild(msgElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// window.addEventListener('resize', function() {
//   // 현재 창의 너비가 768픽셀보다 크면 페이지를 새로고침
//   if (window.innerWidth > 767.98) {
//     location.reload();
//   }
// });

function updateMessengerPosition() {
  var sidebarWidth = document.getElementById('accordionSidebar').offsetWidth;
  var messenger = document.getElementById('messenger');
  messenger.style.left = sidebarWidth + 'px';
}

// 윈도우 리사이즈 이벤트 또는 사이드바 너비 변경 로직에 이 함수를 호출
// window.addEventListener('resize', updateMessengerPosition);

function delmessages() {
  messenger.style.width = '0';  // 메시지 창 숨기기
  messenger.style.padding = '0'; // 패딩을 0으로 설정
}
function showmessages() {
  messenger.style.width = '300px';  // 메시지 창 숨기기
  messenger.style.padding = '0'; // 패딩을 0으로 설정
}
messenger.addEventListener('transitionend', function() {
  if (messenger.style.width === '0px') {
      messenger.style.display = 'none';  // 너비가 0이면 숨김
  } else {
      messenger.style.display = 'block';  // 그 외의 경우 보임
  }
});
