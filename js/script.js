'use strict';
const key = 'Список задач';

const getTodoData = key => localStorage.getItem(key) ?
	JSON.parse(localStorage.getItem(key)) : [];

const updateTodoData = (key, todoData) =>
	localStorage.setItem(key, JSON.stringify(todoData));

const dateWrap = document.querySelector('.header-calendar'),
	todoControl = document.querySelector('.header-form'),
	headerInput = document.querySelector('.header-form__input'),
	todoList = document.querySelector('.todo-left-list'),
	todoCompleted = document.querySelector('.todo-right-list'),
	todoData = getTodoData(key);
let counter = 0;

const render = function() {
	todoList.textContent = '';
	todoCompleted.textContent = '';
	todoData.forEach(function(item) {
		const li = document.createElement('li');
		li.classList.add('todo-left-list__item');
		li.setAttribute('id', item.id);
		li.innerHTML = `
		<span class="todo-text">${item.value}</span>
		<a href="#"><img class="checked todo-left__checked" src="./images/check.svg" alt=""></a>
		<a href="#"><img class="delete todo-right__delete" src="./images/delete.svg" alt=""></a>`;

		if (item.completed) {
			todoCompleted.append(li);
		} else {
			todoList.append(li);
		}

		const todoCheck = li.querySelector('.checked');

		todoCheck.addEventListener('click', function(event) {
			event.preventDefault();
			item.completed = !item.completed;
			updateTodoData(key, todoData);
			render();
		});

		const todoDelete = li.querySelector('.delete');
		
		todoDelete.addEventListener('click', function(event) {
			event.preventDefault();
				const index = todoData.findIndex(elem =>
					elem.id === +li.id);
				todoData.splice(index, 1);
			updateTodoData(key, todoData);
			render();
		});
	});
};

todoControl.addEventListener('submit', function(event) {
	event.preventDefault();
	
	counter++;
	const newTodo = {
		value: headerInput.value,
		completed: false,
		id: counter
	};
	if (headerInput.value !== '') {
		todoData.push(newTodo);
		updateTodoData(key, todoData);
	} else {return;}
	
	render();
	headerInput.value = '';
});

render();

















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
		<p class="calendar-date"><span class="word--red">
		Today is</span> ${dayLong},
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