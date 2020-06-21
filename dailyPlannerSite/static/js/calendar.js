var csrfcookie = function() {
    var cookieValue = null,
        name = 'csrftoken';
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

function newElement() {
    var li = document.createElement("li");
    li.innerHTML = document.getElementById("myInput").value;
    if (document.getElementById("myInput").value === '') {
        alert("You must write something!");
    } else {
        let currentDay = document.getElementById("titleDay").innerHTML;
        var request = new XMLHttpRequest();
        request.open('POST', 'http://127.0.0.1:7000/daily_planner/add_record/', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.setRequestHeader('X-CSRFToken', csrfcookie());
        var body = 'title=' + encodeURIComponent(document.getElementById("myInput").value) +
                   '&completion_date=' + encodeURIComponent(day(currentDay));
        request.send(body);
        dateRecords(currentDay);
        document.getElementById("myInput").value = "";
        cell = document.getElementById(day(currentDay));
        if(new Date().getMonth() < Number(selectMonth.value) || (new Date().getMonth() == Number(selectMonth.value) && new Date().getDate() < Number(currentDay)))
            cell.classList.add("bg-success");
        else
        {
            if(cell.lastChild.innerHTML == '')
            cell.lastChild.innerHTML = '(1)';
            else
                cell.lastChild.innerHTML = '(' + String(Number(cell.lastChild.innerHTML[1]) + 1) + ')';
            cell.classList.add("bg-warning");
        }
    }
}

function day(date) {
    if(String(currentMonth + 1).length == 1)
        return currentYear + '-0' + (currentMonth + 1) + '-' + date;
    return currentYear + '-' + (currentMonth + 1) + '-' + date;
}

function dateRecords(date) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET','http://127.0.0.1:7000/daily_planner/add_record/?data=' + day(date), true);
    xhr.send();
    xhr.addEventListener('readystatechange', function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            let massage = JSON.parse(xhr.responseText);
            let ul = document.getElementById("myUL");
            ul.innerHTML = "";
            for (var i = 0; i < massage.length; i++)
            {
                let li = document.createElement("li");
                li.id = massage[i].pk;
                if(massage[i].fields.status == 'Выполнено')
                    li.classList.add('checked');
                li.innerHTML = massage[i].fields.title;
                ul.appendChild(li);
            }
        }
    })
}

//Календарь
today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");
thisDay = document.getElementById("day-plan");
titleDay = document.getElementById("titleDay");
months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}



function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();

    tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }
            else {
                cell = document.createElement("td");
                cell.id = day(date);
                cellText = document.createElement("span");
                cellText.innerHTML = date;
                let sch = document.createElement("span");
                let statusXhr = new XMLHttpRequest();
                statusXhr.open('GET','http://127.0.0.1:7000/daily_planner/record_status/?data=' + day(date), true);
                statusXhr.send();
                statusXhr.addEventListener('readystatechange', function(){
                    if(statusXhr.readyState == 4 && statusXhr.status == 200){
                        let massage = JSON.parse(statusXhr.responseText);
                        if(massage.length != massage.ln_success)
                            if(new Date().getMonth() > Number(selectMonth.value))
                            {
                                sch.innerHTML = '(' + massage.count + ')';
                                sch.parentElement.classList.add("bg-warning");
                            }
                            else if(new Date().getMonth() == Number(selectMonth.value) && new Date().getDate() >= Number(sch.previousSibling.innerHTML))
                            {
                                sch.innerHTML = '(' + massage.count + ')';
                                sch.parentElement.classList.add("bg-warning");
                            }
                            else
                                sch.parentElement.classList.add("bg-success");
                    }
                })
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-danger");
                    titleDay.innerHTML = date;
                    dateRecords(date);
                }
                cell.appendChild(cellText);
                cell.appendChild(sch);
                row.appendChild(cell);
                date++;
            }
        }

        tbl.appendChild(row); // appending each row into calendar body.
    }

}

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

//Отлов нажатия на число

tbl.onclick = function(event) {
let target = event.target;

    while (target != this) {
        if (target.tagName == 'TD' && target.innerHTML != "") {
            $('table td').removeClass('bg-info');
            $(target).addClass('bg-info');
            titleDay.innerHTML = target.firstChild.innerHTML;
            dateRecords(target.firstChild.innerHTML);

            var list = document.querySelector('ul');
            list.addEventListener('click', function(ev) {
                if (ev.target.tagName === 'LI') {
                    ev.target.classList.add('checked');
                    if(target.lastChild.innerHTML != "")
                        if(Number(target.lastChild.innerHTML[1]) - 1 != 0)
                            target.lastChild.innerHTML = '(' + String(Number(target.lastChild.innerHTML[1]) - 1) + ')';
                        else
                        {
                            target.lastChild.innerHTML = '';
                            target.classList.remove('bg-warning');
                        }
                    else
                        target.classList.remove('bg-success');
                    var request = new XMLHttpRequest();
                    request.open('POST', 'http://127.0.0.1:7000/daily_planner/record_status/', true);
                    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    request.setRequestHeader('X-CSRFToken', csrfcookie());
                    var body = 'id=' + encodeURIComponent(ev.target.id);
                    request.send(body);
                }
            }, false);
        return;
        }
        target = target.parentNode;
    }
}

