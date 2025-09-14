/**
 * Fetches contacts from the server and stores their names and colors in `contactList` and `colors` arrays.
 * This data is used for displaying contacts in the dropdown list.
 *
 * @async
 */
let contactsWithColors = [];

async function fetchContacts() {
    let response = await fetch(BASE_URL + "/contacts.json");
    let contactsData = await response.json();
    contactList = [];
    colors = [];

    for (let id in contactsData) {
        let contact = contactsData[id];
        if (contact.name) {
            contactList.push(contact.name);
            colors.push(contact.color);
        }
    }
    contactsWithColors = sortContactsWithColors(combineContactsAndColors(contactList, colors));
}

/**
 * Displays the contacts dropdown list with fetched contacts and their colors.
 * Also updates the UI elements such as the dropdown arrow and the assigned placeholder.
 *
 * @async
 */
async function showContactsDropDown() {
    await fetchContacts();

    let assignedPlaceholder = document.getElementById("assigned-placeholder");
    if (selectedContacts.length >= 0) {
        assignedPlaceholder.innerHTML = "An";
    }
    setColorOfAssignedContainer();
    document.getElementById("contacts-dropwdown-arrow-container").innerHTML = /*html*/ `<img src="../img/addTask/arrow_drop_up.png" id="dropdown-arrow"/>`;

    let dropdownList = document.getElementById("dropdown-list");
    dropdownList.innerHTML = templateContactsHTMLDropdownList();

    dropdownList.classList.remove("d-none");
    document.getElementById("selected-contacts-circle-container").style.display = "none";

    showCheckedContactsAfterDropdownClosing();
}

/**
 * Updates the state of checkboxes in the contacts dropdown list based on previously selected contacts.
 */
function showCheckedContactsAfterDropdownClosing() {
    for (let i = 0; i < contactsWithColors.length; i++) {
        let contactName = contactsWithColors[i].contact;
        let checkBox = document.getElementById(`unchecked-box-${i}`);

        if (selectedContacts.includes(contactName)) {
            checkBox.src = "../img/checked.png";
        } else {
            checkBox.src = "../img/unchecked.png";
        }
    }
}

/**
 * Closes the contacts dropdown list and updates the UI elements, including showing selected contacts in circles.
 */
function closeContactsDropDown() {
    let assignedPlaceholder = document.getElementById("assigned-placeholder");
    assignedPlaceholder.innerHTML = /*html*/ `<span id="assigned-placeholder">Select contacts to assign</span>`;

    document.getElementById("contacts-dropwdown-arrow-container").innerHTML = /*html*/ `<div id="contacts-dropwdown-arrow-container"><img src="../img/addTask/arrow_drop_down.svg" id="dropdown-arrow" /></div>`;
    document.getElementById("dropdown-list").classList.add("d-none");
    document.getElementById("selected-contacts-circle-container").style.display = "flex";

    removeColorOfBorderAssignedContainer();
    showCirclesOfSelectedContacts();
}

/**
 * Selects or deselects a contact based on the current checkbox state and updates the UI accordingly.
 *
 * @param {string} contactName - The name of the contact to be selected or deselected.
 * @param {number} index - The index of the contact in the contact list.
 */
function selectContact(contactName, index, color) {
    if (selectedContacts.includes(contactName)) {
        handleContactDeselection(contactName, index);
    } else {
        handleContactSelection(contactName, index, color);
    }
}

/**
 * Handles the selection of a contact by updating the UI and the selectedContacts array.
 *
 * @param {string} contactName - The name of the contact to be selected.
 * @param {number} index - The index of the contact in the contact list.
 */
function handleContactSelection(contactName, index, selectedContactColor) {
    let assignedPlaceholder = document.getElementById("assigned-placeholder");

    if (!selectedContacts.includes(contactName)) {
        selectedContacts.push(contactName);
        selectedColors.push(selectedContactColor);
        assignedPlaceholder.innerHTML = /*html*/ `<span id="assigned-placeholder">An</span>`;
        document.getElementById("assigned-container").classList.add("heightAuto");
        document.getElementById(`unchecked-box-${index}`).src = "../img/checked.png";
    }
}

/**
 * Handles the deselection of a contact by updating the UI and the selectedContacts array.
 *
 * @param {string} contactName - The name of the contact to be deselected.
 * @param {number} index - The index of the contact in the contact list.
 */
function handleContactDeselection(contactName, index) {
    let contactColor = colors[index];
    let indexOfSelectedContact = selectedContacts.indexOf(contactName);
    let indexOfSelectedColor = selectedColors.indexOf(contactColor);

    document.getElementById(`unchecked-box-${index}`).src = "../img/unchecked.png";

    if (indexOfSelectedContact >= 0) {
        selectedContacts.splice(indexOfSelectedContact, 1);
    }
    if (indexOfSelectedColor >= 0) {
        selectedColors.splice(indexOfSelectedColor, 1);
    }

    if (selectedContacts.length === 0) {
        document.getElementById("assigned-container").classList.remove("heightAuto");
    }
}

/**
 * Sets a colored border for the assigned contacts container when contacts are selected.
 */
function setColorOfAssignedContainer() {
    let selectContactsContainer = document.getElementById("selected-name");
    selectContactsContainer.style.border = "1px solid #90D1ED";
}

/**
 * Removes the colored border from the assigned contacts container.
 */
function removeColorOfBorderAssignedContainer() {
    let selectContactsContainer = document.getElementById("selected-name");

    if (document.getElementById("edit-selected-name")) {
        selectContactsContainer = document.getElementById("edit-selected-name");
    }

    selectContactsContainer.style.border = "";
}

function showCirclesOfSelectedContacts() {
    /**
     * The container where the contact circles will be rendered.
     * @type {HTMLElement}
     */
    let circleContainer = document.getElementById("selected-contacts-circle-container");
    circleContainer.innerHTML = "";

    /**
     * Maximum number of circles to display.
     * @const {number}
     */
    let maxCircles = 6;

    /**
     * Number of contacts that exceed the maximum displayed circles.
     * @type {number}
     */
    let remainingContacts = selectedContacts.length - maxCircles;

    // Loop through selected contacts and render up to the maximum limit
    for (let i = 0; i < selectedContacts.length; i++) {
        if (i >= maxCircles) break;

        /**
         * HTML for a single contact circle.
         * @type {string}
         */
        let contactHTML = generateContactCircleHTML(selectedContacts[i]);
        circleContainer.innerHTML += contactHTML;
    }

    // If there are more contacts, append the "+X more" indicator
    if (remainingContacts > 0) {
        /**
         * HTML for the remaining contacts indicator.
         * @type {string}
         */
        let remainingText = generateRemainingContactsHTML(remainingContacts);
        circleContainer.innerHTML += remainingText;
    }
}

/**
 * Generates the HTML string for a contact circle.
 *
 * @param {string} contact - The full name of the contact (e.g., "John Doe").
 * @returns {string} HTML string for a single contact circle.
 */
function generateContactCircleHTML(contact) {
    /**
     * Index of the contact in the contact list.
     * @type {number}
     */
    let choosenContact = contactList.indexOf(contact);

    /**
     * Split the contact name into first and last names.
     * @type {string[]}
     */
    let [firstName, lastName] = contact.split(" ");

    /**
     * The first letter of the contact's first name.
     * @type {string}
     */
    let firstLetter = firstName.charAt(0).toUpperCase();

    /**
     * The first letter of the contact's last name.
     * @type {string}
     */
    let lastLetter = lastName.charAt(0).toUpperCase();

    /**
     * Background color for the contact circle.
     * @type {string}
     */
    let color = colors[choosenContact];

    return /*html*/ `<div class="circle" style="background-color: ${color}">${firstLetter}${lastLetter}</div>`;
}

/**
 * Generates the HTML string for the "+X more" indicator.
 *
 * @param {number} remainingContacts - The number of additional contacts not displayed as circles.
 * @returns {string} HTML string for the "+X more" indicator.
 */
function generateRemainingContactsHTML(remainingContacts) {
    return /*html*/ `<div class="moreCirlce">+${remainingContacts} weitere</div>`;
}

/**
 * Generates the HTML structure for the contacts dropdown list.
 * Contacts are sorted by their first name, and each contact is displayed with a colored circle and a checkbox.
 *
 * @returns {string} The generated HTML for the contacts dropdown list.
 */
function templateContactsHTMLDropdownList() {
    let dropdownHTML = "";

    let contactsWithColors = combineContactsAndColors(contactList, colors);
    contactsWithColors = sortContactsWithColors(contactsWithColors);

    for (let i = 0; i < contactsWithColors.length; i++) {
        let { contact, color } = contactsWithColors[i];
        let [firstName, lastName] = contact.split(" ");
        let firstLetter = firstName.charAt(0).toUpperCase();
        let lastLetter = lastName.charAt(0).toUpperCase();

        dropdownHTML += /*html*/ `
            <div class="dropdown-item" id="dropdown-list-contact-${i}"
                 onclick="selectContact('${contact}', ${i}, '${color}'), doNotCloseDropdown(event)">
                <div>
                    <div class="circle" style="background-color: ${color};">
                        ${firstLetter}${lastLetter}
                    </div>
                    <span class="contactsDropdownNameSpan">${contact}</span>
                </div>
                <img src="../img/unchecked.png" alt="unchecked" id="unchecked-box-${i}" class="uncheckedBox">
            </div>`;
    }

    return dropdownHTML;
}

/**
 * Combines two arrays – one with contacts and one with colors – into an array of objects.
 * Each object contains a contact and the associated color, based on the same position in both arrays.
 *
 * @param {Array<string>} contactList - An array of contact names as strings.
 * @param {Array<string>} colors - An array of colors as strings, where each color is associated with a contact.
 * The `contactList` and `colors` arrays must have the same length, as each contact is combined with the corresponding color.
 *
 * @returns {Array<{ contact: string, color: string }>} - An array of objects, where each object
 * contains a contact's name and the associated color.
 * Example: [{ contact: 'John Doe', color: '#ff0000' }, { contact: 'Jane Smith', color: '#00ff00' }]
 */
function combineContactsAndColors(contactList, colors) {
    let contactsWithColors = [];
    for (let i = 0; i < contactList.length; i++) {
        contactsWithColors.push({
            contact: contactList[i],
            color: colors[i],
        });
    }
    return contactsWithColors;
}

/**
 * Sorts an array of contacts with associated colors alphabetically based on the contact names.
 * The sorting is done in ascending order (A-Z) based on the `contact` property.
 *
 * @param {Array<{ contact: string, color: string }>} contactsWithColors - An array of objects,
 * each object represents a contact and contains two properties:
 *   - `contact` (string): The name of the contact by which the array will be sorted.
 *   - `color` (string): The color associated with the contact (ignored during sorting).
 *
 * @returns {Array<{ contact: string, color: string }>} - The sorted array of contact objects.
 * The array is sorted alphabetically in ascending order based on the `contact` property.
 */
function sortContactsWithColors(contactsWithColors) {
    return contactsWithColors.sort((a, b) => {
        if (a.contact < b.contact) return -1;
        if (a.contact > b.contact) return 1;
        return 0;
    });
}

/**
 * Displays a success message after the task is successfully added.
 * The message is shown for 2.5 seconds before sliding out.
 */
function showSuccessMessage() {
    setTimeout(successMessageSlidingIn, 500);

    setTimeout(function () {
        hideSuccessMessage();

        const createTask = document.getElementById("addTaskFromBoard");
        if (createTask && createTask.classList.contains("board-mode")) {
            closeBoardAddTaskIfNeeded();
        }
        window.location.href = "board.html";
    }, 2500);
}

/**
 * Animates the sliding in of the success message.
 */
function successMessageSlidingIn() {
    let successMessage = document.getElementById("success-message-container");
    successMessage.classList.add("slideInFromButton");
}

/**
 * Animates the sliding out of the success message.
 */
function hideSuccessMessage() {
    let successMessage = document.getElementById("success-message-container");
    successMessage.classList.remove("slideInFromButton");
}

/**
 * Prevents the dropdown from closing when clicking inside it.
 *
 * @param {Event} event - The click event.
 */
function doNotCloseDropdown(event) {
    event.stopPropagation();
}

/**
 * Handles clicking outside of the dropdown areas (contacts or category) to close any open dropdowns.
 *
 * @param {Event} event - The click event.
 */
document.addEventListener("DOMContentLoaded", () => {
    const contactsDropdown = document.getElementById("dropdown-list");
    const categoryDropdown = document.getElementById("category-dropdown-list");

    if (contactsDropdown && categoryDropdown) {
        document.addEventListener("click", clickOutsideOfDropdown);
    }
});

/**
 * Closes the contacts and category dropdowns if the user clicks outside of them.
 * If the category dropdown is visible and the user clicks outside of it, the dropdown is closed.
 * Additionally, the border of the category input field is reset if a category is selected.
 *
 * @param {MouseEvent} event - The MouseEvent object representing the click event.
 * The event contains information about where the user clicked.
 *
 * @returns {void} - This function does not return any value.
 */
function clickOutsideOfDropdown(event) {
    let contactsDropdown = document.getElementById("dropdown-list");
    let categoryDropdown = document.getElementById("category-dropdown-list");

    let clickedInsideContacts = contactsDropdown && contactsDropdown.contains(event.target);
    let clickedInsideCategory = categoryDropdown && categoryDropdown.contains(event.target);

    if (!clickedInsideContacts && !clickedInsideCategory) {
        if (contactsDropdown && !contactsDropdown.classList.contains("d-none")) {
            closeContactsDropDown();
        }

        if (categoryDropdown && !categoryDropdown.classList.contains("d-none")) {
            closeCategoryDropDown();
        }
        if (selectedCategory) {
            let categoryInput = document.getElementById("selected-category");
            categoryInput.style.border = "1px solid #d1d1d1";
        }
    }
}