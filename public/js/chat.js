let database = firebase.database();
let ref = database.ref("chat");
let scrollView = document.getElementById("scrollview");
const messageArea = document.getElementById("exampleFormControlTextarea2");
let chatJson = null;

ref.on("value", gotData, errData);

messageArea.addEventListener("change", val => {
  if (val.target.value != null) {
    sendToDatabase();
  }
});

function gotData(data) {
  let databaseData = data.val();
  scrollView.innerHTML = "";
  const tempData = Object.values(databaseData);
  for (let i = 0; i < tempData.length; i++) {
    const innerData = Object.values(tempData[i]);
    const name = innerData[1];
    const message = innerData[2];
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };

    const tempDate = new Date(innerData[0]);
    const date = tempDate.toLocaleDateString("en-US", options);
    if (chatJson != null) {
      for (let j = 0; j < chatJson.length; j++) {
        if (name != chatJson[i]) {
          scrollView.innerHTML += `<li class="d-flex justify-content-between mb-4">
                    <div class="chat-body white p-3 ml-2 z-depth-1">
                      <div class="header">
                        <strong class="primary-font">${name}</strong>
                        <small class="pull-right text-muted"><i class="far fa-clock"></i> ${date}</small>
                      </div>
                      <hr class="w-100">
                      <p class="mb-0">
                        ${message}
                      </p>
                    </div>
                  </li>`;
        }
      }
    } else {
      scrollView.innerHTML += `<li class="d-flex justify-content-between mb-4">
            <div class="chat-body white p-3 ml-2 z-depth-1">
              <div class="header">
                <strong class="primary-font">${name}</strong>
                <small class="pull-right text-muted"><i class="far fa-clock"></i> ${date}</small>
              </div>
              <hr class="w-100">
              <p class="mb-0">
                ${message}
              </p>
            </div>
          </li>`;
    }
    scrollView.scrollTop = scrollView.scrollHeight;
  }
}
function errData(err) {
  console.error(err);
}

function sendToDatabase() {
  if (messageArea.value != "") {
    let name = currentUser.displayName;
    const message = messageArea.value;

    let now = new Date().toLocaleDateString();
    let data = {
      name: name,
      message: message,
      date: now
    };
    ref.push(data);
    messageArea.value = "";
  }
}
