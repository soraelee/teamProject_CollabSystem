function modify_form(eventDict, pCh){
    $("#modify_first").fadeIn('slow'); 
    $("#modify_modal_wrap").show();
    $("#mdfId").val(eventDict.id)
    $("#mdftitle").val(eventDict.title)
    $("#mdfcolor").val(eventDict.color)
    $("#mdfprivate").prop('checked', pCh)

    if(eventDict.start.indexOf("T") != -1){
        $("#mdfstart").val(eventDict.start.split("T")[0])
        $("#mdfstartTime").val(eventDict.start.split("T")[1].split("+")[0])
    }else {
        $("#mdfstart").val(eventDict.start)
    }
    if(eventDict.end.indexOf("T") != -1){
        $("#mdfend").val(eventDict.end.split("T")[0])
        $("#mdfendTime").val(eventDict.end.split("T")[1].split("+")[0])
    }else {
        $("#mdfend").val(eventDict.end)
    }
}

function modify_hide(){
    $("#modify_first").fadeOut('fast'); 
    $("#modify_modal_wrap").hide();
    $("#mdf").each(function() {
        this.reset();
    });
}

async function modify(eventArr){
    
    await fetch("/calendar/modify_schedule", {
        method : "put",
        headers : {"Content-Type" : "application/json"},
        body:JSON.stringify(eventArr)
    })
    .then(res => res.json() )
    .then( result => {
        if(result === 1)
            alert("일정이 변경되었습니다.")
        modify_hide();
    })
}
function mdfgetList(){
    let eventData = {}
    let start = []
    let end = []
    let arr = $("#mdf").serializeArray();
    console.log("arr", arr)
    arr.forEach((data) => {
        if(data.name ==="title"&& data.value ===""){
            alert("일정 내용을 확인해주세요.")
        }else if(data.name === "startDate"&& data.value ===""){
            alert("날짜를 확인해주세요")
        }else {
            if(data.name ==="startDate" || data.name ==="startTime" ){
                start.push(data.value)
            }
            else if(data.name ==="endDate" || data.name ==="endTime" ){
                end.push(data.value)
            }else 
            eventData[data.name] = data.value
        }
    })
    if (start[1]=== "")
        eventData["start"] = start[0]
    else
        eventData["start"] = start[0]+"T"+start[1]+":00"

    if (end[1] === ""){
        if(end[0] === ""){
            eventData["end"] = "";
        }else{
            eventData["end"] = end[0]
        }
    }
    else
        eventData["end"] = end[0]+"T"+end[1]+":00"

    return eventData;
}

function eventModify(eventArr){ //드래그 수정 이벤트

    eventArr.forEach((data)=> {
        if (data.start.indexOf("+") != -1){
            data.start = data.start.split("+")[0]
        }
        if (data.end.indexOf("+") != -1){
            data.end = data.end.split("+")[0]
        }
    })
    // console.log("")
    console.log("실행ㅇㅇㅇㅇㅇ", eventArr)
    fetch("/calendar/drag_modify", {
        method : "put",
        headers : {"Content-Type" : "application/json"},
        body:JSON.stringify(eventArr)
    })
    .then(res => res.json())
    .then(result => {
        console.log("drag Modify", result)
    })
}
function write_delete(dict){
    const eventDict = dict
    if (eventDict.start.indexOf("+") != -1){
        eventDict.start = eventDict.start.split("+")[0]
    }
    if (eventDict.end.indexOf("+") != -1){
        eventDict.end = eventDict.end.split("+")[0]
    }

    fetch("/calendar/write_delete", {
        method : "delete",
        headers : {"Content-Type" : "application/json"},
        body:JSON.stringify(eventDict)
    })
    .then(res => res.json())
    .then(result => {
        console.log("del result", result)
        if(result === 1)
            alert("일정이 삭제되었습니다")
        modify_hide();
    })
}