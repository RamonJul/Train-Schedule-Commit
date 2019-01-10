var train_box = document.getElementById("train_name")
var destination_box = document.getElementById("destination")
var frequency_box = document.getElementById("frequency")
var arrival_box = document.getElementById("next_arrival")
var intervalId;
var internal_time = 0

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDNLhKHR9pB_nXksmh2sSafNDYykJUyIG8",
    authDomain: "train-scheduler-f9cf5.firebaseapp.com",
    databaseURL: "https://train-scheduler-f9cf5.firebaseio.com",
    projectId: "train-scheduler-f9cf5",
    storageBucket: "train-scheduler-f9cf5.appspot.com",
    messagingSenderId: "84399187279"
  };
  firebase.initializeApp(config);
var database = firebase.database();
var now = moment()//initial time when could runs
var now_time = moment(now.hour() + ":" + now.minutes(), "HH:mm", true)
var now = moment()//initial time when could runs
if(now.minutes()<10){
    var now_time = moment(now.hour() + ":0" +now.minutes(), "HH:mm", true)
}
else{
var now_time = moment(now.hour() + ":" + now.minutes(), "HH:mm", true)
}
document.getElementById("current_time").textContent=now_time.format("HH:mm")




// add new data
document.getElementById("submit").addEventListener("click", function () {
    var train = train_box.value;
    var destination = destination_box.value;
    var frequency = frequency_box.value;
    var arrival = arrival_box.value
    database.ref("/train").push({
        train: train,
        destination: destination,
        frequency: frequency,
        arrival: arrival,

    })

    train_box.value = "Trian";
    destination_box.value = "Destinatoin";
    frequency_box.value = "Frequency";
    arrival_box.value = "First Train";
   


})



// appends data on to html

database.ref("/train").on("child_added", function (snapshot) {
   
    display(snapshot)
})

database.ref("/train").on("child_changed", function (snapshot) {
    var key =snapshot.key
    document.getElementById("list").removeChild(document.getElementById(key))
    display(snapshot)
})


function table_headers() {
    var row = document.createElement("tr");
    var empty = document.createElement("th");
    row.appendChild(empty)

    var train = document.createElement("th");
    train.setAttribute("scope", "col")
    train.textContent = "Train"
    row.appendChild(train)

    var destination = document.createElement("th");
    destination.setAttribute("scope", "col")
    destination.textContent = "Destination"
    row.appendChild(destination)

    var frequency = document.createElement("th");
    frequency.setAttribute("scope", "col")
    frequency.textContent = "Frequency"
    row.appendChild(frequency)

    var time = document.createElement("th");
    time.setAttribute("scope", "col")
    time.textContent = "Time"
    row.appendChild(time)

    var ETA = document.createElement("th");
    ETA.setAttribute("scope", "col")
    ETA.textContent = "ETA"
    row.appendChild(ETA)

    var empty_2 = document.createElement("th");
    row.appendChild(empty_2)

    document.getElementById("list").appendChild(row);


}

function display(snapshot) {
  
    // displaying the data into the array
    var row = document.createElement("tr");
    row.setAttribute("id", snapshot.key)

    var buttons = document.createElement("td");
    var update = document.createElement("button")
    update.textContent = "Update"
    update.setAttribute("data-toggle", "modal")
    update.setAttribute("data-target", "#update_box")
    update.setAttribute("class", "btn btn-primary update")
    update.addEventListener("click", update_data)
    buttons.appendChild(update)
    row.appendChild(buttons)

    var train_data = document.createElement("td");
    train_data.textContent = snapshot.val().train;
    row.appendChild(train_data);

    var destination = document.createElement("td");
    destination.textContent = snapshot.val().destination;
    row.appendChild(destination);

    var frequency = document.createElement("td");
    frequency.textContent = snapshot.val().frequency;
    row.appendChild(frequency);

    var time = document.createElement("td");
    time.textContent = snapshot.val().arrival;
    row.appendChild(time);

    var calc_time = moment(snapshot.val().arrival, "HH:mm", true)
    var estimated_time = calc_time.diff(now_time, "minutes")

    if (estimated_time < 0) {
        estimated_time += 1440
    }
    var eta = document.createElement("td");
    eta.textContent = estimated_time;
    eta.classList.add("arrival")
    row.appendChild(eta);



    var remove = document.createElement("button")
    remove.setAttribute("class", "remove")
    remove.setAttribute("class", "btn btn-primary")
    remove.textContent = "X"
    remove.addEventListener("click", removing)
    var button_2= document.createElement("td");
    button_2.appendChild(remove)
    row.appendChild(button_2);

    document.getElementById("list").appendChild(row);


}

// internal timer update the time

intervalId=setInterval(function(){
    internal_time+=1000;
    database.ref("/time").set({
    system_time: internal_time

    })
    // console.log(internal_time)
    if(internal_time%1000===0){
    // every second
    var current_now=moment()
    if(current_now.minutes()<10){
        var  current_now_time= moment(current_now.hour() + ":0" +current_now.minutes(), "HH:mm", true)
    }
    else{
        var current_now_time=moment(current_now.hour() + ":" + current_now.minutes(), "HH:mm", true)
    }
    document.getElementById("current_time").textContent=current_now_time.format("HH:mm")
    console.log(Math.abs(current_now_time.diff(now_time,"minutes")))
    
    if(Math.abs(current_now_time.diff(now_time,"minutes"))>0){
        
        now_time=current_now_time
        var arrival=document.getElementsByClassName("arrival")
        for(var i=0; i<arrival.length;i++){
            var key= arrival[i].parentElement.getAttribute("id");
            var eta= parseInt(arrival[i].textContent);
           eta--// countdown

           if(eta===0){//train arrives

                var frequency=arrival[i].previousSibling.previousSibling.textContent
                var update=moment(arrival[i].previousSibling.textContent,"HH:mm")
                var min_update=update.minute()+parseInt(frequency)
                update.set("minute", min_update)//updated time value
                var new_time=update.format("HH:mm")
                arrival[i].textContent=frequency
                arrival[i].previousSibling.textContent=new_time
                database.ref("/train/"+key).update({

                    arrival:new_time,
                    eta:frequency
                })
                //moment stuff    

            }

            else{
                arrival[i].textContent=eta
            }

        }
    }
      
    }    

},1000)



//detele train data

function removing() {
    console.log("hello")
    var key = this.parentElement.parentElement.getAttribute("id");
    var parent = document.getElementById(key)
    document.getElementById("list").removeChild(parent)
    database.ref("/train").child(key).remove()
}
//update data
var train_update = document.getElementById("train_name_update")
var frequency_update = document.getElementById("frequency_update")
var destination_update = document.getElementById("destination_update")
var arrival_update = document.getElementById("next_arrival_update")
var update_button = document.getElementById("update_button")

function update_data() {
    var key = this.parentElement.parentElement.getAttribute("id");
    var parent = this.parentElement

    train_update.value = parent.nextSibling.textContent
    destination_update.value = parent.nextSibling.nextSibling.textContent
    frequency_update.value = parent.nextSibling.nextSibling.nextSibling.textContent
    arrival_update.value = parent.nextSibling.nextSibling.nextSibling.nextSibling.textContent
    update_button.setAttribute("key", key)
}

update_button.addEventListener("click", function () {
    var train = train_update.value;
    var destination = destination_update.value;
    var frequency = frequency_update.value;
    var arrival = arrival_update.value
    var key = this.getAttribute("key")
    database.ref("/train/" + key).update({

        train: train,
        destination: destination,
        frequency: frequency,
        arrival: arrival,
    })

})

//modal area
document.getElementById("Sign-in").addEventListener("click", User)
document.getElementById("Log-in").addEventListener("click", User)

function User() {
    var task = this.textContent.trim()
    document.getElementById("Title").textContent = task
    document.getElementById("task_button").textContent = task
    document.getElementById("task_button").setAttribute("Task", task)
}



// // AUTHENTICATION
document.getElementById("task_button").addEventListener("click", Auth)
document.getElementById("google_sign").addEventListener("click",function(){

    var provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
})
function Auth() {

    var task = this.textContent

    var auth = firebase.auth()
    var email = document.getElementById("email")
    var password = document.getElementById("password")
    switch (task) {
        case "Sign-in":
            auth.createUserWithEmailAndPassword(email.value, password.value)
            break;
        case "Log-In":
            auth.signInWithEmailAndPassword(email.value, password.value)
            break;
    }
}


firebase.auth().onAuthStateChanged(firebaseUser => {

    if (firebaseUser) {
        document.getElementsByClassName("container")[0].style.display = "block"
        document.getElementById("Log-out").style.display = "block"
        document.getElementById("Log-in").style.display = "none"
        document.getElementById("Sign-in").style.display = "none"
    } 
})

// logging out
document.getElementById("Log-out").addEventListener("click", function () {
    firebase.auth().signOut().then(function () {
        document.getElementsByClassName("container")[0].style.display = "none"
        document.getElementById("Log-out").style.display = "none"
        document.getElementById("Log-in").style.display = "block"
        document.getElementById("Sign-in").style.display = "block"
    })


})
table_headers()