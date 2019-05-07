function message(status) {
  const feedback = document.querySelector('#feedback');
  feedback.textContent = status;
  feedback.style.opacity = 1;
  setTimeout(() => {
    feedback.style.opacity = 0;
  }, 3000);
}

function post(url, data, callback) {
	const formData = new FormData();
	Object.keys(data).forEach(key => {
		formData.append(key, data[key])
	});
	fetch(url, {
		method: 'POST',
		body: formData
	})
	.then(res => res.json())
	.then(res => callback(res));
}

function login() {
  post('/',
    {
    'username': document.querySelector('#login-user').value,
    'password': document.querySelector('#login-pass').value
    },
    (res) => {
      if (res.status === 'Login successful') { location.reload(); }
      else { document.querySelector('.login-input').style.borderColor = '#E14448'; }
    }
  );
}

function signup() {
  post('/signup',
    {
      'username': document.querySelector('#signup-user').value,
      'password': document.querySelector('#signup-pass').value,
      'email': document.querySelector('#signup-mail').value
    },
    (res) => {
      if (res.status === 'Signup successful') { location.reload(); }
      else { message(res.status); }
    }
  );
}

function save() {
  post('/settings',
    {
      'username': document.querySelector('#settings-user').value,
      'password': document.querySelector('#settings-pass').value,
      'email': document.querySelector('#settings-mail').value
    },
    (res) => {
      message(res.status);
    }
  );
}

const loginButton = document.querySelector('#login-button');
const signupButton = document.querySelector('#signup-button');
const saveButton = document.querySelector('#save');

if (loginButton) {
	loginButton.addEventListener('click', login);
}
if (signupButton) {
  signupButton.addEventListener('click', signup);
}
if (saveButton) {
  saveButton.addEventListener('click', save);
}

for (let input of document.querySelectorAll('.login-input')) {
	input.addEventListener('keypress', (e) => {
    if (e.which === 13) login();
	})
}

for (let input of document.querySelectorAll('.signup-input')) {
	input.addEventListener('keypress', (e) => {
    if (e.which === 13) signup();
	})
}

const burger = document.querySelector('#navbar-burger-id');
const menu = document.querySelector('#navbar-menu-id');

// Open or Close mobile & tablet menu
// https://github.com/jgthms/bulma/issues/856
burger.addEventListener('click', () => {
  burger.classList.toggle('is-active');
  menu.classList.toggle('is-active');
});
