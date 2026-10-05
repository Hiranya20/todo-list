// ================================
// DOM Elements
// ================================

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const dueDate = document.getElementById("dueDate");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const clearCompletedBtn =
    document.getElementById("clearCompletedBtn");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const themeToggle =
    document.getElementById("themeToggle");


// ================================
// Variables
// ================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// ================================
// Add Task
// ================================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskName = taskInput.value.trim();
    const priority = prioritySelect.value;
    const date = dueDate.value;

    if (taskName === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        title: taskName,
        priority: priority,
        dueDate: date,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskForm.reset();

    prioritySelect.value = "medium";

    renderTasks();
});


// ================================
// Display Tasks
// ================================

function renderTasks() {

    taskList.innerHTML = "";

    const searchText =
        searchInput.value.toLowerCase().trim();

    let filteredTasks = tasks.filter(function (task) {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);

        let matchesFilter = true;

        if (currentFilter === "active") {
            matchesFilter = !task.completed;
        }

        if (currentFilter === "completed") {
            matchesFilter = task.completed;
        }

        return matchesSearch && matchesFilter;
    });


    // Empty state

    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>

                <h3>No tasks found</h3>

                <p>
                    Add a new task or change your filter.
                </p>
            </div>
        `;

        updateStatistics();

        return;
    }


    // Create task cards

    filteredTasks.forEach(function (task) {

        const taskItem = document.createElement("div");

        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed");
        }


        taskItem.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${task.completed ? "checked" : ""}
                >

                <div class="task-content">

                    <div class="task-title">
                        ${task.title}
                    </div>

                    <div class="task-details">

                        <span class="priority-badge priority-${task.priority}">
                            ${task.priority}
                        </span>

                        ${
                            task.dueDate
                            ? `<span>Due: ${task.dueDate}</span>`
                            : `<span>No due date</span>`
                        }

                    </div>

                </div>

            </div>


            <div class="task-actions">

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;


        // Checkbox

        const checkbox =
            taskItem.querySelector(".task-checkbox");

        checkbox.addEventListener("change", function () {

            toggleTask(task.id);

        });


        // Edit button

        const editButton =
            taskItem.querySelector(".edit-btn");

        editButton.addEventListener("click", function () {

            editTask(task.id);

        });


        // Delete button

        const deleteButton =
            taskItem.querySelector(".delete-btn");

        deleteButton.addEventListener("click", function () {

            deleteTask(task.id);

        });


        taskList.appendChild(taskItem);
    });


    updateStatistics();
}


// ================================
// Complete / Uncomplete Task
// ================================

function toggleTask(id) {

    tasks = tasks.map(function (task) {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;
    });

    saveTasks();

    renderTasks();
}


// ================================
// Delete Task
// ================================

function deleteTask(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) {
        return;
    }

    tasks = tasks.filter(function (task) {

        return task.id !== id;

    });

    saveTasks();

    renderTasks();
}


// ================================
// Edit Task
// ================================

function editTask(id) {

    const task = tasks.find(function (task) {

        return task.id === id;

    });

    if (!task) {
        return;
    }


    const newTitle =
        prompt("Edit task:", task.title);

    if (newTitle === null) {
        return;
    }

    const updatedTitle = newTitle.trim();

    if (updatedTitle === "") {
        alert("Task name cannot be empty.");
        return;
    }


    const newPriority =
        prompt(
            "Enter priority: low, medium or high",
            task.priority
        );


    if (
        newPriority !== "low" &&
        newPriority !== "medium" &&
        newPriority !== "high"
    ) {

        alert("Invalid priority.");

        return;
    }


    task.title = updatedTitle;
    task.priority = newPriority;

    saveTasks();

    renderTasks();
}


// ================================
// Search
// ================================

searchInput.addEventListener("input", function () {

    renderTasks();

});


// ================================
// Filter
// ================================

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        currentFilter =
            button.dataset.filter;

        renderTasks();
    });

});


// ================================
// Update Statistics
// ================================

function updateStatistics() {

    const total = tasks.length;

    const completed =
        tasks.filter(function (task) {

            return task.completed;

        }).length;

    const active =
        total - completed;


    totalTasks.textContent = total;

    activeTasks.textContent = active;

    completedTasks.textContent = completed;
}


// ================================
// Clear Completed Tasks
// ================================

clearCompletedBtn.addEventListener(
    "click",
    function () {

        const hasCompletedTasks =
            tasks.some(function (task) {

                return task.completed;

            });


        if (!hasCompletedTasks) {

            alert("There are no completed tasks.");

            return;
        }


        const confirmClear =
            confirm(
                "Remove all completed tasks?"
            );


        if (!confirmClear) {
            return;
        }


        tasks = tasks.filter(function (task) {

            return !task.completed;

        });

        saveTasks();

        renderTasks();
    }
);


// ================================
// Local Storage
// ================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// ================================
// Dark Mode
// ================================

themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle("dark-mode");

        if (
            document.body.classList.contains("dark-mode")
        ) {

            themeToggle.textContent = "☀️";

        } else {

            themeToggle.textContent = "🌙";

        }
    }
);


// ================================
// Initial Load
// ================================

renderTasks();