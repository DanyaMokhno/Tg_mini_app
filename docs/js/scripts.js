let tg = window.Telegram.WebApp;

// Nickname assignment
let Nickname = document.getElementById("username");
console.log(Nickname);
Nickname = tg.initDataUnsafe.user.first_name + tg.initDataUnsafe.user.last_name;
