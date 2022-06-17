const card = post => {
    return `
                <div class="card z-depth-4">
                    <div class="card-content">
                        <span class="card-title">${post.title}</span>
                        <p style="white-space: pre-line">${post.text}</p> 
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
let modal
let modalAuth
const USERS_URL = '/api/auth/users'
const BASE_URL = '/api/post'
const REG_URL = '/api/auth/registration'
const AUTH_URL = '/api/auth/login'

class PostApi {
    static fetch() {
        return fetch(BASE_URL, {method: 'get'}).then(res => res.json())
    }

    static create(post){
        return fetch(BASE_URL,{
            method:'post',
            body:JSON.stringify(post),
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        }).then(res => res.json())
    }

    static remove(id){
        return fetch(`${BASE_URL}/${id}`,{
            method:'delete'
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



    modal = M.Modal.init(document.querySelector('.modal'))
    modalAuth = M.Modal.init(document.querySelector('.modalAuth'))
    document.querySelector('#createPost').addEventListener('click',onCreatePost)
    document.querySelector('#posts').addEventListener('click',onDeletePost)

    document.querySelector('#RegBTN').addEventListener('click', registration)
    document.querySelector('#AuthBTN').addEventListener('click', auth)
})

function renderPosts(_posts = []) {
    const $posts = document.querySelector('#posts')

    if (_posts.length > 0) {
        $posts.innerHTML = _posts.map(post => card(post)).join(' ')
    } else {
        $posts.innerHTML = `<div class = "center">0 posts on page.</div>`
    }
}

function onCreatePost(){
    const $title = document.querySelector('#title')
    const $text = document.querySelector('#text')
    if($title.value && $text.value){
        const newPost = {
            title:$title.value,
            text:$text.value,
            imageURL:$imageURL.value,
        }
        PostApi.create(newPost).then(post => {
            posts.push(post)
            renderPosts(posts)
        })
        modal.close()
        $title.value=''
        $text.value=''
        $imageURL.value=''
        M.updateTextFields()
    }
}

function onDeletePost(event){
    if(event.target.classList.contains('js-remove') || event.target.parentNode.classList.contains('js-remove')){
        const decision = confirm('Вы уверены что хотите удалить пост?')

        if(decision){
            const id = event.target.getAttribute('data-id') || event.target.parentNode.getAttribute('data-id')
            PostApi.remove(id).then(() => {
                const postIndex = posts.findIndex(post => post._id === id)
                posts.splice(postIndex,1)
                renderPosts(posts)
            })
        }
    }
}

class RegApi {
    static fetch() {
        return fetch(REG_URL, {method: 'get'}).then(res => res.json())
    }
    static create(USER){
        return fetch(REG_URL,{
            method:'post',
            body:JSON.stringify(USER),
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        }).then(res => res.json())
    }
}


function registration(){
    const $login = document.querySelector('#login')
    const $password = document.querySelector('#password')

    if($login.value && $password.value){
        const newUser = {
            username:$login.value,
            password:$password.value,
        }
        RegApi.create(newUser).then(newUser => {
            users.push(newUser)
        })
    }
}
class UsersApi {
    static fetch() {
        return fetch(USERS_URL, {method: 'get'}).then(res => res.json())
    }
}

class AuthApi {
    static fetch() {
        return fetch(AUTH_URL, {method: 'post'}).then(res => res.json())
    }

    static login(USER){
        return fetch(AUTH_URL,{
            method:'post',
            body:JSON.stringify(USER),
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        })
    }

}
let usersArr = []
async function auth() {
    const $username = document.querySelector('#loginAuth')
    const $password = document.querySelector('#passwordAuth')
    console.log($username.value)
    if ($username.value && $password.value) {
        const User = {
            username: $username.value,
            password: $password.value,
        }
        let value
        AuthApi.login(User).then(res => res.json()).then(json => console.log(json.token))
        // console.log(value)
        // UsersApi.fetch().then(backendUsers => {
        //     users = backendUsers.concat()
        // })
        // getUsers(USER,)
        // const resp = await AuthApi.login(User);
        // const responseData = resp.json();
        // const response = responseData.token;
        // console.log(response);
    }

    // async function getUsers(req, res) {
    //     return fetch(USERS_URL,{
    //         method:'get',
    //         body:JSON.stringify(req),
    //         headers:{
    //             'Accept':'application/json',
    //             'Content-Type':'application/json',
    //             'Authorization':AuthApi.login(req).then(res => res.json()).then(json => console.log(json.token))
    //         }
    //
    //     })
    //     try {
    //         const users = await User.find()
    //         res.json(users)
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}
