const endpoint = "https://jacknteg.com/4537/termproject/API/V1";
const resource = "/get/counters";


const xhttp = new XMLHttpRequest();

const localCounters = {
    "/get/counters": 3,
    "/get/quizzes": 1,
    "/post/quiz": 2,
};

const table = document.getElementById("table");

function onload() {
    let token = sessionStorage.getItem("token");
    console.log("Token:", token);
    // if (!token) {
    //     table.innerHTML += `Invalid Token`;
    //     return;
    // }

    let promise = new Promise(function (resolve, reject) {
        // Get from db.
        xhttp.open("GET", endpoint + resource, true);
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                    if (xhttp.status == 200) {
                        console.log(xhttp.responseText);
                        resolve(xhttp.responseText);
                    } else if (xhttp.readyState == 4 && xhttp.status >= 400) {
                        reject(`Something went wrong, status: ${xhttp.status}`);
                    }
                }
            }
    });
    promise.then(
        (counters) => {
            populateTable(JSON.parse(counters));
        },
        (msg) => {
            table.innerHTML += msg;
        }
    );
}

function populateTable(counters) {
    let markDown = ``;
    let header = `
    <thead>
    <tr>
      <th scope="col">Endpoint</th>
      <th scope="col">Count</th>
    </tr>
  </thead>
  `;
    Object.keys(counters).forEach((key) => {
        markDown += `
        <tr>
        <td>${key}</td>
        <td>${counters[key]}</td>
      </tr>
      `;
    });
    table.innerHTML = header + markDown;
}

onload();
