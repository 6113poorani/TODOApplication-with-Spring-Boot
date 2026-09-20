// Shared script for login, register, and todos pages
const SERVER_URL = "http://localhost:8080";
const token = localStorage.getItem("token");

// Login page logic
function login() {
const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

fetch(`${SERVER_URL}/user/login`,{
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({email,password})
    })
    .then(response =>{
    if(!response.ok){
       throw new Error("Login Failed");
    }
    return response.json();
    })
    .then (data => {
    localStorage.setItem("token",data.token);
     window.location.href="Todo.html";
    })
    .catch(error => {
    alert(error.message);
    })

}

// Register page logic
function register() {
const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

fetch(`${SERVER_URL}/user/register`,{
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({email,password})
})
.then(response =>{
    if(response.ok){
        alert("Registeration succesfully, Please Login");
        window.location.href="login.html"
    }
    else{
        return response.json().then (data=>{throw new Error(data.message||"Registrartion Failed")});
    }
}).catch(error => {
    alert(error.message);
})
}

// Todos page logic
function createTodoCard(todo) {
    const card=document.createElement("div");
    card.className='todo-card';
    const checkbox=document.createElement("input");
    checkbox.type="checkbox";
    checkbox.checked=todo.iscompleted;
    checkbox.addEventListener("change",function(){
        const updatedtodo={...todo,iscompleted:checkbox.checked}
        updateTodoStatus(updatedtodo);
    });

    const span=document.createElement("span");
    span.textContent=todo.title;
    if(todo.iscompleted){
        span.style.textDecoration="line-through";
        span.style.color='#aaa';
    }

      const deletion=document.createElement("button");
      deletion.textContent="X";
      deletion.onclick=function(){
        deleteTodo(todo.id);
      }

      card.appendChild(checkbox);
      card.appendChild(span);
      card.appendChild(deletion);
      
      return card;
}

function loadTodos() {
    if(!token){
        alert("Please login again");
        window.location.href="login.html";
        return;
    }
     fetch(`${SERVER_URL}/api/v1/todo`,{
    method:"GET",
    headers:{"content-type":"application/json",
        "Authorization": `Bearer ${token}`
    },
    
    })
    .then(response =>{
    if(!response.ok){
       throw new Error(data.message||"Failed to load");
    }
    return response.json();
    })
    .then ((todos) => {
        const todolist=document.getElementById("todo-list");
        todolist.innerHTML="";
        if(!todos || todos.length===0){
            todolist.innerHTML='<p id="empty-message"> No todos!';
        }
       else {
    todos.forEach(todo => {
        todolist.appendChild(createTodoCard(todo));
    });
}
    }
    )
    .catch(error => {
    alert(error.message);
    document.getElementById("todo-list").innerHTML='<p> Failed to load todos';
    })

}

function addTodo() {

    const input=document.getElementById("new-todo").value;
    const todo=input.trim();
 fetch(`${SERVER_URL}/api/v1/todo/create`,{
    method:"POST",
    headers:{"content-type":"application/json",
        "Authorization": `Bearer ${token}`
    },
    body:JSON.stringify({title:todo,iscompleted:false})
    
    })
    .then(response =>{
    if(!response.ok){
       throw new Error("Craetion Failed");
    }
    return response.json();
    })
    .then (() => {
        document.getElementById("new-todo").innerHTML="";
        loadTodos();
})
    .catch(error => {
    alert(error.message);
    })
}

function updateTodoStatus(todo) {
    fetch(`${SERVER_URL}/api/v1/todo/update`,{
    method:"PUT",
    headers:{"content-type":"application/json",
        "Authorization": `Bearer ${token}`
    },
    body:JSON.stringify(todo)
    
    })
    .then(response =>{
    if(!response.ok){
       throw new Error(data.message||"Updation Failed");
    }
    return response.json();
    })
    .then (() => loadTodos())
    .catch(error => {
    alert(error.message);
    })
}

function deleteTodo(id) {
    fetch(`${SERVER_URL}/api/v1/todo/delete/${id}`,{
    method:"DELETE",
    headers:{
        "Authorization": `Bearer ${token}`

    },
    
    })
    .then(response =>{
    if(!response.ok){
       throw new Error(data.message||"Deletion Failed");
    }
    
    })
    .then (() => loadTodos())
    .catch(error => {
    alert(error.message);
    })

}

// Page-specific initializations
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("todo-list")) {
        loadTodos();
    }
});