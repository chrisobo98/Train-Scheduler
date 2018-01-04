// Initialize Firebase
// ===================================================================================================================================
var config = {
  apiKey: "AIzaSyBE-9WQw5wN3YdkMc_zXz3toD19Hjor6MA",
  authDomain: "train-scheduler-f3d3d.firebaseapp.com",
  databaseURL: "https://train-scheduler-f3d3d.firebaseio.com",
  projectId: "train-scheduler-f3d3d",
  storageBucket: "train-scheduler-f3d3d.appspot.com",
  messagingSenderId: "376572848296"
};

firebase.initializeApp(config);
// ===================================================================================================================================

// Firebase-database - The Firebase Realtime Database 
// ===================================================================================================================================
var trainData = firebase.database();
// ===================================================================================================================================

// Button for adding trains
$("#submitTrain").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#trainNameInput").val().trim();
  var destination = $("#destinationInput").val().trim();
  var firstTrain = $("#trainTimeInput").val().trim();
  var frequency = $("#frequencyInput").val().trim();

  // Object holding train data
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  // Uploads train data to the database
  trainData.ref().push(newTrain);

  // Console logs
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#trainNameInput").val("");
  $("#destinationInput").val("");
  $("#trainTimeInput").val("");
  $("#frequencyInput").val("");

  // Determine when the next train arrives.
  return false;
});

// Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
// ===================================================================================================================================
trainData.ref().on("child_added", function (childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFrequency = childSnapshot.val().frequency;
  var tFirstTrain = childSnapshot.val().firstTrain;

  var timeArr = tFirstTrain.split(":");
  var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var tMinutes;
  var tArrival;

  // If the first train is later than the current time, sent arrival to the first train time
  // ================================================== If else statement ============================================================
  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {

    // Calculating minutes till arrival 
    var differenceTimes = moment().diff(trainTime, "minutes");

    // Modulus between the difference and the frequency.
    var tRemainder = differenceTimes % tFrequency;

    // To calculate the minutes till arrival, take tFrequency subtract by the tRemainder
    tMinutes = tFrequency - tRemainder;

    // Calculating arrival time, add the tMinutes to the currrent time
    tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    
  }
  // ===================================================================================================================================

  // Console logs
  console.log("tMinutes:", tMinutes);
  console.log("tArrival:", tArrival);

  // Add train data to the table
  // ===================================================================================================================================
  $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
    tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
  // ===================================================================================================================================

});