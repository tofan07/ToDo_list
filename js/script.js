document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	class Todo {
		constructor(form, input, todoList, todoCompleted, error, todoWrapper, todoListText, todoCompletedText, date,
					usersButtons, authModal, modalOverlay, authForm, modalInputs,logInBtn, singUpBtn, inputName, inputLogin,
					inputPassword, nameInputGroup, userCardWrapper, loginError, greeting, loginText, todoSection, newTodoInput,
					headerButton, logOutButton, usersLoginBtn, usersSingUpBtn) {
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
			this.authModal = document.querySelector(authModal);
			this.modalOverlay = document.querySelector(modalOverlay);
			this.authForm = document.querySelector(authForm);
			this.modalInputs = document.querySelectorAll(modalInputs);
			this.singUpBtn = document.querySelector(singUpBtn);
			this.logInBtn = document.querySelector(logInBtn);
			this.inputName = document.querySelector(inputName);
			this.inputLogin = document.querySelector(inputLogin);
			this.inputPassword = document.querySelector(inputPassword);
			this.nameInputGroup = document.querySelector(nameInputGroup);
			this.usersButtons = document.querySelector(usersButtons);
			this.loginError = document.querySelector(loginError);
			this.userData = {};
			this.userLogin = '';
			this.userCardWrapper = document.querySelector(userCardWrapper);
			this.dateOfReg = '';
			this.greeting = document.querySelector(greeting);
			this.loginText = document.querySelector(loginText);
			this.todoSection = document.querySelector(todoSection);
			this.newTodoInput = document.querySelector(newTodoInput);
			this.headerButton = document.querySelector(headerButton);
			this.logOutButton = document.querySelector(logOutButton);
			this.usersLoginBtn = document.querySelector(usersLoginBtn);
			this.usersSingUpBtn = document.querySelector(usersSingUpBtn);

		}

		showDate() {
			const date1 = new Date(),
				year = date1.getFullYear(),
				day = date1.toLocaleString("en", { day: 'numeric' }),
				month = date1.toLocaleString("en", { month: 'long' }),
				currentDay = date1.toLocaleString("en", { weekday: 'short' });

			let hour = date1.getHours(),
				minutes = date1.getMinutes(),
				seconds = date1.getSeconds();

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

			this.dateOfReg = `${day} ${month} ${year} year, ${hour}:${minutes}:${seconds}`;

			const dateOutput = () => {
				this.date.innerHTML = currentDate;
			};

			dateOutput();
		}

		getUserData(userName, userLogin, userPassword, date) {
			const name = userName.split(' '),
				firstName = name[0],
				lastName = name[1];

			return {firstName, lastName, userLogin, userPassword, date};
		}

		createUserCard(user) {
			const firstName = user.firstName,
				lastName = user.lastName,
				date = user.date;

			const card = document.createElement('div');
			card.classList.add('user-card');
			card.insertAdjacentHTML("afterbegin", `
				<p class="user-firstName user-card__text">First name:
				<span class="user-firstName__value word--red">${firstName}</span></p>
				<p class="user-lastName user-card__text">Last name:
            	<span class="user-lastName__value word--red">${lastName}</span></p>
        		<p class="user-date user-card__text">Date of registration:
            	<span class="user-date__value word--red">${date}</span></p>
			`);

			this.userCardWrapper.append(card);
		}

		addUserCards() {
			this.userCardWrapper.textContent = '';

			for (let key in localStorage) {
				if (localStorage.hasOwnProperty(key) && key !== 'toDoList') {
					const user = JSON.parse(localStorage.getItem(key));
					this.createUserCard(user);
				}

			}
		}

		getTodoData(userLogin) {
			// localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
			for (let key in localStorage) {
				if (localStorage.hasOwnProperty(key)) {
					const user = JSON.parse(localStorage.getItem(key));
					if (userLogin === user.userLogin) {
						return user.firstName;
					}
				}
			}
		}

		updateTodoData(key, user) {
			localStorage.setItem(key, JSON.stringify(user));
		}

		createNewUser(userData) {
			const key = userData.userLogin;

			this.updateTodoData(key, userData);
			this.addUserCards();
		}

		checkUser(userLogin, userPassword){
			for (let key in localStorage) {
				if (localStorage.hasOwnProperty(key)) {
					const user = JSON.parse(localStorage.getItem(key));
					if (userLogin === user.userLogin && userPassword === user.userPassword) {
						return true;
					}
				}
			}
			if (this.userLogin === '') {
				return false;
			}
		}
		logIn(userLogin) {
			this.loginText.style.display = 'none';
			this.todoSection.classList.add('todo--active');
			this.newTodoInput.removeAttribute('disabled');
			this.headerButton.classList.add('button--active');
			this.headerButton.removeAttribute('disabled');

			this.greeting.textContent = this.getTodoData(userLogin);
			this.userLogin = userLogin;
			this.logOutButton.classList.add('logout--active');
			this.logOutButton.addEventListener('click', this.logOut.bind(this));
			this.usersSingUpBtn.classList.remove('users-button--active');
			this.usersLoginBtn.classList.remove('users-button--active');

		}

		logOut() {
			this.loginText.style.display = 'block';
			this.todoSection.classList.remove('todo--active');
			this.newTodoInput.setAttribute('disabled', 'true');
			this.headerButton.classList.remove('button--active');
			this.headerButton.setAttribute('disabled', 'true');
			this.greeting.textContent = 'Friend';
			this.logOutButton.classList.remove('logout--active');
			this.usersSingUpBtn.classList.add('users-button--active');
			this.usersLoginBtn.classList.add('users-button--active');
		}

		// Auth modal
		closeModal() {
			this.authModal.classList.remove('modal--active');
			this.modalInputs.forEach(elem => {
				elem.nextElementSibling.textContent = '';
				document.querySelector('#name-error').textContent = '';
				elem.classList.remove('invalid');
			});
			this.authForm.reset();
		}

		toggleModal() {
			this.usersButtons.addEventListener('click', event => {
				const target = event.target;
				this.

				if (target.matches('.users-button-login')) {
					this.nameInputGroup.classList.remove('modal-input-group-name--active');
					this.logInBtn.classList.add('modal-button--active');
					this.singUpBtn.classList.remove('modal-button--active');
					this.authModal.classList.add('modal--active');

				} else if (target.matches('.users-button-singup')) {
					this.nameInputGroup.classList.add('modal-input-group-name--active');
					this.singUpBtn.classList.add('modal-button--active');
					this.logInBtn.classList.remove('modal-button--active');
					this.authModal.classList.add('modal--active');
				}

				this.modalValidate();

				document.addEventListener("keydown", event => {
					if (event.key === 'Escape') {
						this.closeModal();
					}
				});
			});

			this.authModal.addEventListener('click', event => {
				const target = event.target;

				if (this.modalOverlay.contains(target) || target.closest('.modal-close')) {
					this.closeModal();
				}
			});
		}

		modalValidate() {
			let nameValidate = false;
			let passwordValidate = false;
			let loginValidate = false;

			const validateInputs = elem => {
				const userName = this.inputName.value.trim();
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
						this.loginError.textContent = '';
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
						this.loginError.textContent = '';
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
			this.modalInputs.forEach(input => {
				input.addEventListener('blur', () => {
					validateInputs(input);
				});
			});

			this.authForm.addEventListener('submit', event => {
				event.preventDefault();

				this.modalInputs.forEach(input => {
					validateInputs(input);
				});
				if (!this.nameInputGroup.classList.contains('modal-input-group-name--active')) {
					nameValidate = true;
				}
				if (loginValidate && nameValidate && passwordValidate) {
					const userName = this.inputName.value,
						userPassword = this.inputPassword.value,
						userLogin = this.inputLogin.value;

					this.userData = this.getUserData(userName, userLogin, userPassword, this.dateOfReg);

					for (let i = 0; i < this.authForm.length; i++) {
						if (this.authForm[i].matches('.modal-button--active')) {

							if (this.authForm[i].matches('.button__sing-up')) {
								this.createNewUser(this.userData);
								this.closeModal();
							} else {
								const verifiedUser = this.checkUser(userLogin, userPassword);
								if (verifiedUser) {
									this.loginError.textContent = '';
									this.logIn(userLogin);
									this.closeModal();
								} else {
									this.loginError.textContent = 'incorrect login or password please try again';
								}
							}
						}
					}
				}

			});

		}

		// Todo list
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
			this.addUserCards();
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
			this.toggleModal();
			this.form.addEventListener('submit', this.addTodo.bind(this));
			this.handler();
			this.render();
			this.showDate();
			setInterval(() => {
				this.showDate();
			}, 1000);

		}
	}

	const todo = new Todo('.header-form', '.header-form__input',
		'.todo-left-list', '.todo-right-list', '.todoError',
		'.todo__wrapper', '.todo-left__text', '.todo-right__text',
		'.header-calendar', '.users-buttons', '.modal', '.modal-overlay',
		'.modal-form', '.modal__input', '.button__log-in', '.button__sing-up',
		'.input-name', '.input-login', '.input-password',
		'.modal-input-group-name',  '.users-cards-wrapper', '.login-error',
		'.user-name', '.users__text', '.section-todo', '#newTodo',
		'.header-form__button', '.users-button-logout', '.users-button-login',
		'.users-button-singup');

	todo.init();

});