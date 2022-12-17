const url = "https://api.github.com/search/repositories?q=";
let repositoryArray = [];
let repositoryArrayTag = [];

const debounce = (fn, ms) => {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(fn.bind(this, ...arguments), ms);
  };
};

// Создание разметки

function createElement(tag, classAdd, container) {
  const element = document.createElement(tag);
  element.classList.add(classAdd);
  container.append(element);
}

createElement("div", "app", document.body);
const app = document.querySelector(".app");
createElement("div", "app__search", app);
const searchInput = app.querySelector(".app__search");
createElement("input", "app__input", searchInput);
const inputBox = searchInput.querySelector(".app__input");
inputBox.setAttribute("placeholder", "Enter...");
createElement("div", "app__autocomplit", searchInput);
const autoBox = searchInput.querySelector(".app__autocomplit");
createElement("div", "box-repository", searchInput);
let repoBox = document.querySelector(".box-repository");

// запрос и отображение списка ответов

function gitRequest(e, url) {
  let userValue = e.target.value;
  userValue = encodeURIComponent(userValue);
  let counter = 0;
  if (userValue) {
    fetch(url + userValue + "&per_page=5")
      .then((response) => response.json())
      .then((answer) => {
        repositoryArray = answer.items;
        repositoryArrayTag = repositoryArray.map(
          (el) => `<li id="${counter++}">${el.name}</li>`
        );
        showSugg(repositoryArrayTag);
      })
      .catch(() => alert("Error"));
  } else {
    repositoryArray = [];
    repositoryArrayTag = [];
    showSugg(repositoryArrayTag);
  }
}

function showSugg(arr) {
  let arrData;
  if (!arr.length) {
    arrData = null;
  } else {
    arrData = arr.join("");
  }
  autoBox.innerHTML = arrData;
}

const debounceRequest = debounce(gitRequest, 350);

inputBox.addEventListener("keyup", (e) => {
  debounceRequest(e, url);
});

//  Добавление репозитория

function insertRepository(e) {
  let target = e.target;
  if (target.tagName === "LI") {
    let id = target.id;
    const rep = document.createElement("div");
    rep.classList.add("box-repository__rep");
    rep.innerHTML = `<li>Name: ${repositoryArray[id].name}</li>
    <li>Owner: ${repositoryArray[id].owner.login}</li>
    <li>Stars: ${repositoryArray[id].stargazers_count}</li>`;
    repoBox.append(rep);
    const btn = document.createElement("div");
    btn.classList.add("box-repository__btn");
    btn.setAttribute("data-action", "delete");
    rep.append(btn);
    inputBox.value = "";
    repositoryArray = [];
    repositoryArrayTag = [];
    showSugg(repositoryArrayTag);
  }
}

autoBox.addEventListener("click", (e) => {
  insertRepository(e);
});

// Удаление репозитория

repoBox.addEventListener("click", (e) => {
  let target = e.target;
  if (target.dataset.action === "delete") {
    target.closest(".box-repository__rep").remove();
  }
});
