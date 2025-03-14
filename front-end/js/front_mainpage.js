const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
    menu.classList.toggle("active");
});

document.addEventListener("click", (event) => {
    if (!menu.contains(event.target) && event.target !== menuBtn) {
        menu.classList.remove("active");
    }
});

// const wrapper = document.querySelector('.wrapper_login')
// const registerLink = document.querySelector('.register-link')
// const loginLink = document.querySelector('.login-link')
// const btn = document.querySelector('.button_header ')
// const iconClose = document.querySelector('.icon-close')
// const darkmode =document.querySelector(".darkMode")





// btn.addEventListener('click',()=>{
// wrapper.classList.add('active-popup')
// })
// iconClose.addEventListener('click',()=>{
// wrapper.classList.remove('active-popup')
// })

// registerLink.addEventListener("click",()=> {
// wrapper.classList.add('active');
// })

// loginLink.addEventListener("click",()=> {
// wrapper.classList.remove('active');
// })



// document.querySelectorAll('.icon-close').forEach(iconClose => {
// iconClose.addEventListener('click', () => {
//     wrapper.classList.remove('active-popup');
// });
// });


// darkmode.addEventListener("click", ()=>{
// darkmode.classList.add('active')
// });