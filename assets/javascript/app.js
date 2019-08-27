// Initialize Firebase
var config = {
    apiKey: "AIzaSyC97u_SJy_E6_vpJ9PuuB6KLzMv9TEKfmE",
    authDomain: "ke-train-scheduler.firebaseapp.com",
    databaseURL: "https://ke-train-scheduler.firebaseio.com",
    projectId: "ke-train-scheduler",
    storageBucket: "ke-train-scheduler.appspot.com",
    messagingSenderId: "581787075295"
};
firebase.initializeApp(config);


var database = firebase.database();

// Capture user input into variable to be used by js
$("button").on("click", function (event) {
    event.preventDefault();
    var name = $("#train-name").val();
    var destination = $("#destination-input").val();
    var start = $("#start-input").val();
    var frequency = $("#frequency-input").val();

    database.ref().push({
        "name": name,
        "destination": destination,
        "start": start,
        "frequency": frequency,
    });

});

// Add each entry to the database
database.ref().on("child_added", function (snapshot) {
    var name = snapshot.val().name
    var destination = snapshot.val().destination
    var start = snapshot.val().start
    var frequency = snapshot.val().frequency


    // Moment JS Logic

    //Frequency
    var tFrequency = frequency;
    console.log(`FREQUENCY: ${tFrequency}`)

    //First Train Time
    var firstTime = start;
    console.log(`FIRST TRAIN DEPARTURE: ${firstTime}`)

    // First Time(pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("Difference in Time: " + diffTime);

    // Time apart (remainder) - time since last train
    var tRemainder = diffTime % tFrequency;
    console.log(`MINUES SINCE LAST TRAIN : ${ tRemainder } minutes`);

    // Minutes Until Next Train
    var tMinusTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL NEXT TRAIN: " + tMinusTrain);

    // Next Train
    var nextTrain = currentTime.add(tMinusTrain, 'minutes');
    console.log(`NEXT TRAIN ARRIVES: ${nextTrain.format("hh:mm")}`)

    var arrivalTime = moment(nextTrain).format("hh:mm");
    // find table and add a table row
    $("#train-time-table tbody").append(
        `
<tr>
    <td>${name}</td>
    <td>${destination}</td>
    <td>${frequency}</td>
    <td>${tMinusTrain}</td>
    <td>${arrivalTime}</td>
</tr>
`
    );
})