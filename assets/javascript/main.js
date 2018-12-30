var train_box = document.getElementById("train_name")
var destination_box = document.getElementById("destination")
var frequency_box = document.getElementById("frequency")
var arrival_box = document.getElementById("next_arrival")
var time_left_box = document.getElementById("time_left")
var number=0;

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

// console.log(database.ref().val())



document.getElementById("submit").addEventListener("click", function () {
    var train = train_box.value;
    var destination = destination_box.value;
    var frequency = frequency_box.value;
    var arrival = arrival_box.value;
    var time = time_left_box.value;
    database.ref().push({
        train: train,
        destination: destination,
        frequency: frequency,
        arrival: arrival,
        time: time,
        train_number:number
    })
    number++
    train_box.value = "";
    destination_box.value = "";
    frequency_box.value = "";
    arrival_box.value = "";
    time_left_box.value = "";



})
    
database.ref().on("value", function (snapshopt) {
    console.log(snapshopt.val())
    snapshopt.forEach((child) => {
        console.log(child.key, child.val()); 

      });

})
database.ref().on("child_added", function (snapshopt) {
    console.log(snapshopt)
    console.log(snapshopt.val())

    var row = document.createElement("tr");

    var train_data = document.createElement("td");
    train_data.textContent = snapshopt.val().train;
    row.appendChild(train_data);

    var destination = document.createElement("td");
    destination.textContent = snapshopt.val().destination;
    row.appendChild(destination);

    var frequency = document.createElement("td");
    frequency.textContent = snapshopt.val().frequency;
    row.appendChild(frequency);

    var time = document.createElement("td");
    time.textContent = snapshopt.val().time;
    row.appendChild(time);

    var arrival = document.createElement("td");
    arrival.textContent = snapshopt.val().arrival;
    row.appendChild(arrival);

    document.getElementById("list").appendChild(row);

})



// // AUTHENTICATION
//     var auth = firebase.auth()

//     var email_box=document.getElementById("email")
//     var password_box=document.getElementById("password")

//     document.getElementById("SignuP").addEventListener("click", function(){
//         //check for valid email
//         var email=email_box.value
//         var password=password_box.value

//         var user=auth.createUserWithEmailAndPassword(email,password)


//     })

//     firebase.auth().onAuthStateChanged(firebaseUser =>{

//         if(firebaseUser){
//             console.log(firebaseUser);
//         } else{
//             console.log("not logged in")
//         }

    


    // })