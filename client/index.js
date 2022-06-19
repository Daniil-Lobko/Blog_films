const card = post => {
    return `
                <div class="card z-depth-4">
                    <div class="card-content">
                        <span class="card-title">${post.title}</span>
                        <p style="white-space: pre-line">${post.text}</p><br>
                        <p style="white-space: pre-line">Author: ${post.author}</p><br>
                            <small class="right">${new Date(post.date).getHours()}:${new Date(post.date).getMinutes()}:${new Date(post.date).getSeconds()}</small> <br>
                            <small class="right">${new Date(post.date).toLocaleDateString()}</small> 
                    </div>
                    <div class="card-action">
                        <button class = "btn btn-small red js-remove" data-id="${post._id}">
                            <i class = "material-icons">delete</i>
                        </button>
                    </div>
                </div>`
}

let posts = []
let users = []

let User

let modal
let modalAuth
const USERS_URL = '/api/auth/users'
const BASE_URL = '/api/post'
const REG_URL = '/api/auth/registration'
const AUTH_URL = '/api/auth/login'
const openPopUpLogIn = document.getElementById('login');
const closePopUpLogIn = document.getElementById('pop_up_LogIn_close');
const popUpLogIn = document.getElementById('pop_up_LogIn');
const openPopUpRegister = document.getElementById('register');
const closePopUpRegister = document.getElementById('pop_up_Register_close');
const popUpRegister = document.getElementById('pop_up_Register');
const openPopUpForm = document.getElementById('btn_add_post');
const closePopUpForm2 = document.getElementById('pop_up_Form_close');
const popUpForm = document.getElementById('postForm');


class PostApi {
    static fetch() {
        return fetch(BASE_URL, {method: 'get'}).then(res => res.json())
    }

    static create(post) {
        return fetch(BASE_URL, {
            method: 'post',
            body: JSON.stringify(post),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
    }

    static remove(id) {
        return fetch(`${BASE_URL}/${id}`, {
            method: 'delete'
        }).then(res => res.json())
    }
}

document.addEventListener('DOMContentLoaded', () => {
    PostApi.fetch().then(backendPosts => {
        posts = backendPosts.concat()
        setTimeout(() => {
            renderPosts(posts)
        }, 1000)
    })
    modal = M.Modal.init(document.querySelector('#postForm'))
    modalAuth = M.Modal.init(document.querySelector('.modalAuth'))
    document.querySelector('#createPost').addEventListener('click', onCreatePost)
    document.querySelector('#posts').addEventListener('click', onDeletePost)
    document.querySelector('#btn_submit_reg').addEventListener('click', registration)
    document.querySelector('#btn_submit_log').addEventListener('click', auth)

})
openPopUpLogIn.addEventListener('click', () => {
    popUpLogIn.classList.add('active');
})

closePopUpLogIn.addEventListener('click', () => {
    popUpLogIn.classList.remove('active');
})

openPopUpRegister.addEventListener('click', () => {
    popUpRegister.classList.add('active');
})
closePopUpRegister.addEventListener('click', () => {
    popUpRegister.classList.remove('active');
})
document.querySelector('#btn_submit_log').addEventListener('click', () => {
    popUpLogIn.classList.remove('active');
})
document.querySelector('#btn_submit_reg').addEventListener('click', () => {
    popUpRegister.classList.remove('active');
})

openPopUpForm.addEventListener('click', () => {
    popUpForm.classList.add('active');
})

closePopUpForm2.addEventListener('click', () => {
    popUpForm.classList.remove('active');
})

function renderPosts(_posts = []) {
    const $posts = document.querySelector('#posts')

    if (_posts.length > 0) {
        $posts.innerHTML = _posts.map(post => card(post)).join(' ')
    } else {
        $posts.innerHTML = `<div class = "center">0 posts on page.</div>`
    }
}

class RegApi {
    static fetch() {
        return fetch(REG_URL, {method: 'get'}).then(res => res.json())
    }

    static create(USER) {
        return fetch(REG_URL, {
            method: 'post',
            body: JSON.stringify(USER),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
    }
}

class UsersApi {
    static fetch(token) {
        return fetch(USERS_URL, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json())
    }
}

class AuthApi {
    static fetch() {
        return fetch(AUTH_URL, {method: 'post'}).then(res => res.json())
    }

    static login(USER) {
        return fetch(AUTH_URL, {
            method: 'post',
            body: JSON.stringify(USER),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }
}

function onCreatePost() {
    const $title = document.querySelector('#title')
    const $text = document.querySelector('#text')
    const $author = User.username
    console.log(User.username)
    if ($title.value && $text.value && $author) {
        const newPost = {
            title: $title.value,
            text: $text.value,
            author: $author,
        }
        modal.close()
        PostApi.create(newPost).then(post => {
            posts.push(post)
            renderPosts(posts)
        })
        modal.close()
        $title.value = ''
        $text.value = ''
        $author: ''
        M.updateTextFields()
    }

}

async function auth() {
    const $username = document.querySelector('#username1')
    const $password = document.querySelector('#password1')
    console.log($username.value)
    if ($username.value && $password.value) {
        User = {
            username: $username.value,
            password: $password.value,
        }
        // AuthApi.login(User).then(res => res.json()).then(json => console.log(json.token))
        const response = await AuthApi.login(User)
        const json = await response.json()
        const token = json.token
        console.log(token)
        console.log(User.username + ' ' + User.password)
        const result = await UsersApi.fetch(token)
        let i = 0;
        for (let i = 0; User.username != result[i].username; i++) {
        }
        console.log(result[i])

    }
}

function registration() {
    const $login = document.querySelector('#username2')
    const $password = document.querySelector('#password2')

    if ($login.value && $password.value) {
        const newUser = {
            username: $login.value,
            password: $password.value,
        }
        RegApi.create(newUser).then(newUser => {
            users.push(newUser)
        })
    }
}


function onDeletePost(event) {
    if (event.target.classList.contains('js-remove') || event.target.parentNode.classList.contains('js-remove')) {
        const decision = confirm('Вы уверены что хотите удалить пост?')

        if (decision) {
            const id = event.target.getAttribute('data-id') || event.target.parentNode.getAttribute('data-id')
            PostApi.remove(id).then(() => {
                const postIndex = posts.findIndex(post => post._id === id)
                posts.splice(postIndex, 1)
                renderPosts(posts)
            })
        }
    }
}

