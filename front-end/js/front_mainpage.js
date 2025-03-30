import {mainPageFunctionsHandler} from "./functions.js";
const mainPageFunctions = new mainPageFunctionsHandler();

// -----------------------  Menu Pop Up Button ------------------------
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
});

document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && event.target !== menuBtn) {
        menu.classList.remove('active');
    }
});

const logOutBtn = document.getElementById('LogOut');
logOutBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    console.log(`Button Log Out clicked`);
    mainPageFunctions.logOut();
});
