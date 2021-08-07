const container = document.querySelector("#intro");
const text = document.querySelector("#text");
text.style.textAlign = "center";
const menu = document.querySelector("#menu");
const playGameBtn = document.getElementById("play-game");
const statsBtn = document.getElementById("stats");

if (localStorage.getItem("first_time") === "true") {
  localStorage.setItem("first_time", "false");
  container.addEventListener("animationend", function () {
    container.style.animation = "2s fade-out ease-in";
    container.addEventListener("animationend", function () {
      text.innerHTML = "By <b>Humoyun Dev</b>";
      container.style.animation = "3s fade-in ease-in";
      container.addEventListener("animationend", function () {
        container.style.animation = "3s fade-out ease-in";
        container.addEventListener("animationend", function () {
          text.textContent = "Loading";
          container.style.animation = "3s s-fade-in ease-in";
          container.addEventListener("animationend", function () {
            var count = 0;
            var interval = setInterval(function () {
              count++;
              if (count < 4) {
                text.textContent += ".";
              } else {
                count = 0;
                text.textContent = "Loading";
              }
            }, 300);
            setTimeout(function () {
              clearInterval(interval);
              document.body.removeChild(container);
              var cnr = document.createElement("div");
              cnr.classList.add("wrapper-xy-center");
              cnr.classList.add("fixed");
              menu.style.display = "block";
              cnr.appendChild(menu);
              document.body.appendChild(cnr);
            }, 6000);
          });
        });
      });
    });
  });
} else {
  document.body.removeChild(container);
  var cnr = document.createElement("div");
  cnr.classList.add("wrapper-xy-center");
  cnr.classList.add("fixed");
  menu.style.display = "block";
  cnr.appendChild(menu);
  document.body.appendChild(cnr);
}