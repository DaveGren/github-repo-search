const apiUrl = 'https://api.github.com';
const searchButton = document.getElementById('search-button');

let httpRequest;
let searchFn;

// init
(function init() {
    initAjax();

    httpRequest.onreadystatechange = searchForPhrase(0);

    watchOnEnter();
    watchOnSearchButton();
})();

function searchForPhrase(delay = 300) {
    const searchPhrase = document.getElementsByClassName('search-input')[0].value;

    if (!searchPhrase) {
        return;
    }

    clearTimeout(searchFn);
    searchFn = setTimeout(() => featchRepoList(searchPhrase), delay);
}

function watchOnEnter() {
    document.addEventListener('keyup', ({ key }) => {
        if (key === 'Enter') {
            searchForPhrase(0);
        }
    });
}

function watchOnSearchButton() {
    searchButton.addEventListener('click', () => searchForPhrase(0))
}

function featchRepoList(searchPhrase) {
    table = document.getElementsByClassName('list-container')[0];

    clear();

    getRepoList(searchPhrase)
        .then(
            (data) => {
                const { items } = JSON.parse(data);
                const header = creatRowWithValues('th', 'No.', 'Name', 'Login', 'Dpwnload url');
                
                table.appendChild(header);

                items.forEach(({ name, downloads_url, owner: { login }}, index) => {
                    const rowElement = creatRowWithValues('tr', index +1, name, login, downloads_url);

                    table.appendChild(rowElement);
                });
            }
            
        )
        .catch(
            (error) => console.error('Promise error: ', error)
        )
}

function clear() {
    while (table.lastElementChild) {
        table.removeChild(table.lastElementChild);
      }
}

function creatRowWithValues(domElement, ...list) {
    const row = document.createElement(domElement);
    row.setAttribute('class', 'list-element');

    list.forEach((value) => {
        const cell = creatCell(value);

        row.appendChild(cell);
    })

    return row;
}

function creatCell(value) {
    if (!!value) {
        value.toString().substring(0,30);
    }
    const cell = document.createElement('td');
    cell.innerHTML = value;

    return cell;
}

function getRepoList(searchPhrase = '') {
    const searchFor = searchPhrase.trim().toLowerCase();
    const params = `?q=${searchFor}&type=Repositories`

    return new Promise((resolve, reject) => {
        httpRequest.addEventListener("load", () => resolve(httpRequest.responseText));
        httpRequest.open('GET', `${apiUrl}/search/repositories${params}`);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send();
    })
}

function initAjax() {
    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
}
