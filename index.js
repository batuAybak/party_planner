// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2507-Batuhan"; // Make sure to change this!
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;


// Initial state
let eventsArr = []
let selectedEvent
let rsvps = []
let guests = []

/**
 * Get all the event objects
 */
async function getAllEvents() {
    try {
        const response = await fetch(API)
        const responseJSON = await response.json()
        const events = responseJSON.data //[5] array of obj
        eventsArr = events
        render()
    } catch (e) {
        console.error(e);
    }
}

/**
 * Get the specific event Object per given id
 * @param {*} id 
 */
async function getEventById(id) {
    try {
        const response = await fetch(API + `/${id}`)
        const responseJSON = await response.json()
        selectedEvent = responseJSON.data
        render()
    } catch (e) {
        console.log(e)
    }
}

/**
 * Get all the people with RSVPs and assign to an array
 */
async function getRsvps() {
    try {
        const response = await fetch(BASE + COHORT + '/rsvps')
        const responseJSON = await response.json()
        rsvps = responseJSON.data
        render()
    } catch (e) {
        console.log(e)
    }
}

/**
 * Get all the guests and assign to an array
 */
async function getAllGuests() {
    try {
        const response = await fetch(BASE + COHORT + '/guests')
        const responseJSON = await response.json()
        guests = responseJSON.data
        render()
    } catch (error) {
        console.log(error)
    }
}



// ----- UI Components ----- 


function UpcomingParties() {
    const $ul = document.createElement('ul')
    $ul.classList.add("parties");

    for (let i = 0; i < eventsArr.length; i++) {
        const $li = document.createElement('li')
        $li.textContent = eventsArr[i].name
        $li.addEventListener('click', () => {
            getEventById(eventsArr[i].id)
            render()
        })
        $ul.append($li)
    }

    return $ul
}


function SelectedPartyDetails() {
    if (!selectedEvent) {
        const $p = document.createElement('p')
        $p.textContent = 'Select a party to see details.'
        return $p
    }

    const $section = document.createElement('section')
    $section.innerHTML = `
    <h3>${selectedEvent.name} #${selectedEvent.id}</h3>
    <time datetime='${selectedEvent.date}'>${selectedEvent.date.slice(0, 10)}</time>
    <address>${selectedEvent.location}</address>
    <p>${selectedEvent.description}</p>
    <GuestList></GuestList>
    `
    $section.querySelector('GuestList').replaceWith(GuestList())
    return $section
}

function GuestList() {
    const $ul = document.createElement("ul")
    const guestsAtParty = guests.filter((guest) =>
        rsvps.find((rsvp) => rsvp.guestId === guest.id && rsvp.eventId === selectedEvent.id)
    )
    //Create <li> tags by iterating through 
    const $guests = guestsAtParty.map((guest) => {
        const $guest = document.createElement("li")
        $guest.textContent = guest.name
        return $guest
    })
    $ul.replaceChildren(...$guests)

    return $ul
}


function render() {
    const $app = document.querySelector('#app')
    $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
        <section id='upcoming-party-section'>
            <h2>Upcoming Parties</h2>
            <UpcomingParties></UpcomingParties>
        </section>
        <section id='party-details-section'>
            <h2>Party Details</h2>
            <SelectedPartyDetails></SelectedPartyDetails>
        </section>
    </main>
    `
    $app.querySelector('UpcomingParties').replaceWith(UpcomingParties())
    $app.querySelector('SelectedPartyDetails').replaceWith(SelectedPartyDetails())
}

async function init() {
    await getAllEvents()
    await getRsvps()
    await getAllGuests()
    render()
}

init()
