function write_form(){
    $("#write_first").fadeIn('slow'); 
    $("#write_modal_wrap").show();
}
function write_form(startdate, enddate){
    console.log("enddate", enddate)
    $("#startDate").val(startdate)
    $("#endDate").val(enddate)
    $("#write_first").fadeIn('slow'); 
    $("#write_modal_wrap").show();
}
function write_hide(){
    $("#write_first").fadeOut('fast'); 
    $("#write_modal_wrap").hide();
    $("#frm").each(function() {
        this.reset();
    });
}

function getList(){
    let eventData = {}
    let start = []
    let end = []
    let arr = $("#frm").serializeArray();
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
            }else{ 
            eventData[data.name] = data.value
        }        
        }
    })
    if (start[1]=== "")
        eventData["start"] = start[0]
    else
        eventData["start"] = start[0]+"T"+start[1]+":00"

    // if (end[0] === "")
    //     eventData["end"] = null;
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
function upload(){
    const eventData = getList();
    console.log("upload eventData", eventData)
    fetch("/calendar/add_schedule", {
        // 페이지 변경 없이 바로 바로 등록
        method : "post",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify( eventData )
    })
    .then(res => res.json() )
    .then( result => {
        if(result === 1){
            alert("일정이 추가 되었습니다.")
            write_hide();

        }
    })
}
