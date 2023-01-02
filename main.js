let alertBox = document.querySelector(".alert");
let inputText = document.querySelector(".note");
let inputCost = document.querySelector(".note-value");
let addBtn = document.querySelector(".add");
let notesContainer = document.querySelector(".notes-container");
let totalContainer = document.querySelector(".total-container");
let totalMoney = document.querySelector(".total-money")

let editText;
let editCost;
let editFlag = false;
let editId = "";

// Add Event Listener
addBtn.addEventListener("click", addItem);
window.addEventListener("DOMContentLoaded", setItems);
showTotal();
totalCost();

// functions
function addItem(e) {
    const textValue = inputText.value;
    const costValue = inputCost.value;
    const id = new Date().getTime().toString();

    if (textValue && costValue && !editFlag) {
        
        createList(id, textValue, costValue);
        addToLocalStorage(id, textValue, costValue);
        displayAlert("note added", "success")
        showTotal();
        totalCost();
        setBackToDefault();
    }
    else if (textValue && costValue && editFlag) {
        editText.innerHTML = textValue;
        editCost.innerHTML = costValue;

        editLocalStorage(editId, textValue, costValue);
        displayAlert("note edited", "success");
        totalCost();
        setBackToDefault();
    }
    else { 
        displayAlert("empty value !!", "danger")
    }
}
function setBackToDefault (){
    inputText.value = "";
    inputCost.value = "";
    editFlag = false;
    editId = "";
    addBtn.textContent = "Add Note"
}
function deleteItem (e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;

    element.remove();

    removeFromLocalStorage(id);

    displayAlert("Note Removed", "danger")
    totalCost();
    showTotal();
}
function editItem (e){
    const element = e.currentTarget.parentElement.parentElement;
    
    editText = e.currentTarget.parentElement.previousElementSibling.firstElementChild;
    editCost = e.currentTarget.parentElement.previousElementSibling.lastElementChild;

    inputText.value = editText.innerHTML;
    inputCost.value = editCost.innerHTML;

    addBtn.textContent = "Edit"
    editFlag = true;
    editId = element.dataset.id;
}
function addToLocalStorage(id, textValue, costValue) {
    const notes = {id, textValue: inputText.value, costValue: inputCost.value}
    let items = localStorage.getItem("tasks")? JSON.parse(localStorage.getItem("tasks")):[];

    items.push(notes)
    localStorage.setItem("tasks", JSON.stringify(items));
}
function removeFromLocalStorage(id){
    let items = localStorage.getItem("tasks")? JSON.parse(localStorage.getItem("tasks")):[];

    items = items.filter(function(item){
        if (item.id != id){
            return item;
        }
    })
    localStorage.setItem("tasks", JSON.stringify(items));
};
function editLocalStorage(id, textValue, costValue){
    let items = localStorage.getItem("tasks")? JSON.parse(localStorage.getItem("tasks")):[];

    items = items.map(function(item) {
        if(item.id === id){
            item.textValue = inputText.value;
            item.costValue =inputCost.value;
        }
        return item;
    })
    localStorage.setItem("tasks", JSON.stringify(items));
};
function setItems(){
    let items = localStorage.getItem("tasks")? JSON.parse(localStorage.getItem("tasks")):[];

    if (items.length > 0){
        items.forEach(item => {
            createList(item.id, item.textValue, item.costValue);
        });
    }
}
function createList(id, textValue, costValue) {
    const element = document.createElement("div");
        element.classList.add("new-note")
        element.setAttribute("data-id", id);
        element.innerHTML = `<div class="comment">
                                <p class="comment-name">${textValue}</p>
                                <p class="money">${costValue}</p>
                            </div>
                            <div class="comment-btns">
                                <button class="edit btn"><i class="fa-regular fa-pen-to-square"></i></button>
                                <button class="delete btn"><i class="fa-regular fa-trash-can"></i></button>
                            </div>`
        const editBtn = element.querySelector(".edit");
        const deleteBtn = element.querySelector(".delete");

        deleteBtn.addEventListener("click", deleteItem);

        editBtn.addEventListener("click", editItem);

        notesContainer.appendChild(element);
}
function displayAlert(text, action){
    alertBox.textContent = text;
    alertBox.classList.add(`alert-${action}`)

    setTimeout(() => {
        alertBox.textContent = "";
        alertBox.classList.remove(`alert-${action}`)
    }, 1500);
}
function showTotal(){
    let items = localStorage.getItem("tasks")? JSON.parse(localStorage.getItem("tasks")):[];

    if (items.length > 0){
        totalContainer.classList.add("show-total")
    }
    else {
        totalContainer.classList.remove("show-total")
    }
}
function totalCost(){
    let items = localStorage.getItem("tasks")? JSON.parse(localStorage.getItem("tasks")):[];
    let costArry = []
    if (items.length > 0){
        for(let i = 0; i < items.length; i++){
            costArry.push(JSON.parse(items[i].costValue))
        }
        let add = costArry.reduce(function(acc, current, index, arr){
            return acc + current;
        })
        totalMoney.textContent = `${add}`
    }
}