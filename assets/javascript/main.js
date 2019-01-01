var train_box = document.getElementById("train_name")
var destination_box = document.getElementById("destination")
var frequency_box = document.getElementById("frequency")
var arrival_box = document.getElementById("next_arrival")
var intervalId;
var internal_time=0

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


// add new data
document.getElementById("submit").addEventListener("click", function () {
    var train = train_box.value;
    var destination = destination_box.value;
    var frequency = frequency_box.value;
    var arrival =arrival_box.value
    database.ref("/train").push({
        train: train,
        destination: destination,
        frequency: frequency,
        arrival: arrival,
        eta:frequency
    
    })

    train_box.value = "Trian";
    destination_box.value = "Destinatoin";
    frequency_box.value = "Frequency";
    arrival_box.value = "First Train";



})
    

function myFunction() {// test new stuff
    var arrival=document.getElementsByClassName("arrival")

  
    for(var i=0; i<arrival.length;i++){
        console.log(arrival)
        var key= arrival[i].parentElement.getAttribute("key");
        var time_left=arrival[i].textContent
       var eta= parseInt(time_left);
       eta--
     
        if(eta>0){
            arrival[i].textContent=eta
           console.log("not done")
           database.ref("/train/"+key).update({
            eta:eta
        })
             
        }

        else{//train arrives
            console.log("arrived")
           
            var frequency=arrival[i].previousSibling.previousSibling.textContent
            var old_arrival_=arrival[i].previousSibling.textContent
            var update=moment(old_arrival_,"hh:mm")
            var min_update=update.minute()+parseInt(frequency)
            update.set("minute", min_update)//updated time value
            var new_time=update.format("hh:mm")
            arrival[i].textContent=frequency
            arrival[i].previousSibling.textContent=new_time
            database.ref("/train/"+key).update({
                
                arrival:new_time,
                eta:frequency
            })
            //moment stuff    

        }


}
  
//checks is database has been running
  database.ref("/time").on("value", function(snapshot){
    if(snapshot.child("system_time").exists()){
        internal_time=snapshot.val().system_time

    }

})
// appends data on to html
database.ref("/train").on("child_added", function (snapshot) {
    var row = document.createElement("tr");
    row.setAttribute("key", snapshot.key)

    var train_data = document.createElement("td");
    train_data.textContent = snapshot.val().train;
    row.appendChild(train_data);

    var destination = document.createElement("td");
    destination.textContent = snapshot.val().destination;
    row.appendChild(destination);

    var frequency = document.createElement("td");
    frequency.textContent = snapshot.val().frequency;
    row.appendChild(frequency);

    var time= document.createElement("td");
    time.textContent = snapshot.val().arrival;
    row.appendChild(time);

    var eta = document.createElement("td");
    eta.textContent = snapshot.val().eta;
    eta.classList.add("arrival")
    row.appendChild(eta);


    document.getElementById("list").appendChild(row);

        
})
// internal timer

intervalId=setInterval(function(){
    internal_time+=1000;
    database.ref("/time").set({
    system_time: internal_time
    
    })
    console.log(internal_time)
    if(internal_time%60000===0){
     //1 min
    
        var arrival=document.getElementsByClassName("arrival")
        for(var i=0; i<arrival.length;i++){
            var key= arrival[i].parentElement.getAttribute("key");
            var eta= parseInt(arrival[i].textContent);
           eta--
         
            if(eta>0){
                arrival[i].textContent=eta
               database.ref("/train/"+key).update({
                eta:eta
            })
                 
            }
            else if(eta===0){//train arrives

                var frequency=arrival[i].previousSibling.previousSibling.textContent
                var update=moment(arrival[i].previousSibling.textContent,"hh:mm")
                var min_update=update.minute()+parseInt(frequency)
                update.set("minute", min_update)//updated time value
                var new_time=update.format("hh:mm")
                arrival[i].textContent=frequency
                arrival[i].previousSibling.textContent=new_time
                database.ref("/train/"+key).update({
                    
                    arrival:new_time,
                    eta:frequency
                })
                //moment stuff    

            }

        }
    }

},1000)





//Time

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