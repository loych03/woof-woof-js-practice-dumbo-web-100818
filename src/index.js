document.addEventListener('DOMContentLoaded', function () {
  getAllDogs()
// ------------------ Grab from DOM and add enevt listeners ---------------
  let dogBar = document.getElementById('dog-bar')
  let dogInfo = document.getElementById('dog-info')
  let filterBtn = document.querySelector('#good-dog-filter')

  let dogsList;

  dogBar.addEventListener('click', handleDogClick)
  dogInfo.addEventListener('click', handleGoodAndBad)
  filterBtn.addEventListener('click', handleFilterEvent)

  // --------------- FETCH Calls to database --------------------------

  function getAllDogs(){
    fetch("http://localhost:3000/pups")
    .then(res => res.json())
    .then(displayAllDogs)
  }

  function getSingleDog(dogId) {
    return fetch(`http://localhost:3000/pups/${dogId}`)
      .then(res => res.json())
    // .then(displaySingleDog)
  }

  //changing data
  function switchDogStatus(dogId, status) {
    return fetch(`http://localhost:3000/pups/${dogId}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({isGoodDog: status})

    })
  }


  // ---------------------- DOM Manipulation -------------------------------

  function displayAllDogs(dogs){

    dogsList = dogs

    dogBar.innerHTML = ""

    dogsList.forEach( dog => {
      dogBar.innerHTML +=
      `<span data-id=${dog.id}> ${dog.name}</span>`
    })
  }

  function displaySingleDog(dog) {

   dogInfo.innerHTML =
    `<img src="${dog.image}">
    <h2>${dog.name}</h2>
    <button data-id="${dog.id}">${dog.isGoodDog ? "Good" : "Bad"} Dog!!</button>`
  }

  function filterDogs(){
    let filterdList = dogsList.filter(dog => dog.isGoodDog)

    displayAllDogs(filterdList)
  }


// ----------------- Event Handlers -------------------------


  function handleDogClick(event){
    let dogId;
    if (event.target.tagName === "SPAN") {
      dogId = event.target.dataset.id
      getSingleDog(dogId).then(displaySingleDog)
    }
  }

  function handleGoodAndBad(event){
    let dogId;
    let status; //boolean
    if(event.target.tagName === "BUTTON"){
      dogId = event.target.dataset.id
      event.target.innerText === "Bad Dog!!" ? status = true : status = false

      switchDogStatus(dogId, status)
      .then(res => res.json())
      .then(displaySingleDog)
    }
  }

  function handleFilterEvent(e){
    if (e.target.className === 'off'){
      e.target.className = 'on'
      e.target.innerText = 'Filter good dogs: ON'
      filterDogs()
    }else{
      e.target.className = 'off'
      e.target.innerText = 'Filter good dogs: OFF'
      getAllDogs()
    }
  }
})
