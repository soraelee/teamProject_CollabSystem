
(function(){
  $(function(){
  // 이벤트 처리 로직

let allList; //팀별 스케줄러 선택 시 모든 스케줄을 가진 List
let pList; //개인 스케줄
var calendarEl = document.getElementById('calendar');
var calendar = new FullCalendar.Calendar(calendarEl, {

  googleCalendarApiKey: '',
  customButtons: {
    addScheduleBtn: {
      text: "일정 추가하기",
      click: async function () {

        await write_form();
        await $("#uploadBtn").off().on("click", () => {
          const eventData = getList();
          calendar.addEvent(eventData)
          allList.push(eventData)
          if(eventData.private == 'on'){
            pList.push(eventData)
          }
        })
      }
    },
    selectTeamBtn: {
      text: "Team",
      click: async function () {
        await select_form()

        var eventList = calendar.getEvents();

        $(".teamBtn").off().on("click", async (teamBtn) => {
          let teamName = teamBtn.target.id; 
          let teamData = await teamSelector(teamName)
          eventList.forEach((d) => {
            //구글 캘린더의 공휴일은 제외하고 모두 지우기
            if (d._def.url == "") {
              d.remove();
            }
          })
          teamData.forEach((d) => {
            calendar.addEvent(d)
          })
          select_hide()
        })
        
        $("#AllSch").off().on("click", () => {
          eventList.forEach((d) => {
            //구글 캘린더의 공휴일은 제외하고 모두 지우기
            if (d._def.url == "") {
              d.remove();
            }
          })
          allList.forEach((d) => {
            calendar.addEvent(d)
          })
          select_hide()
        })
      }
    },
    selectPrivate : {
      text : 'personal',
      click : async function(){
        var eventList = calendar.getEvents();
        eventList.forEach((d) => {
            //구글 캘린더의 공휴일은 제외하고 모두 지우기
            if (d._def.url == "") {
              d.remove();
            }
          })
          pList.forEach((d) => {
            calendar.addEvent(d)
          })
          select_hide()
        }
      }
  },
  headerToolbar: {
    left: 'title',
    center: '',
    right: 'prev,next today,addScheduleBtn,selectTeamBtn,selectPrivate,multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
  },
  
  initialView: 'dayGridMonth',
  navLinks: true, // can click day/week names to navigate views
  selectable: true,
  selectMirror: true,
  select: async function (arg) {
    await write_form(arg.startStr, arg.endStr);

    await $("#uploadBtn").off().on("click", () => {
      const eventData = getList();
      calendar.addEvent(eventData)
      //버블링 현상이 있어 off 후 on
      allList.push(eventData)
      if(eventData.private == 'on'){
            pList.push(eventData)
          }
    })
  },

  // 내부를 일정을 작성할 수 있는 폼으로 구성하기

  eventClick: async function (arg) {
    eventDict = {
      id: arg.event.id,
      title: arg.event.title,
      start: arg.event.startStr,
      end: arg.event.endStr,
      color: arg.event.backgroundColor,
      url: arg.event.url,
    }
    if (eventDict.url === ''){
      let pCh = false
      if(pList.length > 0){
        pList.forEach((p) => {
          if (p.id === eventDict.id){
            pCh = true
            return pCh
          }
        })
      }
      eventDict.private = pCh
      modify_form(eventDict, pCh)
                      
      await $("#modifyBtn").off().on("click", () => {
        const newData = mdfgetList()

        let eventArr = [eventDict, newData]
        
        modify(eventArr)
        calendar.addEvent(newData)
        arg.event.remove()
        
        pList = pList.filter((data) => data.id != eventDict.id)
        if(newData.private == 'on'){
          pList.push(newData)
        }
        allList = allList.filter((data) => data.id != eventDict.id)
        allList.push(newData)
      })

      $("#deleteBtn").off().on("click", () => {
        if (confirm('정말 삭제하시겠습니까?')) {
          write_delete(eventDict)
          arg.event.remove()

          pList = pList.filter((data) => data.id != eventDict.id)
          allList = allList.filter((data) => data.id != eventDict.id)
        }
      })
    }
    // arg.event.jsEvent.cancelBubble = true; 
    // arg.event.jsEvent.preventDefault(); 
    // // 수정 또는 삭제 할 수 있는 부분
  },
  editable: true, //옮기기 -> 수정시 데이터도 변경되어야 하는 부분 확인

  eventDrop: function (info) {
    oldEvent = {
      id: info.oldEvent.id,
      title: info.oldEvent.title,
      start: info.oldEvent.startStr,
      end: info.oldEvent.endStr,
      url: info.oldEvent.url,
    }
    newEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      color: info.event.backgroundColor,
      url: info.event.url,
    }
    const eventArr = [oldEvent, newEvent]
    if (oldEvent.url.length > 0 ){
      alert("수정이 불가능한 일정입니다")
      info.revert();
    }else {
      if (!confirm("변경하시겠습니까?")) {
        info.revert();
      } else{
        eventModify(eventArr);
        pList.forEach((p) => {
          if(p.id === oldEvent.id){
            pList = pList.filter((data) => data.id != oldEvent.id)
            pList.push(newEvent)
          }
        })
        allList = allList.filter((data) => data.id != oldEvent.id)
        allList.push(newEvent)
      }
    }
  },
  dayMaxEvents: true,
  eventSources: [
    {
      events: async function () {

        let list = []

        await fetch(`/calendar/eventList`)
          .then(response => response.json())
          .then(data => {
            data.forEach((d) => {
              let dict = {}
              dict.id = `${d.CAL_ID}`
              dict.title = d.TITLE
              dict.start = d.STARTDATE
              dict.end = d.ENDDATE
              dict.color = d.COLOR

              list.push(dict)
              
            })
          });
        console.log("list", list)
        pList = await privateSch();
        allList = list
        console.log("pList", pList)

        return list;
      },

    },
    {
      googleCalendarId: "ko.south_korea#holiday@group.v.calendar.google.com",
      color: "white",
      textColor: "red",
    }
  ]
});
calendar.render();
});
})();
