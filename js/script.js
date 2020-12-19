document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	class Todo {
		constructor(form, input, todoList, todoCompleted, error, todoWrapper, todoListText, todoCompletedText, date) {
			this.form = document.querySelector(form);
			this.input = document.querySelector(input);
			this.todoList = document.querySelector(todoList);
			this.todoCompleted = document.querySelector(todoCompleted);
			this.todoError = document.querySelector(error);
			this.todoWrapper = document.querySelector(todoWrapper);
			this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
			this.listText = document.querySelector(todoListText);
			this.completedText = document.querySelector(todoCompletedText);
			this.date = document.querySelector(date);
			this.translateValue = 0;
			this.scaleValue = 1;
		}

		showDate() {
			const date1 = new Date(),
				year = date1.getFullYear(),
				day = date1.toLocaleString("en", { day: 'numeric' }),
				month = date1.toLocaleString("en", { month: 'long' }),
				currentDay = date1.toLocaleString("en", { weekday: 'short' });

			let hour = date1.getHours(),
				minutes = date1.getMinutes();

			if (hour < 10) { hour = '0' + hour; }
			if (minutes < 10) { minutes = '0' + minutes; }

			const dayUppercasing = date => {
				const weekday = date[0].toUpperCase() + date.slice(1);
				return weekday;
			};

			const dayLong = dayUppercasing(currentDay);

			const currentDate = `
				<p class="calendar-date"><span class="word--red">
				Today is</span> ${dayLong},
				${day} ${month} ${year}</p>
				<p class="calendar-time">${hour} : <span class="word--red">${minutes}</span></p>
			`;

			const dateOutput = () => {
				this.date.innerHTML = currentDate;
			};

			dateOutput();
		}

		checkEmptyBlock() {
			if (this.todoList.childNodes.length === 0) {
				this.listText.style.display = 'block';
			} else { this.listText.style.display = 'none'; }

			if (this.todoCompleted.childNodes.length === 0) {
				this.completedText.style.display = 'block';
			} else { this.completedText.style.display = 'none'; }
			if (this.todoData.size === 0) { localStorage.removeItem('toDoList'); }
		}

		render() {
			this.todoList.textContent = '';
			this.todoCompleted.textContent = '';
			this.todoData.forEach(this.createItem, this);
			this.addToStorage();
			this.checkEmptyBlock();
		}

		addToStorage() {
			localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
		}

		createItem(todo) {
			const li = document.createElement('li');
			const text = document.createElement('p');
			const error = document.createElement('span');

			li.classList.add('todo-left-list__item');
			li.key = todo.key;
			li.style.cssText = `
					opacity: 1;
					transform: translateX(0);
					transform: scale(1);
			`;
			text.contentEditable = 'false';
			text.classList.add('todo-list__item-text');
			text.innerHTML = `<span class="todo-text">${todo.value}</span>`;

			error.classList.add('required-error', 'textError');

			li.insertAdjacentElement('afterbegin', text);
			li.insertAdjacentElement('beforeend', error);
			li.insertAdjacentHTML('beforeend', `
					<a href="#" class="todo-item-link edit-link">
						<svg class="edit">
							<use xlink:href="images/sprite.svg#pencil"></use>
						</svg>
					</a>
					<a href="#" class="todo-item-link checked-link">
						<img class="checked todo-left__checked" src="
						./images/check.svg" alt="">
					</a>
					<a href="#" class="todo-item-link delete-link">
						<img class="delete todo-right__delete" src="
						./images/delete.svg" alt="">
					</a>
				`);

			if (todo.completed) {
				this.todoCompleted.append(li);
			} else {
				this.todoList.append(li);
			}
		}

		addTodo(e) {
			e.preventDefault();
			if (this.input.value.trim() !== '') {

				this.todoError.textContent = '';
				const newTodo = {
					value: this.input.value,
					completed: false,
					key: this.generateKey(),
				};
				this.todoData.set(newTodo.key, newTodo);
				this.render();

			} else {
				this.todoError.textContent = 'Unable to add empty task';
			}

			this.form.reset();
		}

		toDoCompletedAnimate(elem) {

			let opacity = elem.style.opacity;

			if (!elem.closest('ul').matches('.todo-left-list')) {
				if (opacity > 0.01 && opacity <= 1) {
					opacity -= 0.05;
					elem.style.opacity = opacity;
					this.translateValue -= 15;
					elem.style.transform = `translateX(${this.translateValue}px)`;
					elem.classList.add('animated');

				} else {
					opacity = 1;
					this.translateValue = 0;
					elem.classList.remove('animated');
					cancelAnimationFrame(this.loadingInterval);
					this.render();
				}

			} else {
				if (opacity > 0.01 && opacity <= 1) {
					opacity -= 0.05;
					elem.style.opacity = opacity;
					this.translateValue += 15;
					elem.style.transform = `translateX(${this.translateValue}px)`;
					elem.classList.add('animated');

				} else {
					opacity = 1;
					this.translateValue = 0;
					console.log(this.translateValue);
					elem.classList.remove('animated');
					cancelAnimationFrame(this.loadingInterval);
					this.render();
				}
			}

			if (elem.classList.contains('animated')) {
				this.loadingInterval = requestAnimationFrame(() =>
					this.toDoCompletedAnimate(elem));
			}
		}

		todoDeletedAnimate(elem) {

			if (!elem.closest('ul').matches('.todo-left-list')) {
				if (this.scaleValue > 0.2 && this.scaleValue <= 1) {
					this.scaleValue -= 0.05;
					elem.style.transform = `scale(${this.scaleValue})`;
					elem.classList.add('animated');

				} else {
					this.scaleValue = 1;
					elem.classList.remove('animated');
					cancelAnimationFrame(this.loadingInterval);
					this.render();
				}

			} else {
				if (this.scaleValue > 0.2 && this.scaleValue <= 1) {
					this.scaleValue -= 0.05;
					elem.style.transform = `scale(${this.scaleValue})`;
					elem.classList.add('animated');

				} else {
					this.scaleValue = 1;
					elem.classList.remove('animated');
					cancelAnimationFrame(this.loadingInterval);
					this.render();
				}
			}

			if (elem.classList.contains('animated')) {
				this.loadingInterval = requestAnimationFrame(() =>
					this.todoDeletedAnimate(elem));
			}
		}

		generateKey() {
			return Math.random().toString(36).substring(2, 15) + Math.random().
			toString(36).substring(2, 15);
		}

		editItem(todoText, elemKey, todoElem) {
			todoText.contentEditable = true;

			todoText.addEventListener('blur', () => {

				this.todoData.forEach(item => {
					if (item.key === elemKey) {

						if (todoText.textContent.trim() !== '') {
							todoText.contentEditable = false;
							todoElem.querySelector('.textError').textContent = '';
							item.value = todoText.textContent.trim();
						} else {
							todoElem.querySelector('.textError').textContent =
								'This field cannot be empty';
							return;
						}

						this.render();
					}
				});
			});
		}

		deleteItem(elemKey, elem) {
			this.todoData.forEach(item => {
				if (item.key === elemKey) {
					this.todoData.delete(elemKey);
				}
			});
			this.loadingInterval = requestAnimationFrame(() =>
				this.todoDeletedAnimate(elem));
		}

		completedItem(elemKey, elem) {
			this.todoData.forEach(item => {
				if (item.key === elemKey) {
					item.completed = !item.completed;
				}
			});

			this.loadingInterval = requestAnimationFrame(() =>
				this.toDoCompletedAnimate(elem));
		}

		handler() {
			this.todoWrapper.addEventListener('click', event => {
				const target = event.target;
				const todoElem = target.closest('li');
				if (todoElem) {
					const todoText = todoElem.querySelector('p');
					const elemKey = todoElem.key;

					if (target.matches('.delete')) {
						this.deleteItem(elemKey, todoElem);
					}
					if (target.closest('.checked')) {
						this.completedItem(elemKey, todoElem);
					}
					if (target.closest('.edit')) {
						this.editItem(todoText, elemKey, todoElem);
					}
				}
			});
		}

		init() {
			this.form.addEventListener('submit', this.addTodo.bind(this));
			this.handler();
			this.render();
			this.showDate();

			setInterval(() => {
				this.showDate();
			}, 60000);
		}
	}

	const todo = new Todo('.header-form', '.header-form__input',
		'.todo-left-list', '.todo-right-list', '.todoError',
		'.todo__wrapper', '.todo-left__text', '.todo-right__text',
		'.header-calendar');

	todo.init();

		 const userTitleName = document.querySelector('.word--red'),
			usersButtons = document.querySelector('.users-buttons'),
			loginBtn = document.querySelector('.users-button-login'),
			singUpBtn = document.querySelector('.users-button-singup'),
			userCard = document.querySelector('.user-card'),
			nameInputGroup = document.querySelector('.modal-input-group-name'),
			userFirstName = document.querySelector('.user-firstName__value'),
			userLastName = document.querySelector('.user-lastName__value'),
			regDate = document.querySelector('.user-date__value'),
			modal = document.querySelector('.modal'),
			modalOverlay = document.querySelector('.modal-overlay'),
			modalClose = document.querySelector('.modal-close'),
			modalActive = document.querySelector('.modal--active'),
			modalLoginBtn = document.querySelector('.button__log-in'),
			modalSingUpBtn = document.querySelector('.button__sing-up'),
			modalBtnActive = document.querySelector('.modal-button--active'),
			modalForm = document.querySelector('.modal-form'),
			inputName = document.querySelector('.input-name'),
			inputLogin = document.querySelector('.input-login'),
			inputPassword = document.querySelector('.input-password'),
			modalInputGroups = document.querySelectorAll('.modal-input-group'),
			modalInputs = document.querySelectorAll('.modal__input');

	let userData = {};

	// Get user name, login, password
	const getUserData = (userName, userLogin, userPassword) => {
		const name = userName.split(' '),
			firstName = name[0],
			lastName = name[1];

		return {firstName, lastName, userLogin, userPassword};
	};

	// // Local Storage
	const getTodoData = key => localStorage.getItem(key) ?
		JSON.parse(localStorage.getItem(key)) : [];

	const updateTodoData = (key, user) =>
		localStorage.setItem(key, JSON.stringify(user));

	const createNewUser = (userData) => {
		const key = userData.userLogin;

		for(let key in localStorage) {
			if (localStorage.hasOwnProperty(key)) {
				console.dir(`${key}: ${localStorage.getItem(key)}`);
				console.log(JSON.parse(localStorage.getItem(key)));
			}

		}
		updateTodoData(key, userData);
	};

	const userLogIn = (userLogin) => {
		const user = getTodoData(userLogin);

	};
	// Modal
	const closeModal = () => {
		modal.classList.remove('modal--active');
		modalInputs.forEach(elem => {
			elem.nextElementSibling.textContent = '';
			document.querySelector('#name-error').textContent = '';
			elem.classList.remove('invalid');
		});
		modalForm.reset();
	};

	const toggleModal = () => {
		usersButtons.addEventListener('click', event => {
			const target = event.target;

			if (target.matches('.users-button-login')) {
				nameInputGroup.classList.remove('modal-input-group-name--active');
				modalLoginBtn.classList.add('modal-button--active');
				modalSingUpBtn.classList.remove('modal-button--active');
				modal.classList.add('modal--active');

			} else if (target.matches('.users-button-singup')) {
				nameInputGroup.classList.add('modal-input-group-name--active');
				modalSingUpBtn.classList.add('modal-button--active');
				modalLoginBtn.classList.remove('modal-button--active');
				modal.classList.add('modal--active');
			}

			modalValidate();

			document.addEventListener("keydown", event => {
				if (event.key === 'Escape') {
					closeModal();
				}
			});
		});

		modal.addEventListener('click', event => {
			const target = event.target;

			if (modalOverlay.contains(target) || target.closest('.modal-close')) {
				closeModal();
			}
		});
	};

	toggleModal();


	// Modal Validate
	const modalValidate = () => {
		let nameValidate = false;
		let passwordValidate = false;
		let loginValidate = false;

		const validateInputs = elem => {
			const userName = inputName.value.trim();
			const nameRegExp = /^[a-zA-z]+\s[a-zA-z]+$/;


			if (elem.name === 'user-name') {
				if (elem.value === '') {
					document.querySelector('#name-error').textContent = '';
					elem.nextElementSibling.textContent = 'Field is required!';
					elem.classList.add('invalid');
					nameValidate = false;
				} else {
					elem.nextElementSibling.textContent = '';
					if (nameRegExp.test(userName)) {
						document.querySelector('#name-error').textContent = '';
						elem.classList.remove('invalid');
						nameValidate = true;
					} else {
						elem.nextElementSibling.textContent = '';
						elem.classList.add('invalid');
						nameValidate = false;
						document.querySelector('#name-error').textContent = 'Format of name: John Wick';
					}
				}
			}

			if (elem.name === 'user-login') {
				if (elem.value === '') {
					elem.nextElementSibling.textContent = 'Field is required!';
					elem.classList.add('invalid');
					loginValidate = false;
				} else {
					elem.nextElementSibling.textContent = '';
					elem.classList.remove('invalid');
					loginValidate = true;
				}
			}

			if (elem.name === 'user-password') {
				if (elem.value === '') {
					elem.nextElementSibling.textContent = 'Field is required!';
					elem.classList.add('invalid');
					passwordValidate = false;
				} else {
					elem.nextElementSibling.textContent = '';
					elem.classList.remove('invalid');
					passwordValidate = true;
				}
			}
		};
		modalInputs.forEach(input => {
			input.addEventListener('blur', () => {
				validateInputs(input);
			});
		});

		modalForm.addEventListener('submit', event => {
			event.preventDefault();

			modalInputs.forEach(input => {
				validateInputs(input);
			});
			if (!nameInputGroup.classList.contains('modal-input-group-name--active')) {
				nameValidate = true;
			}
			if (loginValidate && nameValidate && passwordValidate) {
				const userName = inputName.value,
					userPassword = inputPassword.value,
					userLogin = inputLogin.value;

				userData = getUserData(userName, userLogin, userPassword);

				for (let i = 0; i < modalForm.length; i++) {
					if (modalForm[i].matches('.modal-button--active')) {
						if (modalForm[i].matches('.button__sing-up')) {
							createNewUser(userData);
							closeModal();
						} else {
							userLogIn(userLogin);
							closeModal();
						}
					}
				}
			}

		});

	};

});