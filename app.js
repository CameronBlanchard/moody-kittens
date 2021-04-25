// @ts-nocheck
/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = [];
let kittensGone = [];
/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault()
  let form = event.target
  let kitten = {
    id: generateId(),
    name: form.name.value,
    mood: "tolerant",
    affection: 5
  }
  let currentKitten = kittens.find(check => check.name === kitten.name)
  let currentMissingKitten = kittensGone.find(check => check.name === kitten.name)
  if (currentKitten || currentMissingKitten) {
    alert("You have already named a kitten that name.")
    form.reset
    loadKittens()
  }
  else
    kittens.push(kitten)
  setKittenMood(kitten)
  saveKittens()
  form.reset()
  loadKittens()
  drawKittens()
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens))
  window.localStorage.setItem("kittensGone", JSON.stringify(kittensGone))
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let getKitten = JSON.parse(window.localStorage.getItem("kittens"))
  if (getKitten) {
    kittens = getKitten
  }
  let getKittenGone = JSON.parse(window.localStorage.getItem("kittensGone"))
  if (getKittenGone) {
    kittensGone = getKittenGone
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  loadKittens()
  if (kittens.length > 0 || kittensGone.length > 0) {
    document.getElementById("k-angry").classList.remove("hidden");
    document.getElementById("k-angry-btn").classList.remove("hidden");
  }
  else {
    document.getElementById("k-angry").classList.add("hidden")
    document.getElementById("k-angry-btn").classList.add("hidden")
  }
  let kittensElem = document.getElementById("kittens")
  let kittensTemplate = ""
  kittensGone.forEach(kitten => {
    kittensTemplate += `<div class="container bg-dark">
      <div id="kitten-pic" class="p-2 d-flex justify-content-center kitten ${kitten.mood}">
        <img height="150" width="auto" src="https://robohash.org/<${kitten.name}>?set=set4" alt="Moody Kitten">
      </div>
      <div style="color: var(--danger);" class="container m-2">
        <span>${kitten.name} has run away!</span>
      </div>
    </div>`
  });
  kittensElem.innerHTML = kittensTemplate
  kittens.forEach(kitten => {
    kittensTemplate += `
    <div class="container bg-dark">
      <div id="kitten-pic" class="p-2 d-flex justify-content-center kitten ${kitten.mood}">
        <img height="150" width="auto" src="https://robohash.org/<${kitten.name}>?set=set4">
      </div>
      <div class="container text-light m-2">
        <span>Name: </span><span>${kitten.name}</span>
        <br>
        <span>Mood: </span><span>${kitten.mood}</span>
        <br>
        <span>Affection: </span><span>${kitten.affection}</span>
        <div class="flex-wrap m-1">
          <button class="btn-cancel btn" onclick="pet('${kitten.id}')">pet</button>
          <button onclick="catnip('${kitten.id}')">catnip</button>
          <button class="btn-cancel btn" onclick="bark('${kitten.id}')">bark</button>
        </div>
      </div>
    </div>

    `
  });
  kittensElem.innerHTML = kittensTemplate
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  return kittens.find(k => k.id == id);
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  let kitten = findKittenById(id);
  let petResult = Math.random();
  if (petResult > .7) {
    kitten.affection++;
    console.log(petResult);
    console.log(kitten.affection);
  }
  else kitten.affection--;
  console.log(petResult);
  console.log(kitten.affection);
  setKittenMood(kitten)
  saveKittens()
  if (kitten.affection === 0) {
    ifKittenRunsAway(id)
  }
  drawKittens()
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  let kitten = findKittenById(id)
  kitten.mood = "tolerant"
  kitten.affection = 5
  setKittenMood(kitten)
  saveKittens()
  drawKittens()
}

function bark(id) {
  let kitten = findKittenById(id)
  kitten.mood = "gone"
  kitten.affection = 0
  document.getElementById("bark").play()
  setKittenMood(kitten)
  saveKittens()
  ifKittenRunsAway(id)
}

/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {
  switch (true) {
    // @ts-ignore
    case (kitten.affection >= 6): kitten.mood = "happy", document.getElementById("purr").play()
      break
    case (kitten.affection <= 0): kitten.mood = "gone", document.getElementById("gone").play()
      break
    case (kitten.affection <= 3): kitten.mood = "angry", document.getElementById("roar").play()
      break
    case (kitten.affection <= 5): kitten.mood = "tolerant", document.getElementById("meow").play()
      break
  }
  saveKittens()
}
function populateKittensGone(id) {
  let kitten = findKittenById(id)
  kittensGone.push(kitten)
  window.localStorage.setItem("kittensGone", JSON.stringify(kittensGone))
}

function ifKittenRunsAway(id) {
  findKittenById(id)
  loadKittens()
  populateKittensGone(id)
  let missingKitten = kittens.find(check => check.affection === 0)
  if (missingKitten) {
    let position = kittens.indexOf(missingKitten)
    kittens.splice(position, 1)
    window.localStorage.setItem("kittens", JSON.stringify(kittens))
    drawKittens()
  }
}

function deleteKittens() {
  loadKittens()
  kittens.splice(0, kittens.length)
  kittensGone.splice(0, kittensGone.length)
  saveKittens()
  drawKittens()
}

function getStarted() {
  document.getElementById("welcome").remove()
  document.getElementById("name-input").classList.remove("hidden")
  loadKittens()
  drawKittens()
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}

