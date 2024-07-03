let tg = window.Telegram.WebApp;

// Nickname assignment
let Nickname = document.getElementById("username");
console.log(Nickname);
Nickname = tg.initDataUnsafe.first_name + tg.initDataUnsafe.last_name;
