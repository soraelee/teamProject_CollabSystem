function teamMakeForm_show(){
    $("#first").fadeIn('slow')
    $("#modal_wrap").show()
}
function teamMakeForm_hide(){
    $("#first").fadeOut('fast')
    $("#modal_wrap").hide()
}

function teamMaker(){
    let arr = $("#teamMdf").serializeArray();
    
    let teamArr = []
    let dict;
    arr.forEach((a) => {
        
            if (a.name == 'origin_team'){
                dict={}
                dict.origin_team = a.value
            }        
            if (a.name == 'user_id'){
                dict.user_id = a.value
            }         
            if (a.name == 'teamSelect'){
                dict.team = a.value
                teamArr.push(dict)
            }        
    }) 
    
    let teamModArr = []
    teamArr.forEach((t) => {
        if(t.origin_team !== t.team){
            teamModArr.push(t)
        }
    }) 
    return [teamArr, teamModArr]
}
function submitChanges() {

    const teamModArr = teamMaker()[1];
   
    
    if (teamModArr.length > 0) {
        // 수정된 사용자 정보를 서버에 전송
        fetch('/information/team_mdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teamModArr),
        })
        .then(response => response.json())
        .then(data => {
            if(data > 0){
                alert("수정 완료 되었습니다")
            }
            else {
                alert('수정된 정보가 없습니다.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert('수정된 정보가 없습니다.');
    }
}
function teamMakeBtn() {
    let arr = $("#teamMaker").serializeArray();
    let teamArr = []
    arr.forEach((dict) => {
        if (dict.name === 'id'){
            teamDict = {}
            teamDict.id = dict.value
        }
        if (dict.name === 'team_name'){
            teamDict.team_name = dict.value
        }
        if (dict.name === 'made_date'){
            teamDict.made_date = dict.value
            teamArr.push(teamDict)
        }
    })

    if(teamArr.length > 0){
        fetch('/information/team_make', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(teamArr),
        })
        .then(response => response.json())
        .then(result => {
            if (result > 0){
                alert("팀 생성이 완료되었습니다.")
                teamMakeForm_hide()
                userInfomation();
            }
            else if (result === -1){
                alert("동일한 팀 명은 사용할 수 없습니다.")
            }
            else{
                alert("문제가 발생하였습니다.")
            }
        })
    } else {
        alert("문제가 발생하였습니다.")
    }
}
// 사용자가 선택한 position 값이 유효한지 확인하는 함수
function checkPosition() {
    var position = document.getElementById("position").value;
    if (position !== 'PM' && position !== 'dev' && position !== 'client') {
        alert('올바른 포지션을 선택하세요.'); // 올바르지 않은 포지션일 경우 알림 창 표시
    }
}

  // 이전으로 돌아가기
function returnToUserInfo() {
    // 내 정보 페이지의 내용을 가져와서 userInfo-container 영역에 설정
    fetch("/information/userInfo")
        .then(response => response.text())
        .then(html => {
            document.getElementById("userInfo-container").innerHTML = html;
        })
        .catch(error => console.error("Error:", error));
    return false; // 기본 이벤트 동작을 막음
}

function showAlert(msg) {
    alert(msg);
}