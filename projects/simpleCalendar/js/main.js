'use strict';
console.log('simple calendar');

var gCalendar = buildCalendar();

function buildCalendar() {
    var calendar = [];
    calendar.push(createMeeting('Aerosmith concert', convertDateToTimestamp('5/17/2017, 18:00'), convertDateToTimestamp('5/17/2017, 23:00'), ['Noam']))
    calendar.push(createMeeting('Escape Room', convertDateToTimestamp('5/20/2017, 21:00'), convertDateToTimestamp('5/20/2017, 23:00'), ['Or', 'Shachar']))
    calendar.push(createMeeting('Family Vacation', convertDateToTimestamp('7/27/2017, 8:00'), convertDateToTimestamp('7/29/2017, 18:00'), ['Or', 'Shachar', 'Noam', 'Ariel', 'Mom', 'Dad']))
    renderCalendar(calendar);
    return calendar;
}

function createMeeting(title, start, end, participants) {
    var meeting = {
        title: title,
        start: start,
        end: end,
        participants: participants
    }
    return meeting;
}

function renderCalendar(calendar) {
    var elMeetingsContainer = document.querySelector('.meetings-container');
    calendar.forEach(function (meeting) {
        var elMeeting = createMeetingEl(meeting);
        elMeetingsContainer.appendChild(elMeeting);
    });
}

function createMeetingEl(meeting) {
    var elMeeting = document.createElement('div');
    elMeeting.classList.add('meeting');
    //using switch tp create props and append childs to element
    for (var key in meeting) {
        var elProp = document.createElement('p');
        switch (key) {
            case ('title'):
                elProp.classList.add('title');
                elProp.innerText = meeting[key];
                break;
            case ('start'):
                elProp.innerText = 'From: ' + convertTimestamptoDate(meeting[key]);
                break;
            case ('end'):
                elProp.innerText = 'To: ' + convertTimestamptoDate(meeting[key]);
                break;
            case ('participants'):
                var participantsStr = '';
                meeting[key].forEach(function (participant) {
                    participantsStr += (participant + ', ')
                });
                participantsStr = participantsStr.slice(0, -2);
                elProp.innerText = 'With: ' + participantsStr;
                break;
        }
        elMeeting.appendChild(elProp);
    }
    return elMeeting;
}

//this function for showing a popup when a relevant button is clicked
function actionBtnClicked(selector) {
    var elPopup = document.querySelector(selector);
    elPopup.classList.remove('hide');
    var elPopupBg = document.querySelector('.popup-bg');
    elPopupBg.classList.remove('hide');
}

function createMeetingClicked() {
    //get user inputs
    var elInputTitle = document.getElementById("inputTitle");
    var elInputStart = document.getElementById("inputStart");
    var elInputEnd = document.getElementById("inputEnd");
    var elInputParticipants = document.getElementById("inputParticipants");

    var inputTitle = elInputTitle.value;
    var inputStart = elInputStart.value;
    var inputEnd = elInputEnd.value;
    var inputParticipantsStr = elInputParticipants.value;
    var inputParticipants = inputParticipantsStr.split(',');

    inputStart = convertDateToTimestamp(inputStart);
    inputEnd = convertDateToTimestamp(inputEnd);

    var newMeeting = createMeeting(inputTitle, inputStart, inputEnd, inputParticipants);
    var idxToInsert = addMeeting(gCalendar, newMeeting);
    renderMeeting(newMeeting, idxToInsert);
    closePopup('.new-meeting');
}

function cancelClicked() {
    closePopup('.new-meeting');
}

function closePopup(selector) {
    var elPopup = document.querySelector(selector);
    var elInputs = elPopup.querySelectorAll('input');
    elInputs.forEach(function (elInput) {
        elInput.value = '';
    });

    elPopup.classList.add('hide');
    var elPopupBg = document.querySelector('.popup-bg');
    elPopupBg.classList.add('hide');
}

//this function adds a meeting to the model and returns the index in the calendar array
function addMeeting(calendar, newMeeting) {
    var idxToInsert = calendar.findIndex(function (meeting) {
        return newMeeting.start < meeting.start;
    });
    calendar.splice(idxToInsert, 0, newMeeting);
    return idxToInsert;
}

function renderMeeting(meeting, index) {
    var elMeetingsContainer = document.querySelector('.meetings-container');
    var elMeeting = createMeetingEl(meeting);
    elMeetingsContainer.insertBefore(elMeeting, elMeetingsContainer.children[index]);
}

function findNextMeetingClicked() {
    var elMeetingsContainer = document.querySelector('.meetings-container');
    var idxNextMeeting = findNextMeeting();
    var children = elMeetingsContainer.children;
    var elMeeting = children[idxNextMeeting];

    //if the button is clicked twice, remove the mark
    if (elMeeting.classList.contains('marked')) elMeeting.classList.remove('marked');
    else elMeeting.classList.add('marked');
}

//this function returns the index of the next meeting
function findNextMeeting() {
    var idxNextMeeting;
    var now = getNowTimestamp();
    idxNextMeeting = gCalendar.findIndex(function (meeting) {
        return now < meeting.start;
    });
    return idxNextMeeting;
}

function calcMeetingsClicked() {
    var inputName = document.getElementById('inputName').value;
    var elMeetingCount = document.querySelector('.meeting-count-output');
    var meetingsCount = countMeetings(gCalendar, inputName);
    elMeetingCount.innerText = meetingsCount;
}

function countMeetings(calendar, name) {
    var countMeetings = 0;
    calendar.forEach(function (meeting) {
        var idxInMeeting = meeting.participants.indexOf(name)
        if (idxInMeeting !== -1) countMeetings++;
    });
    return countMeetings;
}

function closeClicked() {
    var elMeetingCount = document.querySelector('.meeting-count-output');
    elMeetingCount.innerText = '-';
    closePopup('.meeting-count');
}