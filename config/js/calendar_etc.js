function select_form(){
    $("#select_first").fadeIn('slow'); 
    $("#select_modal_wrap").show();
}
function select_hide(){
    $("#select_first").fadeOut('fast'); 
    $("#select_modal_wrap").hide();
}

function teamSelector(team){
    // let team =  JSON.parse(button.getAttribute("value"))
    // let team = $(button).attr("id")
    console.log("team", team)
    let teamName = team.replace(/ /g, '_');
    return fetch(`/calendar/team/${teamName}`)
        .then(res => res.json())
        .then(data => {
            console.log("team data", data);
            let teamArr = [];
            data.forEach((d) => {
                if(d.PRIVATE == 'off'){
                    let dict = {
                        id: `${d.CAL_ID}`,
                        title: d.TITLE,
                        start: d.STARTDATE,
                        end: d.ENDDATE,
                        color: d.COLOR,
                    };
                    teamArr.push(dict);
                }
            });
            console.log(teamArr);
            return teamArr;
        });
}
function privateSch(){
    return fetch('/calendar/private')
        .then(res => res.json())
        .then(data => {
            console.log("private data", data);
            let pList = [];
            data.forEach((d) => {
                let dict = {
                    id: `${d.CAL_ID}`,
                    title: d.TITLE,
                    start: d.STARTDATE,
                    end: d.ENDDATE,
                    color: d.COLOR,
                };
                pList.push(dict);
            });
            console.log(pList);
            return pList;
        });
}