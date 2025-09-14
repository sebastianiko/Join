/** initializes the listed functions.
* @param {string} userName - contains the user name or the name 'guest'.
*/ 
async function guestSession() {
    userName = 'Guest';
    await loadTaskDataGuest();
    loadHtmlTemplates();
    greeting();
    checkIfMobileOrDesktopGreeting();
} 


/** 
* requests the tasks from the database by calling several functions.
*/ 
async function loadTaskDataGuest() {
    await countTasks();
    await amountOfToDoTasks();
    await amountOfDoneTasks();
    await amountOfLowTasks();
    await amountOfMediumTasks();
    await amountOfUrgentTasks();
    await amountOfTasksInProgress();
    await amountOfTasksAwaitingFeedback();
    deadlineDate = await nextTaskDeadline();
}


/** 
 * counts and returns the amount of the tasks added to the board.
 * by fetching data from the base URL, extracting the `tasks` object and counting the number of its properties.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} tasksInBoard - stores the amount of tasks in the board.
 * @returns {number|undefined} - returns `undefined` in case an error occurred.
 */
async function countTasks() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        if (data && data.tasks) {
            tasksInBoard = Object.keys(data.tasks).length;
        } else {
            console.error("JSON does not include 'tasks' object or is invalid.");
        }
        return tasksInBoard;
    } catch (error) {
        console.error("error while fetching task data:", error);
    }
}


/** 
 * Iterates over the tasks in the provided data and checks if their status matches the given status value.
 * every time the status matches the counter is raised by 1. 
 * @param {Object} data - data object containing the tasks.
 * @param {string} statusValue - status value to check for.
 * @param {number} statusCount - stores the amount of tasks that match the specified status value.
 * @returns {number} - returns the value stored in 'statusCount'
 */
async function checkStatusOfTasks(data, statusValue) {
    let statusCount=0;
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            if (task.status) {
                if (task.status === statusValue) {
                    statusCount++;
                }
            }
        });
    }
    return statusCount;
}


/**
 * Counts the number of tasks with a status of "todo".
 * Fetches data from the base URL, extracts the tasks, and calls `checkStatusOfTasks` to count the "todo" tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} toDo - stores the amount of tasks that match the value 'todo'.
 * @returns {number} - returns the value stored in 'toDo'.
 */
async function amountOfToDoTasks() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        toDo = await checkStatusOfTasks(data, 'todo');
        return toDo;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/**
 * Counts the number of tasks with a status of "done".
 * Fetches data from the base URL, extracts the tasks, and calls `checkStatusOfTasks` to count the "done" tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} done - stores the amount of tasks that match the value 'done'.
 * @returns {number} - returns the value stored in 'done'.
 */
async function amountOfDoneTasks() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        done = await checkStatusOfTasks(data, 'done');
        return done;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/**
 * Counts the number of tasks with a status of "progress".
 * Fetches data from the base URL, extracts the tasks, and calls `checkStatusOfTasks` to count the "progress" tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} tasksInProgress - stores the amount of tasks that match the value 'progress'.
 * @returns {number} - returns the value stored in 'progress'.
 */
async function amountOfTasksInProgress() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        tasksInProgress = await checkStatusOfTasks(data, 'in-progress');
        return tasksInProgress;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/**
 * Counts the number of tasks with a status of "feedback".
 * Fetches data from the base URL, extracts the tasks, and calls `checkStatusOfTasks` to count the "feedback" tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} tasksInFeedback - stores the amount of tasks that match the value 'feedback'.
 * @returns {number} - returns the value stored in 'feedback'.
 */
async function amountOfTasksAwaitingFeedback() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        tasksInFeedback = await checkStatusOfTasks(data, 'await-feedback');
        return tasksInFeedback;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/** 
 * Iterates over the tasks in the provided data and checks if their priority matches the given priority value.
 * every time the priority matches, the counter is raised by 1. 
 * @param {Object} data - data object containing the tasks.
 * @param {string} priorityValue - priority value to check for.
 * @param {number} priorityCount - stores the amount of tasks that match the specified priority value.
 * @returns {number} - returns the value stored in 'priorityCount'
 */
async function checkPriorityOfTasks(data, priorityValue) {
    let priorityCount=0;
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            if (task.priority) {
                if (task.priority === priorityValue) {
                    priorityCount++;
                }
            }
        });
    }
    return priorityCount;
}


/**
 * Counts the number of tasks with a priority of "low".
 * Fetches data from the base URL, extracts the task priority properties and calls `checkPriorityOfTasks` to count the "low" tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} low - stores the amount of tasks that match the value 'low'.
 * @returns {number} - returns the value stored in 'low'.
 */
async function amountOfLowTasks() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        low = await checkPriorityOfTasks(data, 'low');
        return low;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/**
 * Counts the number of tasks with a priority of "medium".
 * Fetches data from the base URL, extracts the task priority properties and calls `checkPriorityOfTasks` to count the "medium" tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} medium - stores the amount of tasks that match the value 'medium'.
 * @returns {number} - returns the value stored in 'medium'.
 */
async function amountOfMediumTasks() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        medium = await checkPriorityOfTasks(data, 'medium');
        return medium;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/**
 * Counts the number of tasks with a priority of "urgent".
 * Fetches data from the base URL, extracts the task priority properties and calls `checkPriorityOfTasks` to count the "urgent" tasks.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {number} urgent - stores the amount of tasks that match the value 'urgent'.
 * @returns {number} - returns the value stored in 'urgent'.
 */
async function amountOfUrgentTasks() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        urgent = await checkPriorityOfTasks(data, 'urgent');
        return urgent;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/** 
 * Iterates over the tasks in the provided data and checks if the stored task deadlines lie in the future.
 * every time this check is true, the date is pushed to the array called 'deadlineArray'.
 * @param {Object} data - data object containing the tasks.
 * @param {Array} deadlineArray - stores the pushed date objects.
 */
async function pushDatesIntoDeadlineArrayGuest(data) {
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            if (task.date) {
                if (checkIfDeadlineLaterThanToday(task.date) === true) {
                    deadlineArray.push(task.date);
                }
            }
        });
    }
}


/**
 * Retrieves the next task deadline.
 * Fetches data from the specified URL, extracts task information, calculates deadlines, finds the earliest deadline, and formats it.
 * @param {string} baseUrl - basic Url for all API requests.
 * @param {object} data - stores the API response in JSON format.
 * @param {date} earliestDeadlineFormatted - finds the date object with the nearest upcoming date in the array 'deadlineArray'.
 * @param {date} earliestDeadline - formats the earliest upcoming date object.
 * @returns {string} - returns stored and formatted string value in 'earliestDeadline' or `undefined` if an error occurred.
 */
async function nextTaskDeadline() {
    try {
        const response = await fetch(`${baseUrl}.json`);
        const data = await response.json();
        await pushDatesIntoDeadlineArrayGuest(data);
        await checkIfDeadlineArrayEmpty(deadlineArray);
        await checkTaskPriorityOfNextDeadlineGuest(data);
        return {earliestDeadline, deadlineText};
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}


/**
 * finds the task with the earliest Deadline and extracts the priority of this task
 * @param {date} earliestDeadlineFormatted - stores the earliest Deadline in original / america format
 * @param {*} nextTaskPriority - stores the priority of the next task in the timeline
 */
async function checkTaskPriorityOfNextDeadlineGuest(data) {
    const dateParts = earliestDeadline.split('.');
    const earliestDeadlineFormatted = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
    if (data && data.tasks) {
        Object.values(data.tasks).forEach(task => {
            if (task.date) {
                if (task.date === earliestDeadlineFormatted) {
                    if (task.status !== "done") {
                        nextTaskPriority = task.priority;
                        return nextTaskPriority;
                    }
                }
            }
        });
    }
}