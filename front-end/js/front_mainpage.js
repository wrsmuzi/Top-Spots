import {mainPageFunctionsHandler} from "./functions.js";
const mainPageFunctions = new mainPageFunctionsHandler();

// -----------------------  Menu Pop Up Button ------------------------
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const closeBtn = document.getElementById('closeBtn');

menuBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && event.target !== menuBtn) {
        menu.classList.remove('active');
    }
});

closeBtn.addEventListener('click', () => {
    menu.classList.remove('active');
});

document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && event.target !== menuBtn) {
        menu.classList.remove('active');
    }
});



// -----------------------  Log Out Button ------------------------
const logOutBtn = document.getElementById('LogOut');
logOutBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    console.log(`Button Log Out clicked`);
    mainPageFunctions.logOut();
});
