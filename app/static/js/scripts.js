const tg = window.Telegram.WebApp;

// Nickname assignment
let Nickname = document.getElementById("username");
if (Nickname) {
  Nickname.innerText =
    tg.initDataUnsafe.user.first_name + " " + tg.initDataUnsafe.user.last_name;
}

// const url = "";
// Data loading
async function fetchData(endpoint, data) {
  try {
    const response = await axios.post(`${window.location.origin}/${endpoint}`, {
      data,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

// Back Button
const backButton = tg.BackButton;
// Показывать кнопку только если есть GET параметры
// Показывать кнопку только если есть параметры
// и страница не главная
if (window.location.pathname !== "/") {
  backButton.show();
} else {
  backButton.hide();
}
backButton.onClick(() => {
  history.back();
});
