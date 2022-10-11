// kullanılacak elementleri seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");
eventListeners();

// tüm eventListeners bu fonksiyonun içinde yer alacak
function eventListeners(){
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodostoUI);
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}

function clearAllTodos(e){ // Arayüz'den temizleme
    if (confirm("Tümünü silmek istediğinizden emin misiniz ?")) {
        // todoList.innerHTML =""; // Yavaş yapıyor
        while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}

function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLocaleLowerCase();
        if (text.indexOf(filterValue) === -1){ // bulamadığı zaman
            listItem.setAttribute("style","display:none !important");
        } else {
            listItem.setAttribute("style","display:block");
        }
    })
}

function deleteToDoFromLStorage(deleteTodo){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo,index){
        if(todo === deleteTodo){
            todos.splice(index,1);
        }
    })
    localStorage.setItem("todos",JSON.stringify(todos));
}

function deleteTodo(e){ // Arayüz'den siler
    if(e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteToDoFromLStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo başarıyla silindi...");
    }
}

function loadAllTodostoUI(){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo){
        addTodotoUI(todo);
    });
}

function addTodo(e){
    const newTodo = todoInput.value.trim(); // trim - baştaki ve sondaki boşluklar silinir
    if (newTodo === ""){
        showAlert("danger","Lütfen bir todo girin...");
    } else {
        addTodotoUI(newTodo);
        showAlert("success","Todo başarıyla eklendi...");
        addTodotoLStorage(newTodo);
    }
    e.preventDefault();
}

function getTodosFromStorage(){
    let todos;
    if(localStorage.getItem("todos") === null){
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    } return todos;
}

function addTodotoLStorage(newTodo){
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));
}

function showAlert(type,message){
    const alert = document.createElement("div");
    alert.className=`alert alert-${type}`;
    alert.textContent=message;
    firstCardBody.appendChild(alert);
    
    // setTimeout kullanımı
    setTimeout(function(){
        alert.remove();
    },1000); // milisaniye
}

function addTodotoUI(newTodo){ // alınan string değeri UI'ya list-item olarak ekleyecek
    
    // <li> oluşturma
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between"
    listItem.appendChild(document.createTextNode(newTodo));
    
    // <a> oluşturma
    const link = document.createElement("a");
    link.href="#";
    link.className="delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";
    
    // a'yı li'ye ekleme
    listItem.appendChild(link);
    
    // li'yi ul'ye ekleme
    todoList.appendChild(listItem);
    
    // eklendikten sonra yazı silme
    todoInput.value="";
}