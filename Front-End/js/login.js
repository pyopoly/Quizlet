const endpoint = "https://jacknteg.com/4537/termproject/API/V1";
const resource = "/admin/user";

var jwt = localStorage.getItem("jwt");
if (jwt != null) {
  window.location.href = './endpointCounter.html'
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "http://jacknteg.com/4537/termproject/API/V1/admin/user");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "username": username,
    "password": password
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      console.log(objects);
      console.log(objects.length);
      if (objects.length == 1) {
        localStorage.setItem("jwt", objects['accessToken']);
        window.location.href = './endpointCounter.html';
        };
      } else {
        alert("Wrong user or password");
      }
  };
  return false;
}