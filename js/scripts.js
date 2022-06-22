// Fetch API
let dataOriginal;
fetch("https://randomuser.me/api/?nat=gb,us&results=12")
  .then((data) => data.json())
  .then((data) => (dataOriginal = data.results))
  .then((data) => gallery(dataOriginal));

// Search Container
document.querySelector("div.search-container").insertAdjacentHTML(
  "beforeend",
  `
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
    `
);

// Gallery Function
function gallery(data) {
  document.querySelector("div#gallery").innerHTML = "";
  if (data.length === 0) {
    document.querySelector(
      "div#gallery"
    ).innerHTML = `<h2>No results found...</h2>`;
  } else {
    for (let i = 0; i < data.length; i++) {
      document.querySelector("div#gallery").insertAdjacentHTML(
        "beforeend",
        `
                    <div class="card">
                        <div class="card-img-container">
                            <img class="card-img" src="${data[i].picture.thumbnail}" alt="profile picture">
                        </div>
                        <div class="card-info-container">
                            <h3 id="name" class="card-name cap">${data[i].name.first} ${data[i].name.last}</h3>
                            <p class="card-text">${data[i].email}</p>
                            <p class="card-text cap">${data[i].location.city}, ${data[i].location.state}</p>
                        </div>
                    </div>
                    `
      );
    }
  }
  eventListeners(data);
}

// Modal popup and switch buttons
function eventListeners(data) {
  let allCards = document.querySelectorAll("div.card");
  for (let i = 0; i < allCards.length; i++) {
    allCards[i].addEventListener("click", (e) => {
      modalPopup(data[i]);
      switchButtons(data, i);
    });
  }
}

// Search filter functionality
document.querySelector("input#search-input").addEventListener("keyup", (e) => {
  let updatedData = [];
  for (let j = 0; j < dataOriginal.length; j++) {
    if (
      dataOriginal[j].name.first
        .toUpperCase()
        .includes(e.target.value.toUpperCase()) ||
      dataOriginal[j].name.last
        .toUpperCase()
        .includes(e.target.value.toUpperCase())
    ) {
      updatedData.push(dataOriginal[j]);
    }
  }
  gallery(updatedData);
});

// Prev and Next button functionality
function switchButtons(data, position) {
  document.querySelector("div.modal-container").insertAdjacentHTML(
    "beforeend",
    `
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
    `
  );

  // Remove modal popup once close button clicked
  document
    .querySelector("button.modal-close-btn")
    .addEventListener("click", (e) => {
      document.querySelector("div.modal-container").remove();
    });

  // For when the previous button is clicked
  document.querySelector("button.modal-prev").addEventListener("click", (e) => {
    document.querySelector("div.modal-container").remove();
    position -= 1;
    if (data.length > position && position !== -1) {
      modalPopup(data[position]);
      switchButtons(data, position);
    }
  });

  // For when the next button is clicked
  document.querySelector("button.modal-next").addEventListener("click", (e) => {
    document.querySelector("div.modal-container").remove();
    position += 1;
    if (data.length > position) {
      modalPopup(data[position]);
      switchButtons(data, position);
    }
  });
}

// Popup display formatting
function modalPopup(data) {
  let dobSplit = data.dob.date.slice(0, 10).split("-");
  let dob = `${dobSplit[1]}/${dobSplit[2]}/${dobSplit[0]}`;
  let phoneSplit = data.phone
    .toString()
    .replaceAll(" ", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("-", "");
  let phone = `(${phoneSplit.substring(0, 3)}) ${phoneSplit.substring(
    3,
    6
  )}-${phoneSplit.substring(6)}`;

  document.querySelector("body").insertAdjacentHTML(
    "beforeend",
    `
            <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${data.picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${data.name.first} ${data.name.last}</h3>
                        <p class="modal-text">${data.email}</p>
                        <p class="modal-text cap">${data.location.city}, ${data.location.country}</p>
                        <hr>
                        <p class="modal-text">${phone}</p>
                        <p class="modal-text">${data.location.street.number} ${data.location.street.name}, ${data.location.state}, ${data.location.postcode}</p>
                        <p class="modal-text">Birthday: ${dob}</p>
                    </div>
                </div>
            </div>
            `
  );
}