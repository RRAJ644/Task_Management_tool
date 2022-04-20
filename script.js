let addBtn = document.querySelector(".add-btn")
let removeBtn = document.querySelector(".remove-btn")
let addFlag = false
let modalCont = document.querySelector(".modal-cont")
let mainCont = document.querySelector(".main-cont")
let textareaCont = document.querySelector(".textarea-cont")
let colors = ["lightpink", "lightgreen", "lightblue", "black"]
let modalPriorityColor = colors[colors.length-1]
let allPriorityColors = document.querySelectorAll(".priority-color")
let removeFlag = false
let toolBoxColors = document.querySelectorAll(".color")


let lockClass = "fa-lock"
let unlockClass = "fa-unlock"

let ticketsArr = []

if (localStorage.getItem("jira_tickets")) {
    // retrieve and display tickets
    ticketsArr = JSON.parse(localStorage.getItem("jira_tickets"))
    ticketsArr.forEach((ticketObj)=>{
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID)
    })
}
for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener("click",(e)=>{
        let currentTicketColor = toolBoxColors[i].classList[0]
        let filteredTickets = ticketsArr.filter((ticketObj, idx)=>{
            return currentTicketColor === ticketObj.ticketColor
        })
        //remove previous tickets
        let allTicketCont = document.querySelectorAll(".ticket-cont")
        for (let i = 0; i < allTicketCont.length; i++) {
            allTicketCont[i].remove();
            
        }
        //Display new filtered tickets
        filteredTickets.forEach((ticketObj, idx)=>{
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID)
        })
    })
    toolBoxColors[i].addEventListener("dblclick",(e)=>{
        let allTicketCont = document.querySelectorAll(".ticket-cont")
        for (let i = 0; i < allTicketCont.length; i++) {
            allTicketCont[i].remove();
            
        }
        ticketsArr.forEach((ticketObj, idx)=>{
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID)
        })
    })
}
// //modal priority color
allPriorityColors.forEach((colorElem, idx) => {
    colorElem.addEventListener("click",(e)=>{
        allPriorityColors.forEach((PriorityColorElem,idx)=>{
            PriorityColorElem.classList.remove("border")
        })
        colorElem.classList.add("border")
        modalPriorityColor = colorElem.classList[0]
        
    })
})
addBtn.addEventListener("click",(e)=>{
    // displaying the modal
    //generate ticket

    //addFlag==true {display modal}
    //addFlag == false {remove modal}
    addFlag = !addFlag
    if (addFlag) {
        modalCont.style.display = "flex"       
    }
    else{
        modalCont.style.display = "none"
    }
})
removeBtn.addEventListener("click",(e)=>{
    removeFlag = !removeFlag

})
modalCont.addEventListener("keydown",(e)=>{
    let key = e.key
    if(key==="Shift"){
        createTicket(modalPriorityColor, textareaCont.value);
        addFlag = false
        setModalToDefault()
    }
})
function createTicket(ticketColor, ticketTask, ticketID) {
    let id = ticketID || shortid()
    let ticketCont = document.createElement("div")
    ticketCont.setAttribute("class","ticket-cont")
    ticketCont.innerHTML= ` 
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>
    `
    mainCont.appendChild(ticketCont)
    if (!ticketID) {
        ticketsArr.push({ticketColor,ticketTask,ticketID: id})
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr))
    }
    handleremoval(ticketCont, id)
    handlelock(ticketCont, id)
    handlecolor(ticketCont, id)
}
function handleremoval(ticket, id) {
   ticket.addEventListener("click",(e)=>{
       if (removeFlag) {
           let idx = getTicketIdx(id)
           ticketsArr.splice(idx,1)
           let strTicketArr = JSON.stringify(ticketsArr)
           localStorage.setItem("jira_tickets", strTicketArr)
           ticket.remove()
       }
   })
}

function handlelock(ticket, id) {
    let ticketlockElem = document.querySelector(".ticket-lock")
    let ticketLock = ticketlockElem.children[0]
    let ticketTaskArea = ticket.querySelector(".task-area")
    ticketLock.addEventListener("click",(e)=>{
        let ticketIdx = getTicketIdx(id)
        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass)
            ticketLock.classList.add(unlockClass)
            ticketTaskArea.setAttribute("contenteditable","true")
        }
        else{
            ticketLock.classList.remove(unlockClass)
            ticketLock.classList.add(lockClass)
            ticketTaskArea.setAttribute("contenteditable","false")
        }
        ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText
        localStorage.setItem("jira_tickets", JSON.stringify(ticketsArr))
    })
}
function handlecolor(ticket, id) {
    let ticketColor = ticket.querySelector(".ticket-color")
    ticketColor.addEventListener("click", (e)=>{
        let ticketIdx = getTicketIdx(id)
        let currentTicketColor = ticketColor.classList[1]
        let currentTicketColorIdx  = colors.findIndex((color)=>{
            return currentTicketColor==color
        })
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx%colors.length
        let newTicketColor = colors[newTicketColorIdx]
        ticketColor.classList.remove(currentTicketColor)
        ticketColor.classList.add(newTicketColor)

        ticketsArr[ticketIdx].ticketColor = new ticketColor
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr))
    }) 
}
function getTicketIdx(id) {
    let ticketIdx = ticketsArr.findIndex((ticketObj)=>{
        return ticketObj.ticketID === id
    })
    return ticketIdx
}
function setModalToDefault() {
    modalCont.style.display="none"
    textareaCont.value=""
    allPriorityColors.forEach((PriorityColorElem,idx)=>{
        PriorityColorElem.classList.remove("border")
    })
    allPriorityColors[allPriorityColors.length-1].classList.add("border")
}