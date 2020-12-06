'use strict';

const dateWrap = document.querySelector('.header-calendar');

function showDate() {
  let date1 = new Date(),
    year = date1.getFullYear(),
    hour = date1.getHours(),
    minutes = date1.getMinutes(),
    day = date1.toLocaleString("en", {day: 'numeric'}),
    month = date1.toLocaleString("en", {month: 'long'}),
    currentDay = date1.toLocaleString("en", {weekday: 'short'});
    
  if (hour < 10) {hour = '0' + hour;}
  if (minutes < 10) {minutes = '0' + minutes;}

  function dayUppercasing(date) {
    let weekday = date[0].toUpperCase() + date.slice(1);
    return weekday;
  }
  let dayLong = dayUppercasing(currentDay);

  let currentDate = `
  <p class="calendar-date"><span class="word--red">Today is</span> ${dayLong},
  ${day} ${month} ${year}</p>
  <p class="calendar-time">${hour} : <span class="word--red">${minutes}</span></p>`;

  function dateOutput() {
    dateWrap.innerHTML = currentDate;
  }
  dateOutput();
}

showDate();

setInterval(() => {
  showDate();
}, 60000);