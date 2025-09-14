/**
 * Hides the "Help" and "User Profile" section on specific pages.
 *
 * This function checks the current page URL and hides the `.helpAndUserProfile`
 * div if the page is either the "Legal Notice" or the "Privacy Policy" page.
 *
 * Pages checked:
 * - Legal Notice (`legalnotice`)
 * - Privacy Policy (`privacypolicy`)
 *
 * @function hideHelpAndUserProfileOnSpecialPages
 */
function hideHelpAndUserProfileOnSpecialPages() {
    const helpAndUserProfileDiv = document.querySelector(".helpAndUserProfile");

    const currentPage = window.location.pathname.toLowerCase();

    if (currentPage.includes("legalnotice") || currentPage.includes("privacypolicy")) {
        helpAndUserProfileDiv.style.display = "none";
    }
}

/**
 * Retrieves the user's email from local storage.
 *
 * This function returns the email address stored in the browser's localStorage.
 *
 * @function getUserEmail
 * @returns {string|null} The user's email address, or null if not found.
 */
function getUserEmail() {
    return localStorage.getItem("email");
}

/**
 * Updates the user profile icon with the user's initials or 'G' for guest.
 *
 * This function retrieves the user's initials and email from localStorage and updates the
 * profile icon accordingly. If the user is logged in as a guest, it sets the profile icon
 * to 'G'. If the user is registered, it displays the user's initials. If no data is available,
 * it leaves the icon empty.
 *
 * @function updateUserProfileIcon
 * @returns {void}
 */
function updateUserProfileIcon() {
    const userProfileIcon = document.getElementById("userProfileIcon");
    const userInitials = localStorage.getItem("userInitials");
    const userEmail = localStorage.getItem("email");

    if (!userProfileIcon) {
        return;
    }
    if (userEmail === "guest@join.com") {
        userProfileIcon.textContent = "G";
    } else if (userInitials) {
        userProfileIcon.textContent = userInitials;
    } else {
        userProfileIcon.textContent = "";
    }
}

/**
 * Toggles the visibility of the user menu.
 * Ensures that clicking outside the menu or on menu links closes the menu.
 */
function toggleUserMenu() {
    const userMenu = document.getElementById("userMenuBox");
    const userProfileIcon = document.getElementById("userProfileIcon");

    if (!userMenu || !userProfileIcon) {
        console.error("User menu box or icon not found!");
        return;
    }

    const isMenuVisible = userMenu.style.display === "block";
    userMenu.style.display = isMenuVisible ? "none" : "block";

    if (!isMenuVisible) {
        addOutsideClickListener(userMenu, userProfileIcon);
        addMenuLinkListeners(userMenu);
    }
}

/**
 * Adds an event listener to close the user menu when clicking outside of it.
 * @param {HTMLElement} userMenu - The user menu element to monitor.
 * @param {HTMLElement} userProfileIcon - The user profile icon element to monitor.
 */
function addOutsideClickListener(userMenu, userProfileIcon) {
    document.addEventListener("click", function handleOutsideClick(event) {
        const isClickInsideMenu = userMenu.contains(event.target);
        const isClickOnIcon = userProfileIcon.contains(event.target);

        if (!isClickInsideMenu && !isClickOnIcon) {
            userMenu.style.display = "none";
            document.removeEventListener("click", handleOutsideClick);
        }
    });
}

/**
 * Adds click event listeners to menu links to close the user menu when clicked.
 * @param {HTMLElement} userMenu - The user menu element containing the links.
 */
function addMenuLinkListeners(userMenu) {
    const menuLinks = userMenu.querySelectorAll("a");
    menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            userMenu.style.display = "none";
        });
    });
}

/**
 * Highlights the active link in the navigation based on the current page.
 *
 * This function checks the current page's URL and applies the 'active' class
 * to the corresponding navigation link, either for the Privacy Policy or Legal Notice pages.
 *
 * @function highlightActiveLink
 * @returns {void}
 */
function highlightActiveLink() {
    const currentPage = window.location.href;
    const privacyLink = document.getElementById("privacyPolicy");
    const legalNoticeLink = document.getElementById("legalNotice");

    if (privacyLink && currentPage.includes("privacypolicy.html")) {
        privacyLink.classList.add("active");
    } else if (legalNoticeLink && currentPage.includes("legalnotice.html")) {
        legalNoticeLink.classList.add("active");
    }
}