let xhr = new XMLHttpRequest();
xhr.open('GET','http://127.0.0.1:7000/daily_planner/record_status/', true);
xhr.send();

today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");
thisDay = document.getElementById("day-plan");
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
                cellText = document.createElement("span");
                cellText.innerHTML = date;
                let sch = document.createElement("span");
                let data;
                if(String(currentMonth + 1).length == 1)
                    data = currentYear + '-0' + (currentMonth + 1) + '-' + date;
                else
                    data = currentYear + '-' + (currentMonth + 1) + '-' + date;
                let xhr1 = new XMLHttpRequest();
                xhr1.open('GET','http://127.0.0.1:7000/daily_planner/add_record/?data=' + data, true);
                xhr1.send();
                xhr1.addEventListener('readystatechange', function(){
                    if(xhr1.readyState == 4 && xhr1.status == 200){
                        let massage = JSON.parse(xhr1.responseText);
                        if(massage.length != 0)
                        {
                            sch.innerHTML = '(' + massage.length + ')';
                            for (let i = 0; i < massage.length; i++)
                                if(massage[i].fields.status == 'Не выполнено' && date != today.getDate())
                                    sch.parentElement.classList.add("bg-warning");
                        }
                    }
                })
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("bg-danger");
                    thisDay.innerHTML = date;
                    let xhr = new XMLHttpRequest();
                    xhr.open('GET','http://127.0.0.1:7000/daily_planner/add_record/?data=' + data, true);
                    xhr.send();
                    xhr.addEventListener('readystatechange', function(){
                        if(xhr.readyState == 4 && xhr.status == 200){
                            let massage = JSON.parse(xhr.responseText);
                            console.log(massage);
                            for (var i = 0; i < massage.length; i++)
                                thisDay.innerHTML += `\n` + massage[i].fields.title;
                        }
                    })
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

tbl.onclick = function(event) {
let target = event.target;

while (target != this) {
    if (target.tagName == 'TD' && target.innerHTML != "") {
        $('table td').removeClass('bg-info');
        $(target).addClass('bg-info');
        thisDay.innerHTML = target.firstChild.innerHTML;

        let xhr = new XMLHttpRequest();
        let data;
        if(String(currentMonth + 1).length == 1)
            data = currentYear + '-0' + (currentMonth + 1) + '-' + target.firstChild.innerHTML;
        else
            data = currentYear + '-' + (currentMonth + 1) + '-' + target.firstChild.innerHTML;
        xhr.open('GET','http://127.0.0.1:7000/daily_planner/add_record/?data=' + data, true);
        xhr.send();
        xhr.addEventListener('readystatechange', function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                let massage = JSON.parse(xhr.responseText);
                console.log(massage);
                for (var i = 0; i < massage.length; i++)
                    thisDay.innerHTML += `\n` + massage[i].fields.title;
            }
        })
    return;
    }
    target = target.parentNode;
}
}

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}