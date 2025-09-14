/**
 * Displays the task creation form by adding a 'show' class to the container.
 *
 * This function targets the 'addTaskFromBoard' element and applies the 'show'
 * class to make the task creation form visible to the user.
 */
function showTaskForm() {
    const taskContainer = document.getElementById("addTaskFromBoard");
    taskContainer.classList.add("show");
}

/**
 * Closes the task creation form by sliding it out and hiding it.
 *
 * This function adds a 'slide-out' class to the task form container,
 * which triggers a CSS animation. After a delay of 500 milliseconds,
 * it sets the display style of the task form and overlay to 'none',
 * effectively hiding them from the user interface.
 */
function closeAddTaskForm() {
    const taskForm = document.querySelector(".floating-task-container");
    const overlay = document.getElementById("task-form-overlay");
    taskForm.classList.add("slide-out");

    setTimeout(() => {
        taskForm.style.display = "none";
        overlay.style.display = "none";
    }, 500);
}

/**
 * Adds an event listener to the search button.
 * When the button is clicked, it triggers the `searchTasks` function
 * to filter and display tasks based on the user's input in the search field.
 */
document.querySelector(".search").addEventListener("click", searchTasks);

/**
 * Adds an event listener to the search input field to handle user input.
 * When the input field is cleared (value is empty), all tasks are displayed.
 */
document.getElementById("search-input-id").addEventListener("input", function () {
    if (this.value === "") {
        displayAllTasks();
    } else if (this.value !== "") {
        searchTasks();
    }
});

/**
 * Searches for tasks based on user input and filters the displayed tasks accordingly.
 *
 * This function retrieves the search input from the user, converts it to lowercase,
 * and checks if the input is empty. If it is, it displays all tasks. If not, it filters
 * the `tasksArray` to find tasks whose title, description, or category includes the search
 * input. The filtered tasks are then displayed using `displayFilteredTasks()`.
 * If no tasks match the search criteria, it invokes `showNoResultsMessage()`.
 */
let countOfNoResultMessages = 0;
function searchTasks() {
    const searchInputValue = document.getElementById("search-input-id").value.toLowerCase();
    if (searchInputValue === "") {
        displayAllTasks();
        return;
    }
    const filteredTasks = tasksArray.filter((task) => {
        return task.title.toLowerCase().includes(searchInputValue) || task.taskDescription.toLowerCase().includes(searchInputValue) || task.category.toLowerCase().includes(searchInputValue);
    });
    displayFilteredTasks(filteredTasks);
    if (filteredTasks.length === 0 && countOfNoResultMessages < 1) {
        showNoResultsMessage();
    }
}

/**
 * Displays a message overlay indicating that no search results were found.
 *
 * This function creates an overlay element and a message container, which contains
 * a message informing the user that no matches were found. An "OK" button is included
 * to allow the user to close the message. The overlay is appended to the body of the document.
 */
function showNoResultsMessage() {
    countOfNoResultMessages++;
    const overlay = document.createElement("div");
    overlay.classList.add("message-overlay");
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("no-results-message");
    messageContainer.innerHTML = `
        <p>Sorry, no matches found</p>
        <button class="ok-button" onclick="closeNoResultsMessage()">OK</button>
    `;
    overlay.appendChild(messageContainer);
    document.body.appendChild(overlay);
}

/**
 * Closes the no results message overlay and resets the search input.
 *
 * This function removes the message overlay from the document, clears the search input field,
 * and displays all tasks again. It ensures that the user can start a new search
 * without any previous filters applied.
 */
function closeNoResultsMessage() {
    const overlay = document.querySelector(".message-overlay");
    if (overlay) {
        overlay.remove();
    }
    document.getElementById("search-input-id").value = "";
    displayAllTasks();
    countOfNoResultMessages--;
    location.reload();
}

/**
 * Displays all tasks in the task board.
 *
 * This function calls `displayFilteredTasks` with the complete tasks array,
 * ensuring that all tasks are visible to the user.
 */
function displayAllTasks() {
    displayFilteredTasks(tasksArray);
}

/**
 * Opens the details of a specific task based on the provided task ID.
 *
 * @param {string} taskId - The ID of the task whose details are to be displayed.
 * @returns {void} - Does not return a value.
 *
 * This function searches for the task in the tasksArray using the taskId.
 * If the task is found, it creates the task detail view and displays it.
 */
function openTaskDetail(taskId) {
    const task = tasksArray.find((t) => t.id === taskId);
    if (!task) return;

    createTaskDetail(task);

    const taskDetails = document.getElementById("taskDetailsOverlay");
    if (taskDetails) {
        taskDetails.style.display = "flex";
        taskDetails.classList.remove("task-details-slideOut");
        taskDetails.classList.add("task-details-slideIn");
        addOverlayClickListener();
    }
}

/**
 * Attaches event handlers to the confirmation buttons in the confirmation dialog.
 *
 * @param {HTMLElement} confirmationDiv - The confirmation dialog element containing the buttons.
 * @param {function} resolve - A function that resolves the promise returned by showDeleteConfirmation.
 *
 * This function sets up click event listeners for the "Yes" and "No" buttons in the
 * confirmation dialog. When a button is clicked, it resolves the promise with
 * either true or false and closes the confirmation dialog.
 */
function attachConfirmationHandlers(confirmationDiv, resolve) {
    confirmationDiv.querySelector(".yesButton").addEventListener("click", () => {
        resolve(true);
        closeConfirmationDiv(confirmationDiv);
    });
    confirmationDiv.querySelector(".noButton").addEventListener("click", () => {
        resolve(false);
        closeConfirmationDiv(confirmationDiv);
    });
}

/**
 * Closes and removes the confirmation dialog and its overlay from the DOM.
 *
 * @param {HTMLElement} confirmationDiv - The confirmation dialog element to be closed.
 *
 * This function removes the confirmation dialog and its associated overlay
 * from the DOM, effectively closing the confirmation interface.
 */
function closeConfirmationDiv(confirmationDiv) {
    confirmationDiv.remove();
    const deleteOverlay = document.querySelector(".delete-overlay");
    if (deleteOverlay) {
        deleteOverlay.remove();
    }
}

/**
 * Closes the "Add Task" form and reloads the tasks.
 * This function is used to ensure that the "Add Task" form is closed and the task list is refreshed.
 *
 * @returns {void} - This function does not return any value.
 */
function closeBoardAddTaskIfNeeded() {
    closeAddTaskForm();
    loadTasks();
}
