let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

document.getElementById("addBtn")
    .addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addTask();
    }
});

function addTask(){

    const text = taskInput.value.trim();

    if(text === ""){
        alert("Enter a task");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
}

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(){

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if(currentFilter === "active"){
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if(currentFilter === "completed"){
        filteredTasks = tasks.filter(task => task.completed);
    }

    if(filteredTasks.length === 0){
        taskList.innerHTML =
        `<li class="empty">No Tasks Found</li>`;
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className =
        `task ${task.completed ? "completed" : ""}`;

        li.dataset.id = task.id;

        li.innerHTML = `
            <span class="task-text">${task.text}</span>

            <div class="task-actions">

                <button class="complete-btn">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });

    taskCount.textContent =
        `${tasks.length} Task${tasks.length !== 1 ? "s" : ""}`;
}

/* Event Delegation */
taskList.addEventListener("click", function(e){

    const taskItem = e.target.closest(".task");

    if(!taskItem) return;

    const id = Number(taskItem.dataset.id);

    if(e.target.classList.contains("delete-btn")){

        tasks = tasks.filter(task => task.id !== id);

    }

    else if(e.target.classList.contains("complete-btn")){

        tasks = tasks.map(task =>
            task.id === id
            ? {...task, completed: !task.completed}
            : task
        );
    }

    else if(e.target.classList.contains("edit-btn")){

        const task = tasks.find(t => t.id === id);

        const updatedText =
            prompt("Edit Task", task.text);

        if(updatedText !== null &&
           updatedText.trim() !== ""){

            task.text = updatedText.trim();
        }
    }

    saveTasks();
    renderTasks();
});

document
.querySelectorAll(".filter-btn")
.forEach(btn => {

    btn.addEventListener("click", function(){

        document
        .querySelectorAll(".filter-btn")
        .forEach(b => b.classList.remove("active"));

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderTasks();
    });
});

document
.getElementById("clearCompleted")
.addEventListener("click", function(){

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
});

renderTasks();