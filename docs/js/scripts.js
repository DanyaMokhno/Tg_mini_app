let tg = window.Telegram.WebApp;

// Nickname assignment
let Nickname = document.getElementById("username");
console.log(Nickname);
Nickname.innerText =
  tg.initDataUnsafe.user.first_name + " " + tg.initDataUnsafe.user.last_name;

// Back Button
const backButton = tg.BackButton;
// Показывать кнопку только если есть GET параметры
// Показывать кнопку только если есть параметры
// и страница не главная
if (window.location.search && window.location.pathname !== "/") {
  backButton.show();
} else {
  backButton.hide();
}
backButton.onClick(() => {
  history.back();
});
