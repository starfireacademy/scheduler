var _JsonData;
var createXLSLFormatObj = {};
var databuf={};
function readdata(){
    readspreadsheet();

    //fetch('C:\\Users\\jayru\\PythonProject\\scheduler-master\\scheduler-master\\InputSpreadsheet.xlsx').then(function (res) {
    
    fetch('https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vS2ZzcLUznz2iZzYulR5Xm65iy-xg_YsFCUnLms3F_Glw7-PM-kBt8Ndas_D3t11-2KBhAWpdRpKz1G/pub?output=xlsx').then(function (res) {
    
        /* get the data as a Blob */
        if (!res.ok) throw new Error("fetch failed");
        return res.arrayBuffer();
    })
    .then(function (ab) {
        /* parse the data when it is received */
        var data = new Uint8Array(ab);
        var workbook = XLS.read(data , {
            type: "array"
        });
        //console.log("Workbook:");
        //console.log(workbook);
        /* *****************************************************************
        * DO SOMETHING WITH workbook: Converting Excel value to Json       *
        ********************************************************************/
        var first_sheet_name = workbook.SheetNames[0];
        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];
        //console.log(worksheet);
        _JsonData = XLSX.utils.sheet_to_row_object_array(worksheet);
        /************************ End of conversion ************************/
    
        //console.log(_JsonData);
        
        ProcessExcel();
    });
    
}

var days = {};
var teacher_info = {};
var final_teachers = {};  
var day1 = [];
var day2 = [];
var day3 = [];
var day4 = [];
var day5 = [];
var day6 = [];
var day7 = [];
var subjects = [];
var teachers = [];
var r = 0;
var time = 0;

var dayNamelst = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function ProcessExcel() {
    //Read all rows from First Sheet into an JSON array.
    var excelRows = _JsonData;

    for (var i = 0; i < excelRows.length; i++) {
        //Add the data row.
        if(excelRows[i]["Teacher Name"]!=null) {
            //////console.log("Fetching Teacher Names");
            teachers.push(excelRows[i]["Teacher Name"]);
            if ( r > 0) {
                days = {
                'monday': day1,
                'tuesday': day2,
                'wednesday': day3,
                'thursday': day4,
                'friday': day5,
                'saturday': day6,
                'sunday': day7
                }
            
                teacher_info = {'days':days,
                        'subs': subjects}
                final_teachers[teachers[r - 1]] = teacher_info;
                //////console.log("######"+subjects);
            }
            r = r + 1;
            time = 0;
            days = [];
            day1 = [];
            day2 = [];
            day3 = [];
            day4 = [];
            day5 = [];
            day6 = [];
            day7 = [];
            subjects = [];
        }
        time = 0;
        
        for(var s=0; s<subNameLst.length; s++){
            if (excelRows[i][subNameLst[s]]) {
                subjects.push(subNameLst[s]);
            }    
        }

        // ////console.log(excelRows[i]["Time of Day"]);
        if (excelRows[i]["Monday"]) {
            day1.push(excelRows[i]['Time of Day']);
        }
        if (excelRows[i]["Tuesday"]) {
            day2.push(excelRows[i]['Time of Day']);
        }
        if (excelRows[i]["Wednesday"]) {
            day3.push(excelRows[i]["Time of Day"]);
        }
        if (excelRows[i]["Thursday"]) {
            day4.push(excelRows[i]["Time of Day"]);
        }        
        if (excelRows[i]["Friday"]){
            day5.push(excelRows[i]["Time of Day"]);
        }
        if (excelRows[i]["Saturday"]){
            day6.push(excelRows[i]["Time of Day"]);
        }
        if (excelRows[i]["Sunday"]){
            day7.push(excelRows[i]["Time of Day"]);
        }
    }

    days = {'monday': day1,
            'tuesday': day2,
            'wednesday': day3,
            'thursday': day4,
            'friday': day5,
            'saturday': day6,
            'sunday': day7}
    teacher_info = {'days':days,
                    'subs': subjects}
    final_teachers[teachers[teachers.length-1]] = teacher_info; 

    tchNameLst = Object.keys(final_teachers);
    
    sendButtonCondition();
    fillSubjectsName();
    fillTeachersName();
    fillTime();
    ////console.log("sendButton for the win");
    ////console.log($("#sendButton"));
    
    ////console.log("This is The Cool Stuff:");
    ////console.log(final_teachers["Adrian Phillips "]["subs"]);
}

//////////////////////////////////////////
//////fill up season dropdown//////////////

var seasonSub = {'ssu':['summer1', 'summer2','summer3'],
                        'ssp':['spring1', 'spring2','spring3'],
                        'sw':['winter1', 'winter2','winter3'],
                         'sf':['fall1','fall2','fall3']}                   
var wsName = "";
function fillSeason(){
    ////console.log("Its working");
    ////console.log($("#SeasonTitle")[0].value);
    $("#getSeason").empty();
    if($("#SeasonTitle")[0].value!=null){
        options = seasonSub[$("#SeasonTitle")[0].value];
        var selElement = document.getElementById('getSeason');
        ////console.log(options)
        
        optionTitle = document.createElement("option");
        
        optionTitle.selected = 'true';
        optionTitle.text='--SubSeasons--';
        selElement.add(optionTitle);
        for(var i=0; i<options.length; i++)
        {
            optionVal = document.createElement("option");
            optionVal.value = "sub"+(i+1);
            optionVal.text = options[i];
            selElement.add(optionVal);

        }
    }
}
function getWsName(){
    wsName = $("#getSeason")[0].selectedOptions[0].innerText;
}
//////////////FIRST SCENARIO////////////////////////////
//////fill up teacher dropdown//////////////
var tchNameLst = []; 
function fillTeachersName(){
    $("#TeacherSelect").empty();
    var selElement = document.getElementById('TeacherSelect');

    optionTitle = document.createElement("option");
    
    optionTitle.selected = 'true';
    optionTitle.text='--Teachers--';
    selElement.add(optionTitle);
    for(var i=0; i<tchNameLst.length; i++)
    {
        optionVal = document.createElement("option");
        optionVal.value = "t"+(i+1);
        optionVal.text = tchNameLst[i];
        selElement.add(optionVal);

    }
}
/////////////////////////////
//////fill up other dropdowns//////////////
var teacherName;
var timeDrop = [];
var dayDrop;
var subjectDrop;
var timeDayLst = [];
const unique = [];
var teacherNum;
function chkFilterClick(){
    subjectChose;
    //dayChose = [];
    timeChose;
    teacherName;
    tchNameLst = [];
    teacherNum;
    subjectChose = $("#getSubject")[0].selectedOptions[0].innerText
    totalDays = document.getElementById("checkboxes").querySelectorAll("input")
    collectDays();
    timeChose = $("#getTime")[0].selectedOptions[0].innerText;
    teacherName = $("#TeacherSelect")[0].selectedOptions[0].innerText;
    tchNameLst = Object.keys(final_teachers);
    teacherNum = $("#TeacherSelect")[0].length
    teacherNum = teacherNum-1;
    ////console.log(subjectChose);
    //console.log("ChkFilterFlag Function: ");
    //console.log(dayChose);
    ////console.log(timeChose);
    ////console.log(tchNameLst.length);
    ////console.log(teacherNum);
    if(subjectChose != "--Subjects--" || dayChose.length > 0 || timeChose != "--Time--" ){
        ////console.log("Part 1 crossed");
        if(tchNameLst.length != teacherNum || teacherName == "--Teachers--"){
            ////console.log("Part 2 Crossed");
            //console.log(filterFlag);
            //console.log(dayChose);
            if(!filterFlag){
                ////console.log("FilterFlag is False");
                alert("Click Filter Or You won't Get The Result Expected.");
            }
        }
    }
    else{
        filterFlag = false;
    }
}
function fillOtherDrpdn(){
    ////console.log(FilterInChange);
    subjectChose;
    //dayChose = [];
    timeChose;
    teacherName;
    teacherName = $("#TeacherSelect")[0].selectedOptions[0].innerText;
    ////console.log("Other Stuff:")
    ////console.log(teacherName); 
    if(teacherName != "--Teachers--"){
        //console.log("Not Resetting");
        dropSValues();
        dropDValues();
        dropTValues();
    }
    else{
        //console.log("Gotta Reset!!!");
        fillSubjectsName();
        fillTeachersName();
        fillTime();
        resetDays();
    }
}

function dropTValues(){
    timeChose = $("#getTime")[0].selectedOptions[0].innerText;
    if(timeChose == "--Time--"){
        for(var tD=0; tD < Object.values(final_teachers[teacherName]["days"]).length; tD++){
            ////console.log(tD);
            timeDayLst = (Object.values(final_teachers[teacherName]["days"])[tD]);
            for(var dN=0; dN < timeDayLst.length; dN++){
                timeDrop.push(timeDayLst[dN]);
            }
        }
        const unique = Array.from(new Set(timeDrop));
        ////console.log(unique);
        var selElement=document.getElementById('getTime');
        $("#getTime").empty();
        optionTitle = document.createElement("option");
        
        optionTitle.selected = 'true';
        optionTitle.text='--Time--';
        selElement.add(optionTitle);
        for(var i=0; i<unique.length; i++)
        {
            optionVal = document.createElement("option");
            optionVal.value = "ti"+(i+1);
            optionVal.text=unique[i];
            selElement.add(optionVal);

        }
    }
}
function dropDValues(){
    //console.log("I am in DropDValues");
    dayDrop = final_teachers[teacherName]["days"];
    ////console.log("DUKBARA:");
    ////console.log(teacherName);
    var selElement= document.getElementById("checkboxes").querySelectorAll("input");    

    totalDays = document.getElementById("checkboxes").querySelectorAll("input")
    collectDays();
    //console.log("I am Old:");
    //console.log(dayChose);
    //console.log("Filter FlaG: ");
    //console.log(filterFlag);
    if(dayChose.length <= 0){
        //console.log("pretty face");
        for(var i=0; i<selElement.length; i++)
        {   
            //console.log("################");
            ////console.log(selElement[i].value);
            ////console.log(dayDrop[selElement[i].value]);
            if(dayDrop[selElement[i].value].length > 0){
                //console.log("Covid you lost");
                selElement[i].checked = true;
            }
            else{
                //console.log("Covid you won");
                selElement[i].disabled = true;
            }
        }
        ////console.log(dayDrop);
        ////console.log("###########");
    }
}
function dropSValues(){
    ////console.log("Checking!!!");
    ////console.log($("#getSubject")[0].selectedOptions[0].innerText);
    subjectChose = $("#getSubject")[0].selectedOptions[0].innerText
    if(subjectChose == "--Subjects--" || null){
        ////console.log("SAWEE");
        subjectDrop = $.unique(final_teachers[teacherName]["subs"]);
        const unique = Array.from(new Set(subjectDrop));
        ////console.log(unique);
        var selElement=document.getElementById('getSubject')
        $("#getSubject").empty();
        optionTitle = document.createElement("option");
        
        optionTitle.selected = 'true';
        optionTitle.text='--Subjects--';
        selElement.add(optionTitle);
        for(var i=0; i<unique.length; i++)
        {
            optionVal = document.createElement("option");
            optionVal.value = "s"+(i+1);
            optionVal.text=unique[i];
            selElement.add(optionVal);

        }
    }
    else
    {
        ////console.log("NO SAWEE");
    }
}
/////////////////////////////

//////////////Second SCENARIO////////////////////////////
//////fill up subject dropdown//////////////
var subNameLst = ["Private Tutoring", "Art & Design", "Character Design", "Computer Music", "C++", "Scratch Coding", "Scratch Jr. Coding", "Animation in Scratch", "Python Coding", "Computational Thinking", "Electrical Engineering", "History - Hieroglyphs", "Languages - French", "Languages - Spanish", "Math K-2", "Math 3-6", "Math 7-9"];

function fillSubjectsName(){
    $("#getSubject").empty();
    var selElement = document.getElementById('getSubject');
    optionTitle = document.createElement("option");
    
    optionTitle.selected = 'true';
    optionTitle.text='--Subjects--';
    selElement.add(optionTitle);
    for(var i=0; i<subNameLst.length; i++)
    {
        optionVal = document.createElement("option");
        optionVal.value = "sub"+(i+1);
        optionVal.text = subNameLst[i];
        selElement.add(optionVal);

    }  
}
/////////////////////////////

//////fill up teacher from subjects/////////////
//var subjectChose;
var subjectsTeach = [];
var chkTeachSubs = [];
//const unique = [];

function fillTeacherSubjects(){
    subjectChose;
    timeChose;
    dayChose = [];
    subjectChose = $("#getSubject")[0].selectedOptions[0].innerText;
    //TeacherChose = $("#TeacherSelect")[0].selectedOptions[0].innerText;
    timeChose = $("#getTime")[0].selectedOptions[0].innerText;
    totalDays = document.getElementById("checkboxes").querySelectorAll("input")
    collectDays();
    ////console.log("Chosen Subject:");
    ////console.log(subjectChose); 
    ////console.log(dayChose);
    subjectsTeach = [];
    var selElement=document.getElementById('TeacherSelect');
    if(dayChose.length <=0 && timeChose == "--Time--"){
        for(var chk=0; chk < tchNameLst.length; chk++){
            chkTeachSubs = final_teachers[tchNameLst[chk]]["subs"]
            if(chkTeachSubs.includes(subjectChose)){
                ////console.log("yes it does Have it");
                subjectsTeach.push(tchNameLst[chk]);
            }
            else{
                ////console.log("Nope Not there");
            }
        }
        ////console.log("REasult Time:");
        ////console.log(subjectsTeach);

        $("#TeacherSelect").empty();
        optionTitle = document.createElement("option");
        
        optionTitle.selected = 'true';
        optionTitle.text='--Teachers--';
        selElement.add(optionTitle);
        for(var i=0; i<subjectsTeach.length; i++)
        {
            optionVal = document.createElement("option");
            optionVal.value = "t"+(i+1);
            optionVal.text=subjectsTeach[i];
            selElement.add(optionVal);
        }
    }
}
///////////////////////////////////////////////////////////////////

/////////////////////
//////Time Fill up onLoad/////////
var tickTokTimes = [];

function fillTime(){
    $("#getTime").empty();
    var selElement = document.getElementById('getTime');
    optionTitle = document.createElement("option");
    
    optionTitle.selected = 'true';
    optionTitle.text='--Time--';
    selElement.add(optionTitle);
    for(var t=0; t < tchNameLst.length; t++){
        timeVal = Object.values(final_teachers[tchNameLst[t]]["days"]);
        for(var v=0; v<timeVal.length; v++){
            for(var a=0; a<timeVal[v].length; a++){
                tickTokTimes.push(timeVal[v][a]);
            }
        }
    }
    ////console.log("TickTokResult:");
    const unique = Array.from(new Set(tickTokTimes));
    ////console.log(unique);

    for(var i=0; i<unique.length; i++)
    {
        optionVal = document.createElement("option");
        optionVal.value = "ti"+(i+1);
        optionVal.text = unique[i];
        selElement.add(optionVal);
    }  
}
/////////////////////////////////////////////

///////////reset Days///////////
function resetDays(){
    //console.log("I am in reset mode.");
    var selElement= document.getElementById("checkboxes").querySelectorAll("input");
    for(var c=0; c<selElement.length; c++){
        selElement[c].checked = false;
        selElement[c].disabled = false;
    }
}


/////////////////////////

///////////Confirm Time And Day///////////
function TimeDayManage(){
    timeChose;
    dayChose = [];
    timeChose = $("#getTime")[0].selectedOptions[0].innerText;
    var selElementTime=document.getElementById('getTime');
    var selElementDay= document.getElementById("checkboxes").querySelectorAll("input");
    totalDays = document.getElementById("checkboxes").querySelectorAll("input")
    collectDays();
    if(dayChose.length <= 0){
        for(var c=0; c<selElement.length; c++){
            selElement[c].checked = false;
            selElement[c].disabled = false;
        }
        for(var i=0; i<selElement.length; i++)
        {   
            ////console.log("################");
            ////console.log(selElement[i].value);
            ////console.log(dayDrop[selElement[i].value]);
            if(dayDrop[selElement[i].value].length > 0){
                selElement[i].checked = true;
            }
            else{
                selElement[i].disabled = true;
            }
        }
        ////console.log(dayDrop);
        ////console.log("###########");
    }
    if(timeChose == "--Time--" || null){
        for(var tD=0; tD < Object.values(final_teachers[teacherName]["days"]).length; tD++){
            ////console.log(tD);
            timeDayLst = (Object.values(final_teachers[teacherName]["days"])[tD]);
            for(var dN=0; dN < timeDayLst.length; dN++){
                timeDrop.push(timeDayLst[dN]);
            }
        }
        const unique = Array.from(new Set(timeDrop));
        ////console.log(unique);
        
        $("#getTime").empty();
        optionTitle = document.createElement("option");
        
        optionTitle.selected = 'true';
        optionTitle.text='--Time--';
        selElement.add(optionTitle);
        for(var i=0; i<unique.length; i++)
        {
            optionVal = document.createElement("option");
            optionVal.value = "ti"+(i+1);
            optionVal.text=unique[i];
            selElement.add(optionVal);

        }
    }
}

var dayMatch = [];

function DayManage(){
    timeChose;
    //dayChose = [];
    teacherName;
    timeChose = $("#getTime")[0].selectedOptions[0].innerText;
    var selElementTime=document.getElementById('getTime');
    var selElementDay= document.getElementById("checkboxes").querySelectorAll("input");
    totalDays = document.getElementById("checkboxes").querySelectorAll("input")
    collectDays();
    teacherName = $("#TeacherSelect")[0].selectedOptions[0].innerText;
    ////console.log("Time that is chosen");
    ////console.log(timeChose);
    if(teacherName != "--Teachers--" && timeChose != "--Time--" ){
        //var dayFlag = true;
        //var timeFlag = true;
        ////console.log("Start Mismatch Discovery");
        for(var d=0; d< dayChose.length; d++){
            ////console.log("Checking Days:");
            ////console.log(teacherName);
            ////console.log(dayChose[d]);
            teacherDay = final_teachers[teacherName]["days"][dayChose[d]];
            ////console.log(teacherDay);
            if(teacherDay.includes(timeChose)){
                ////console.log("Confirmed.");
            }
            else{
                //dayFlag = false;  
                ////console.log("No.");
                dayMatch.push(dayChose[d]);
                }
        }

        for(var i=0; i<selElementDay.length; i++)
        {   
            ////console.log("################");
            ////console.log(selElementDay[i].value);
            ////console.log(dayMatch.includes(selElementDay[i].value));
            if(dayMatch.includes(selElementDay[i].value)){
                selElementDay[i].checked = false; 
                selElementDay[i].disabled = true;
            }
               
        }
        ////console.log("MisMatches: ");
        ////console.log(dayMatch);
    }
    
}

function TimeManage(){
    timeChose;
    //dayChose = [];
    timeChose = $("#getTime")[0].selectedOptions[0].innerText;
    var selElementTime=document.getElementById('getTime');
    var selElementDay= document.getElementById("checkboxes").querySelectorAll("input");
    totalDays = document.getElementById("checkboxes").querySelectorAll("input")
    collectDays();
    if(dayChose.length <= 0){
        for(var c=0; c<selElement.length; c++){
            selElement[c].checked = false;
            selElement[c].disabled = false;
        }
        for(var i=0; i<selElement.length; i++)
        {   
            ////console.log("################");
            ////console.log(selElement[i].value);
            ////console.log(dayDrop[selElement[i].value]);
            if(dayDrop[selElement[i].value].length > 0){
                selElement[i].checked = true;
            }
            else{
                selElement[i].disabled = true;
            }
        }
        ////console.log(dayDrop);
        ////console.log("###########");
    }
    if(timeChose == "--Time--" || null){
        for(var tD=0; tD < Object.values(final_teachers[teacherName]["days"]).length; tD++){
            ////console.log(tD);
            timeDayLst = (Object.values(final_teachers[teacherName]["days"])[tD]);
            for(var dN=0; dN < timeDayLst.length; dN++){
                timeDrop.push(timeDayLst[dN]);
            }
        }
        const unique = Array.from(new Set(timeDrop));
        ////console.log(unique);
        
        $("#getTime").empty();
        optionTitle = document.createElement("option");
        
        optionTitle.selected = 'true';
        optionTitle.text='--Time--';
        selElement.add(optionTitle);
        for(var i=0; i<unique.length; i++)
        {
            optionVal = document.createElement("option");
            optionVal.value = "ti"+(i+1);
            optionVal.text=unique[i];
            selElement.add(optionVal);

        }
    }
}

/////////////////////////

///filter//////////////
function collectDays(){
    dayChose = [];
    for(var c=0; c <totalDays.length; c++){
            if(totalDays[c].checked){
                dayChose.push(totalDays[c].value);
            }
        }
}

var subjectChose;
var teacherChose;
var timeChose;
var dayChose = [];
var totalDays;
var dayIncluded = [];
var daysTeach = [];
var timesTeach = [];
var teacherDay = [];

const uniqueSub = [];
const uniqueDay = [];
const uniqueTime = [];
var choicesToFilter = [];
var choicesStringValues = [];

var passList;

var filterFlag = false; 

function filterWValues(){
    subjectChose;
    timeChose;
    //dayChose = [];
    subjectChose = $("#getSubject")[0].selectedOptions[0].innerText;
    timeChose = $("#getTime")[0].selectedOptions[0].innerText;
    totalDays = document.getElementById("checkboxes").querySelectorAll("input")
    collectDays();
    ////console.log(final_teachers);
    ////console.log(subjectChose);
    ////console.log(dayChose);
    ////console.log(timeChose);
    subjectsTeach = [];
    daysTeach = [];
    timesTeach = [];
    filterFlag = true;
    for(var f=0; f<tchNameLst.length; f++){
        ////console.log(tchNameLst[f]);
        if(subjectChose != "--Subjects--" || null){
            chkTeachSubs = final_teachers[tchNameLst[f]]["subs"]
            if(chkTeachSubs.includes(subjectChose)){
                ////console.log(chkTeachSubs);
                ////console.log("Yes We Got It");
                subjectsTeach.push(tchNameLst[f]);
            }
            else{
                ////console.log(chkTeachSubs);
                ////console.log("Nah Man Cannot Include");
            }
        }
        if(dayChose.length > 0){
            var dayFlag = true;
            var timeFlag = true;
            for(var d=0; d< dayChose.length; d++){
                ////console.log("Checking Days:");
                teacherDay = final_teachers[tchNameLst[f]]["days"][dayChose[d]];
                if(teacherDay.length > 0)
                    console.log("Yes. "+dayChose[d]);
                else{
                    dayFlag = false;  
                    //console.log("No.");
                }
                ////console.log("Checking Time for Those Days");
                dayIncluded = final_teachers[tchNameLst[f]]["days"][dayChose[d]];
                if(timeChose != "--Time--"){
                    ////console.log("Speed Up");
                    if(dayIncluded.includes(timeChose)){
                        //console.log("Yup Time is there");
                    }
                    else{
                        //console.log("No time at all");
                        timeFlag = false;
                    }
                }
                else{
                    ////console.log("Not there");
                    timeFlag = false;
                }
            }
            if(dayFlag){
                daysTeach.push(tchNameLst[f]);
            }
            if(timeFlag){
                timesTeach.push(tchNameLst[f]);
            }
        }
        else{
            dayIncluded = Object.keys(final_teachers[tchNameLst[f]]["days"]);
            var timeIncluded = [];
            if(timeChose != "--Time--" || null){
                ////console.log("Kuddooies");
                ////console.log(dayIncluded);
                for(var k=0; k < dayIncluded.length; k++){
                    timeIncluded = final_teachers[tchNameLst[f]]["days"][dayIncluded[k]];
                    ////console.log(timeIncluded);
                    if(timeIncluded.includes(timeChose)){
                        ////console.log("I have it");
                        timesTeach.push(tchNameLst[f]);
                    }
                    else{
                        ////console.log("Time Flies Away");
                    }
                }
            }
        }
    }
    //const uniqueSub = Array.from(new Set(subjectsTeach));
    //const uniqueDay = Array.from(new Set(daysTeach));
    const uniqueTime = Array.from(new Set(timesTeach));
    ////console.log("Filteration Succeeded--: ");
    ////console.log("Subjects: "+subjectChose);
    ////console.log(subjectsTeach);
    ////console.log("Days: "+dayChose);
    ////console.log(daysTeach);
    ////console.log("Times: "+timeChose);
    ////console.log(uniqueTime);

    choicesToFilter = [];
    choicesStringValues = [];

    if(subjectsTeach.length > 0){
        //console.log("I got the subjects");
        choicesToFilter.push(subjectsTeach);
        choicesStringValues.push("#getSubject");
    }
    if(daysTeach.length > 0){
        //console.log("I got the days");
        choicesToFilter.push(daysTeach);
        choicesStringValues.push("#checkboxes");
    }
    if(uniqueTime.length > 0){
        //console.log("I got the time");
        choicesToFilter.push(uniqueTime);
        choicesStringValues.push("#getTime");
    }
    myFilter();
}
function myFilter(){
    passList = [];
    ////console.log(choicesToFilter);
    if(choicesToFilter.length > 0 && choicesToFilter.length < 2){
        ////console.log("No.1");
        let teachersFilter = choicesToFilter[0]; 
        passList = teachersFilter;
        addSpecificTeachers(passList);   
    }
    if(choicesToFilter.length > 1 && choicesToFilter.length < 3){
        ////console.log("No.2");
        let teachersFilter = choicesToFilter[0].filter(x => choicesToFilter[1].includes(x));
        ////console.log("Combined Combiner Combination: ");
        ////console.log(teachersFilter);
        passList = teachersFilter;
        addSpecificTeachers(passList);
    }
    if(choicesToFilter.length > 2 && choicesToFilter.length < 4){
        ////console.log("No.3");
        let teachersFilter = choicesToFilter[0].filter(x => choicesToFilter[1].includes(x) && choicesToFilter[2].includes(x));
        ////console.log("Combined Combiner Combination: ");
        ////console.log(teachersFilter);
        passList = teachersFilter;
        addSpecificTeachers(passList);
    }  
}

//////////TeacherAdd Based On Parameter//////
function addSpecificTeachers(passList){
    var selElement=document.getElementById('TeacherSelect');
    $("#TeacherSelect").empty();
    optionTitle = document.createElement("option");
    
    optionTitle.selected = 'true';
    optionTitle.text='--Teachers--';
    selElement.add(optionTitle);
    for(var i=0; i<passList.length; i++)
    {
        optionVal = document.createElement("option");
        optionVal.value = "t"+(i+1);
        optionVal.text=passList[i];
        selElement.add(optionVal);
    }
}
////////////////////////

//////addToTable/////////////
var dayChkd = "";
var counter = 1; 

function myAdd() {
    findDays();
    var table = $("#resTable");
    table.append("<tr id=dataRow"+counter+" >"+
    "<td>"+$("#getSeason")[0].selectedOptions[0].innerText+
    "</td><td>"+$("#getSubject")[0].selectedOptions[0].innerText+
    "</td><td>"+$("#startDate").val()+
    "</td><td>"+$("#endDate").val()+
    "</td><td>"+$("#noDateTxt").val()+
    "</td><td>"+$("#getClassNum")[0].selectedOptions[0].innerText+
    "</td><td>"+$("#TeacherSelect")[0].selectedOptions[0].innerText+ 
    "</td><td>"+dayChkd+
    "</td><td>"+$("#getTime")[0].selectedOptions[0].innerText+
    "</td><td>"+$("#getGrade")[0].selectedOptions[0].innerText+
    "</td> <td id=deleter> <input type=button value=X onclick=deleteRow(this)> </td> </tr>");

    ////console.log("HAKUNA MATATA: ");
    ////console.log($("#resTable"));
    ////console.log("HULULULU");
    ////console.log($('#resTable'));
    ////console.log("##########");

    counter=counter+1;

    sendButtonCondition();
}

function findDays(){
    dayChkd = "";
    $("#checkboxes").find("input").each(function(){
    if ($(this)[0].checked){
        if(dayChkd==""){
            dayChkd = $(this).val()
        }
        else{    
        dayChkd=dayChkd+","+$(this).val();
        ////console.log(dayChkd);
        }
    }

    });
}

function deleteRow(r) {
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("resTable").deleteRow(i);
    sendButtonCondition();
}
////////////////////

////////Disable the send button////////////
function sendButtonCondition(){
    var sendButton = $("#sendButton")[0];
    ////console.log($("#sendButton")[0]);
    //////console.log(document.getElementById('dataRow1'));
    ////console.log($("#resTable tr"));
    var tableTR = $("#resTable tr");
    if(tableTR.length > 1){
        sendButton.disabled = false;
        ////console.log("yippee");
    }
    else{
        sendButton.disabled = true;
        ////console.log("No yippee");
    }
}
//////////////////////////
///////////////Pick Multiple Dates/////////
var noDateVal = document.getElementById("noDate");
var dateNoClass;
var noDateTxtVal = document.getElementById("noDateTxt");
var multipleNoDates = [];
var removedNoDates = [];
var commaCount;
var comCounter = 0;
var countResetFlag = false;
function noDateTxt(){
    noDateInput  = document.getElementById("noDateTxt");
    ////console.log(noDateInput);
    if(noDateInput.style.display === "block"){
        ////console.log("hidden");
        noDateInput.style.display = "none";
    } 
    else{
        ////console.log("Unhidden");
        noDateInput.style.display = "block";
    }
}
function dateAdd(){
    //countResetFlag = false;
    noDateVal = document.getElementById("noDate");
    noDateTxtVal = document.getElementById("noDateTxt");
    commaCount = ($("#noDateTxt").val().match(/,/g)||[]).length;
    ////console.log(noDateVal.value);
    ////console.log(commaCount);
    ////console.log("#@@@@@#");
    ////console.log(comCounter);
    ////console.log(countResetFlag);
    if (commaCount != comCounter) { 
        removedNoDates = noDateTxtVal.value.split(",");
        ////console.log("Over there");
        ////console.log(removedNoDates);
        /*for(var r=0; r<removedNoDates.length; r++){
            multipleNoDates.push(removedNoDates[r]);
        }*/
        multipleNoDates = multipleNoDates.filter(x => removedNoDates.includes(x));
        multipleNoDates.push(noDateVal.value);
        countResetFlag = true;
        comCounter = commaCount+0;
        ////console.log("Deducted and Resseted");
        ////console.log(comCounter);
    }
    else{
        ////console.log("Over Here");
        countResetFlag = false;
        multipleNoDates.push(noDateVal.value);
    }
                ///////////////////////
    if(multipleNoDates.length>0 && multipleNoDates.length<2){
        ////console.log("In here With One");
        noDateTxtVal.value = multipleNoDates[0];
    }
    else{
        let str = multipleNoDates.join(",");
        ////console.log("In here with multiple");
        noDateTxtVal.value = str;
        if(!countResetFlag){
            comCounter = comCounter+1;
        }
        else{
            ////console.log("Not increased");
        }
    } 
}

////////////////////////
///////NoDate Popup////////




////////////////////////////
//////////Total Classes Calculation//////////////
function getSatSunCount(startDate, endDate){
   var totalSatSun = 0;
   for (var i = startDate; i <= endDate; i.setDate(i.getDate()+1)){
       if (i.getDay() == 0) totalSatSun++;
       if (i.getDay() == 6) totalSatSun++;
   }
   return totalSatSun;
}
function totalClasses(){
    var date1 = $("#startDate").val();
    var date2 = $("#endDate").val();
    var date3 = $("#noDateTxt").val();
    if((date1 != "" || null) && (date2!=""||null)){
        var nDSplit;
        var startDate = new Date(date1);
        var endDate = new Date(date2);
        var nDSplit2 = [];
        var ddRes;
        var diffD1D2 =  Math.floor(( (Date.parse(date2)+1) - Date.parse(date1) ) / 86400000)
        if(date3.indexOf(',') > -1){
            nDSplit = date3.split(",");
            for(var nd=0; nd<nDSplit.length; nd++){
                nDSplit2.push(nDSplit[nd].split("-"));  
            } 
        }
        else{
            //console.log("No Date No");
            nDSplit2 = [];
        }
        var noClassDate = nDSplit2.length 
        var weekendsCount = getSatSunCount(startDate, endDate);
        var selElementCount=$("#getClassNum option");
        var numClassCount = [];
        var sumNumClass = [];
        /////Math/////
        ddRes = diffD1D2 - (weekendsCount+noClassDate);
        for(var s=1; s<selElementCount.length; s++){
            if(selElementCount[s].innerText == ddRes){
                numClassCount.push("=");
                //console.log("right on");
                //console.log(selElementCount[s].innerText + " = "+ddRes);
                sumNumClass.push(ddRes);
            }
            else if(selElementCount[s].innerText < ddRes){
                numClassCount.push(">");
                //console.log("more");
                //console.log(selElementCount[s].innerText + " < "+ddRes);
                sumNumClass.push(selElementCount[s].innerText);
            }
            else if(selElementCount[s].innerText > ddRes){
                numClassCount.push("<");
                //console.log("less");
                //console.log(selElementCount[s].innerText + " > "+ddRes);
                sumNumClass.push(selElementCount[s].innerText);
            }
            else{
                numClassCount.push("nope");
                //console.log("Error 401");
                //console.log(selElementCount[s].innerText + " idk "+ddRes);
                sumNumClass.push(selElementCount[s].innerText);
            }
        }
        ////DrpDn//
        if(!numClassCount.includes("=")){
            var selElement=document.getElementById('getClassNum');
            optionVal = document.createElement("option");
            optionVal.value = "tRes";
            optionVal.text=ddRes;
            optionVal.selected = true;
            selElement.add(optionVal);
        }
        else{
            var selElement=document.getElementById('getClassNum');
            $("#getClassNum").empty();
            optionTitle = document.createElement("option");
            optionTitle.text='--# Of Classes--';
            optionTitle.disabled = true;
            selElement.add(optionTitle);
            for(var c=0; c<sumNumClass.length; c++)
            {   
                optionVal = document.createElement("option");
                optionVal.value = "num"+(c+1);
                optionVal.text=sumNumClass[c];
                if(ddRes == sumNumClass[c]){
                    optionVal.selected = true;
                }
                selElement.add(optionVal);
            }
        }
    }
    else{
        if(date1 == "" || null){
            alert("Please Pick A Start Date First.");
        }
        if(date2 ==""||null){
            alert("Please Pick An End Date First.");
        }
    }
}
/////////////////////////////
/////////submit the table///////////

function submitTable(){
    var i=0;
    var tableDict = {};
    var courseList = [];
    var sdList = [];
    var edList = [];
    var ndList = [];   
    var classNumList = [];
    var teachersList = [];
    var dayList = [];
    var timeList = [];
    var xlsRows = [];
    var xlsHeader = ["Course", "Start Date", "End Date", "No Date","# of Classes", "Teacher", "Day", "Time"];
    var exampleDict = {};
    var changeSheetName = $("#SeasonTitle")[0].selectedOptions[0].innerText;
    var seasonSubList = [];
    $("#resTable").find("tr").each(function(){
        if(i>=1){
            seasonSubList.push(($(this)[0].children[0].innerText));
            courseList.push(($(this)[0].children[1].innerText));
            sdList.push(($(this)[0].children[2].innerText));
            edList.push(($(this)[0].children[3].innerText));
            ndList.push(($(this)[0].children[4].innerText));
            classNumList.push(($(this)[0].children[5].innerText));
            teachersList.push(($(this)[0].children[6].innerText));
            dayList.push(($(this)[0].children[7].innerText));
            timeList.push(($(this)[0].children[8].innerText));
        ////console.log(i);
        }
    i= i+1;
    });
    ////console.log("SeasonList: "+seasonSubList);
    ////console.log("sdList: "+sdList);
    ////console.log("edList: "+edList);
    ////console.log("ndList: "+ndList);
    ////console.log("classNumList: "+classNumList);
    ////console.log("teachersList: "+teachersList);
    ////console.log("dayList: "+dayList);
    ////console.log("timeList: "+timeList); 
    //////////////Save and Download///////////////////
    tableDict["Sheet Name"] = changeSheetName;
    tableDict["Season"] = seasonSubList;   
    tableDict["Course"] = courseList;
    tableDict["Start Date"] = sdList;
    tableDict["End Date"] = edList;
    tableDict["No Date"] = ndList;
    tableDict["# of Classes"] = classNumList;
    tableDict["Teacher"] = teachersList;
    tableDict["Day"] = dayList;
    tableDict["Time"] = timeList;
    
    //console.log(tableDict);

    createXLSLFormatObj = tableDict;
    }

    ///////////////////
    ////Reading from Spreadsheet////

function readspreadsheet(){
    request = $.ajax({
        //url: "C:\\Users\\jayru\\PythonProject\\scheduler-master\\scheduler-master\\OutputSpreadsheet.xlsx", 
        url: "https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbzwo8xoGY2TYAc8fShl5ZskV9XgtSGivMyVDG71xyuhb917H-xz/exec",
        type: "get"    
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console

        ////console.log("Hooray, it worked!");
        ////console.log(response['row']);
        ////console.log(textStatus);
        ////console.log(jqXHR);
        var data = response['row'];
        var dict = {};
        var valVal;
        var keyVal;
        _JsonData = [];
        for(var jD=1; jD < data.length; jD++){
            for(var hD=0; hD < data[0].length; hD++){
                keyVal = data[0][hD];
                ////console.log(keyVal);
                valVal = data[jD][hD];
                ////console.log(valVal);
                dict[keyVal] = valVal;
            }
            _JsonData.push(dict);
        }
        ////console.log("my Json data from XLS: ");
        ////console.log(_JsonData);
        sheetToTable();
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.error(
            "The following error occurred: "+
            textStatus, errorThrown
        );
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        ////console.log("I m in here");
        // Reenable the inputs
       // $inputs.prop("disabled", false);
    });

    // Prevent default posting of form
    event.preventDefault();
    

    }
    

function sheetToTable(){
    var tableCont = $('#resTable');
    var headSeason = $('#headRow th')[0].innerText;
    var headCourse = $('#headRow th')[1].innerText;
    var headStartDate = $('#headRow th')[2].innerText;
    var headEndDate = $('#headRow th')[3].innerText;
    var headNoDate = $('#headRow th')[4].innerText;
    var headClassNum = $('#headRow th')[5].innerText;
    var headTeacher = $('#headRow th')[6].innerText;
    var headDay = $('#headRow th')[7].innerText;
    var headTime = $('#headRow th')[8].innerText;
    var headGrade = $('#headRow th')[9].innerText;
    var appendRowFirst = "<tr id=dataRow"+counter+" >";
    var appendRowLast = "</tr>";

    if(_JsonData.length!=0){
        ////console.log("Fetching!!!!:::");
        ////console.log(_JsonData.length);
        //////console.log(tableCont);
        ////console.log(headCourse);
        ////console.log(headStartDate);
        ////console.log(headEndDate);
        ////console.log(headNoDate);
        

        //tableCont.append("<tr><td>A</td><td>b</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td><td>i</td><td>j</td></tr>");
        //tableCont.append("<tr><td>A</td><td>b</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td><td>i</td><td>j</td></tr>");
        ////console.log("Test");
        ////console.log(_JsonData[0][headCourse]);
        for(var d=0; d<=_JsonData.length-1; d++){
           ////console.log(d);
           ////console.log(_JsonData[d]);
           /////Season/////////
           if(_JsonData[d][headSeason]!=null){
                ////console.log("Yes Season is there:");
                ////console.log(_JsonData[d][headSeason]);
                appendRowFirst = appendRowFirst.concat("<td>"+_JsonData[d][headSeason]+"</td>");
                //tableCont.append("<tr><td>a</td><td>Yolo</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td><td>i</td><td>j</td></tr>");
            }
            else{
                ////console.log("KJHFUEHUENoPE");
                appendRowFirst = appendRowFirst.concat("<td></td>");
            }
            /////Course/////////
            if(_JsonData[d][headCourse]!=null){
                ////console.log("Yes Course is there:");
                ////console.log(_JsonData[d][headCourse]);
                appendRowFirst = appendRowFirst.concat("<td>"+_JsonData[d][headCourse]+"</td>");
                ////console.log("AdddingSTUFF:");  
                ////console.log(appendRowFirst);
                //tableCont.append("<tr><td>a</td><td>Yolo</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td><td>i</td><td>j</td></tr>");
            }
            else{
                ////console.log("KJHFUEHUE");
                appendRowFirst = appendRowFirst.concat("<td></td>");
            }
            /////Start Date/////////
            if(_JsonData[d][headStartDate]!=null){
                ////console.log("Yes Start Date is there:");
                ////console.log(_JsonData[d][headStartDate]);
                appendRowFirst = appendRowFirst.concat("<td>"+_JsonData[d][headStartDate].split("T")[0]+"</td>");
                //tableCont.append("<tr><td>a</td><td>Yolo</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td><td>i</td><td>j</td></tr>");
            }
            else{
                ////console.log("KJHFUEHUE");
                appendRowFirst = appendRowFirst.concat("<td></td>");
            }
            /////End Date/////////
            if(_JsonData[d][headEndDate]!=null){
                ////console.log("Yes End Date is there:");
                ////console.log(_JsonData[d][headEndDate]);
                appendRowFirst = appendRowFirst.concat("<td>"+_JsonData[d][headEndDate].split("T")[0]+"</td>");
                //tableCont.append("<tr><td>a</td><td>Yolo</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td><td>i</td><td>j</td></tr>");
            }
            else{
                ////console.log("KJHFUEHUE");
                appendRowFirst = appendRowFirst.concat("<td></td>");
            }
            /////No Class Date/////////
            if(_JsonData[d][headNoDate]!=null){
                ////console.log("Yes No Class Date is there:");
                ////console.log(_JsonData[d][headNoDate]);
                appendRowFirst = appendRowFirst.concat("<td>"+_JsonData[d][headNoDate].split("T")[0]+"</td>");
                //tableCont.append("<tr><td>a</td><td>Yolo</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td><td>i</td><td>j</td></tr>");
            }
            else{
                ////console.log("KJHFUEHUE");
                appendRowFirst = appendRowFirst.concat("<td></td>");
            }
            /////Class Num/////////
            if(_JsonData[d][headClassNum]!=null){
                ////console.log("Yes Class Num is there:");
                ////console.log(_JsonData[d][headClassNum]);
                appendRowFirst = appendRowFirst.concat("<td>"+_JsonData[d][headClassNum]+"</td>");
                //tableCont.append("<tr><td>a</td><td>Yolo</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td><td>i</td><td>j</td></tr>");
            }
            else{
                ////console.log("KJHFUEHUE");
                appendRowFirst = appendRowFirst.concat("<td></td>");
            }
            /////Teacher/////////
            if(_JsonData[d][headTeacher]!=null){
                ////console.log("Yes Teacher is there:");
                ////console.log(_JsonData[d][headTeacher]);
                appendRowFirst = appendRowFirst.concat("<td>"+_JsonData[d][headTeacher]+"</td>");
                //tableCont.append("<tr><td>a</td><td>Yolo</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td><td>i</td><td>j</td></tr>");
            }
            else{
                ////console.log("KJHFUEHUE");
                appendRowFirst = appendRowFirst.concat("<td></td>");
            }
            /////Day/////////
            if(_JsonData[d][headDay]!=null){
                ////console.log("Yes Days is there:");
                ////console.log(_JsonData[d][headDay]);
                appendRowFirst = appendRowFirst.concat("<td>"+_JsonData[d][headDay]+"</td>");
                //tableCont.append("<tr><td>a</td><td>Yolo</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td><td>i</td><td>j</td></tr>");
            }
            else{
                ////console.log("KJHFUEHUE");
                appendRowFirst = appendRowFirst.concat("<td></td>");
            }
            /////Time/////////
            if(_JsonData[d][headTime]!=null){
                ////console.log("Yes Time is there:");
                ////console.log(_JsonData[d][headTime]);
                appendRowFirst = appendRowFirst.concat("<td>"+_JsonData[d][headTime]+"</td>");
                //tableCont.append("<tr><td>a</td><td>Yolo</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td><td>i</td><td>j</td></tr>");
            }
            else{
                ////console.log("KJHFUEHUE");
                appendRowFirst = appendRowFirst.concat("<td></td>");
            }
            /////Grade/////////
            if(_JsonData[d][headGrade]!=null){
                ////console.log("Yes Grade is there:");
                ////console.log(_JsonData[d][headGrade]);
                appendRowFirst = appendRowFirst.concat("<td>"+_JsonData[d][headGrade]+"</td>");
                //tableCont.append("<tr><td>a</td><td>Yolo</td><td>c</td><td>d</td><td>e</td><td>f</td><td>g</td><td>h</td><td>i</td><td>j</td></tr>");
            }
            else{
                ////console.log("KJHFUEHUE");
                appendRowFirst = appendRowFirst.concat("<td></td>");
            }
            appendRowFirst = appendRowFirst.concat("<td id=deleter> <input type=button value=X onclick=deleteRow(this)></td>")
            appendRowFirst = appendRowFirst.concat(appendRowLast);
            ////console.log(appendRowFirst);
            
            tableCont.append(appendRowFirst);

            appendRowFirst = "<tr>";
            counter=counter+1;
        }
    }
    sendButtonCondition();
}
//////////////////////////
