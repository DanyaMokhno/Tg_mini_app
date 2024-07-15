const farm_button = document.getElementById("farm_button");
let farm_start_time;

function progress_farms(time_str) {
  const time = new Date(time_str);
  const currentTime = new Date();

  const totalDuration = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  let elapsedTime = Math.min(currentTime - time, totalDuration);

  const updateButtonState = () => {
    if (elapsedTime >= totalDuration) {
      // If the elapsed time is already more than 3 hours, fill the button completely
      farm_button.style.background =
        "linear-gradient(to right, #84b2a0 100%, #a5c7ba 0%)";
      farm_button.disabled = false;
      farm_button.classList.remove("running");
      farm_button.innerText = "Процесс окончен";
    } else {
      // Calculate the initial gradient fill based on the elapsed time
      let percentComplete = (elapsedTime / totalDuration) * 100;
      farm_button.style.background = `linear-gradient(to right, #84b2a0 ${percentComplete}%, #a5c7ba ${percentComplete}%)`;
      const remainingTime = new Date(totalDuration - elapsedTime);
      const hours = remainingTime.getUTCHours();
      const minutes = remainingTime.getUTCMinutes();
      const seconds = remainingTime.getUTCSeconds();
      farm_button.innerText = `${hours}h ${minutes}m ${seconds}s`;
      farm_button.disabled = true;
      farm_button.classList.add("running");
    }
  };

  updateButtonState();

  const startAnimation = () => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      elapsedTime = Math.min(currentTime - time, totalDuration);
      updateButtonState();

      if (elapsedTime >= totalDuration) {
        clearInterval(interval);
      }
    }, 1000); // Update every second
  };

  startAnimation();

  // Add event listener to reset button state after it's clicked
  farm_button.addEventListener("click", () => {
    if (farm_button.innerText === "Процесс окончен") {
      farm_button.style.background = "#a5c7ba";
      farm_button.innerText = "Farm";
    }
  });
}

// Example usage
// progress_farms("2024-07-15T08:00:00");

async function loadCash() {
  let balance = document.getElementById("balance_value");

  curCash = await fetchData("Get_current_cash", tg.initDataUnsafe.user.id);

  console.log(curCash.data);
  balance.innerText = curCash.data.balance;
  farm_start_time = curCash.data.start_farm_time;
  if (farm_start_time) {
    progress_farms(farm_start_time);
    console.log("already_farms");
  }
}

loadCash();
console.log(farm_start_time);

/**
 * TODO
 * надо крч добавить чтобы у меня кнопка была в двух состояниях, и типо в зависимосити от состояния кнопки у меня
 * отправляестя соответствующий запрос, и типо если там всё нафармилось, то я тупо сбрасываю время начала фарминга в None,
 * увеличиваю баланс, и меняю цвет кнопки, и тогда, нажав её снова, будет отправлятся уже другой запрос, говорящий,
 * что мы начали фармить
 */

farm_button.addEventListener("click", async () => {
  console.log("фармим бабло");
  const time = new Date(farm_start_time);
  const currentTime = new Date();
  const Duration = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  if (!farm_start_time) {
    farm_start_time = await fetchData("Farm_start", tg.initDataUnsafe.user.id); // time
    progress_farms(farm_start_time);
  } else if (currentTime - time >= Duration) {
    response = await fetchData("Farm_end", tg.initDataUnsafe.user.id); // None
    if (response.data) loadCash();
    else alert("error");
  }
});
