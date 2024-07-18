// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBfQErg1fpq6v0uTeZHsn3VRGeaUGU8CnY",
  authDomain: "mess-e8b2b.firebaseapp.com",
  projectId: "mess-e8b2b",
  storageBucket: "mess-e8b2b.appspot.com",
  messagingSenderId: "1097476946862",
  appId: "1:1097476946862:web:cc6a252a88ce145923263f"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default firebaseConfig;
let inputs = document.getElementById("inp");
let text = document.querySelector(".text");
let task = [];

async function fetchTasks() {
  try {
    const uniqueId = 21102002;
    const docRef = db.collection('users').doc(uniqueId.toString());
    const doc = await docRef.get();
    if (doc.exists) {
      task = doc.data().taskArray || [];
      renderTasks();
    } else {
      toast('No such document!');
    }
  } catch (error) {
    toast('Error fetching task array: ' + error.message, true);
  }
}

function renderTasks() {
  text.innerHTML = ''; // Clear existing tasks
  task.forEach((taskItem, index) => {
    document.getElementById("dlt-all-task").style.display = 'block'; 
    let ele = document.createElement("div");
    // Concatenate the index to the taskItem.text to display numbers
    ele.innerHTML = `<span>${index + 1}. ${taskItem.text} </span> <i class="material-icons edit-btn editicon">edit</i> <i class="material-icons delete-btn">delete</i>`;
    text.appendChild(ele);
    ele.querySelector(".delete-btn").addEventListener("click", remove);
    ele.querySelector(".edit-btn").addEventListener("click", () => edit(index
    ));
  });
}


  document.getElementById("add").onclick = function () {
  if (inputs.value == "") {
    alert("Add Name");
  } else {
    const randomPin = '0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c';
    document.getElementById("dlt-all-task").style.display = 'block'; 
    let person = { text: inputs.value, pin: randomPin, prevM: ['×'], todayM: ['×'], nextM: ['0'] ,totalMeal:[],amountArray:[],fixdDateMeal:[]};
    task.unshift(person);
    saveTasksToFirestore('add');
    renderTasks();
    inputs.value = "";
  }
}


document.getElementById("dlt-all-task").onclick = function () {
  if (confirm("Are you sure you want to delete all your tasks?")) {
    task = [];
    saveTasksToFirestore('delete');
    renderTasks();
    document.getElementById("dlt-all-task").style.display = 'none'; 
  }
}

function remove() {
  let ele = this.parentNode;
  if (confirm("Are you sure you want to delete this person?")) {
    let index = Array.from(ele.parentNode.children).indexOf(ele);
    task.splice(index, 1);
    saveTasksToFirestore('delete');
    renderTasks();
  }
}



var indexNumber;
function edit(index) {
  indexNumber=index;
  const person = task[index];
 amountPrint(index);
  document.getElementById('editIndex').value = index;
  document.getElementById('editName').value = person.text;
  document.getElementById('editPin').value = person.pin;
  document.getElementById('editPrevM').value = person.prevM;
  document.getElementById('editTodayM').value = person.todayM;
  document.getElementById('editNextM').value = person.nextM;
  document.getElementById('myModal').style.display = "block";
  /*
  let totalAmount = 0;
  const amountPart = item.split(' - ')[1];
  const amount = parseFloat(amountPart.split(' ')[0]);
  totalAmount += amount;
  */
  
  let prevM = person.prevM;
  let prev = [];
for (let i = 0; i < prevM.length; i++) {
    if (i === 0) {  // Special rules for the first index
        if (prevM[0] === "lunch") {
            prev.push("1D");
        } else if (prevM[i] === "dinner") {
            prev.push("1R");
        } else if (prevM[i] === "both") {
            prev.push("2");
        } else if (prevM[i] === "×") {
            prev.push("×");
        }
    } else {  // General rules for the other indices
        if (prevM[i] === "lunch") {
            prev.push("1GD");
        } else if (prevM[i] === "dinner") {
            prev.push("1GR");
        } else if (prevM[i] === "both") {
            prev.push("1GDR");
        } else if (prevM[i] === "×") {
            prev.push("×");
        }
    }
}

// console.log(prev);  // Output the transformed array

  document.getElementById('editPrevM').value = prev;
  
let todayM = person.todayM;
let Ai = [];

for (let i = 0; i < todayM.length; i++) {
    if (i === 0) {  // Special rules for the first index
        if (todayM[0] === "lunch") {
            Ai.push("1D");
        } else if (todayM[i] === "dinner") {
            Ai.push("1R");
        } else if (todayM[i] === "both") {
            Ai.push("2");
        } else if (todayM[i] === "×") {
            Ai.push("×");
        }
    } else {  // General rules for the other indices
        if (todayM[i] === "lunch") {
            Ai.push("1GD");
        } else if (todayM[i] === "dinner") {
            Ai.push("1GR");
        } else if (todayM[i] === "both") {
            Ai.push("1GDR");
        } else if (todayM[i] === "×") {
            Ai.push("×");
        }
    }
}



  document.getElementById('editTodayM').value =Ai;
let nextM = person.nextM;
  let next = [];

for (let i = 0; i < nextM.length; i++) {
    if (i === 0) {  // Special rules for the first index
        if (nextM[0] === "lunch") {
            next.push("1D");
        } else if (nextM[i] === "dinner") {
            next.push("1R");
        } else if (nextM[i] === "both") {
            next.push("2");
        } else if (nextM[i] === "×") {
            next.push("×");
        }
    } else {  // General rules for the other indices
        if (nextM[i] === "lunch") {
            next.push("1GD");
        } else if (nextM[i] === "dinner") {
            next.push("1GR");
        } else if (nextM[i] === "both") {
            next.push("1GDR");
        } else if (nextM[i] === "×") {
            next.push("×");
        }
    }
}




  document.getElementById('editNextM').value =next;
   document.getElementById('myModal').style.display = "block";
}

  document.getElementById("edit_value_save").onclick = function () {
 var  index = document.getElementById('editIndex').value;
  const newName = document.getElementById('editName').value;
 
  const newPrevM= document.getElementById('editPrevM').value;
  let newPrev = newPrevM.split(',').map(item => item.trim());
let reversedPrevM = []; 
for (let i = 0; i < newPrev.length; i++) {
    switch (newPrev[i]) {
        case "1D":
            reversedPrevM.push("lunch");
            break;
        case "1R":
            reversedPrevM.push("dinner");
            break;
        case "2":
          reversedPrevM.push("both");
            break;
        case "1GDR":
            reversedPrevM.push("both");
            break;
        case "1GD":
            reversedPrevM.push("lunch");
            break;
        case "1GR":
            reversedPrevM.push("dinner");
            break;
        case "×":
            reversedPrevM.push("×");
            break;
    }
}


  const newToday= document.getElementById('editTodayM').value;
  const newNextM = document.getElementById('editNextM').value;
  let newNext = newNextM.split(',').map(item => item.trim());
let reversedNextM = []; 

for (let i = 0; i < newNext.length; i++) {
    switch (newNext[i]) {
        case "1D":
            reversedNextM.push("lunch");
            break;
        case "1R":
            reversedNextM.push("dinner");
            break;
        case "2":
            reversedNextM.push("both");
            break;
        case "1GDR":
            reversedNextM.push("both");
            break;
        case "1GD":
            reversedNextM.push("lunch");
            break;
        case "1GR":
            reversedNextM.push("dinner");
            break;
        case "×":
            reversedNextM.push("×");
            break;
    }
}

let newTod = newToday.split(',').map(item => item.trim());
let reversedTodayM=[]; 
for (let i = 0; i < newTod.length; i++) {
    switch (newTod[i]) {
        case "1D":
            reversedTodayM.push("lunch");
            break;
        case "1R":
            reversedTodayM.push("dinner");
            break;
        case "2":
          reversedTodayM.push("both");
            break;
        case "1GDR":
            reversedTodayM.push("both");
            break;
        case "1GD":
            reversedTodayM.push("lunch");
            break;
        case "1GR":
            reversedTodayM.push("dinner");
            break;
        case "×":
            reversedTodayM.push("×");
            break;
    }
}
  if (newName) {
    task[index].text = newName;
   task[index].prevM = reversedPrevM;
    task[index].todayM = reversedTodayM;
    task[index].nextM = reversedNextM;
    saveTasksToFirestore('edit');
    renderTasks();
    document.getElementById('myModal').style.display = "none";
  } else {
    alert("Name cannot be empty");
  }
}


async function saveTasksToFirestore(operation) {
  try {
    const uniqueId = 21102002;
    const docRef = db.collection('users').doc(uniqueId.toString());
    await docRef.set({
      uniqueId: uniqueId,
      taskArray: task
    });
    if (operation === 'add') {
      toast('User added');
    } else if (operation === 'delete') {
      toast('User deleted');
    } else if (operation === 'edit') {
      toast('User edited');
    }
  } catch (error) {
    toast('Error saving task: ' + error.message, true);
  }
}

// Modal close functionality
let modal = document.getElementById('myModal');
let span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == customModal || event.target == modal || event.target == sidebar) {
    modal.style.display = "none";
    sidebar.style.display = "none";
    customModal.style.display = "none";
  }
}
  //sidebar
 var sidebar = document.getElementById("sidebar");
var settingsButton = document.getElementById("settings");
var closeButton = document.getElementsByClassName("close")[1];

settingsButton.onclick = function() {
  sidebar.style.display = "block";
}

closeButton.onclick = function() {
 sidebar.style.display = "none";
}

// custom model 
 var customModal = document.getElementById("customModal");
var passwordChange = document.getElementById("password_change");
var custom_close= document.getElementsByClassName("close")[2];

passwordChange.onclick = function() {
  customModal.style.display = "block";
  sidebar.style.display = "none";
}
custom_close.onclick = function() {
 customModal.style.display = "none";
}

// log in
const maxVisitors = 4;
document.getElementById('continue').onclick = function () {
    const inputPassword = document.getElementById('password').value;
    hash(inputPassword).then(hashedInputPassword => {
        const message = document.getElementById('message');

        db.collection('users').doc('manager').get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                const storedPassword = data.password;
                let visitorCount = data.visitorCount || 0;
               if (visitorCount<=maxVisitors) {
                if (storedPassword) {
                    if (hashedInputPassword === storedPassword) {
                        handleAccessGranted(visitorCount, message);
                        document.getElementById('password-page').style.display = 'none';
                        document.getElementById('container').style.display = 'block';
                        fetchTasks();
                    } else {
                        handleIncorrectPassword(message);
                    }
                } else {
                    askNewPassword(message);
                }
            } else {
          alert('Sorry, the website is currently at full capacity for manager');
            }
            } else {
                askNewPassword(message);
            }
            
        }).catch(error => {
            console.error("Error getting document: ", error);
            showMessage(message, 'red', "Error retrieving document.");
        });
    }).catch(error => {
        console.error("Error hashing password: ", error);
    });
};

// Password change button click event
document.getElementById('password_change_button').onclick = function () {
    const oldPassword = document.getElementById('old_password').value;
    const newPasswordInput = document.getElementById('new_password').value;

    hash(oldPassword).then(hashedOldPassword => {
        hash(newPasswordInput).then(hashedNewPassword => {
            const managerDocRef = db.collection('users').doc('manager');

            managerDocRef.get().then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    const storedPassword = data.password;

                    if (hashedOldPassword === storedPassword) {
                        managerDocRef.update({
                            password: hashedNewPassword
                        }).then(() => {
                          toast(`New Password is : ${newPasswordInput}`);
                          customModal.style.display = "none";
                            console.log("Password updated successfully!");
                            showMessage(message, 'green', "Password updated successfully!");
                        }).catch(error => {
                            console.error("Error updating password: ", error);
                            showMessage(message, 'red', "Error updating password.");
                        });
                    } else {
                        showMessage(message, 'red', "Old password does not match.");
                    }
                } else {
                    showMessage(message, 'red', "Document does not exist.");
                }
            }).catch(error => {
                console.error("Error getting document: ", error);
                showMessage(message, 'red', "Error getting document.");
            });
        }).catch(error => {
            console.error("Error hashing new password: ", error);
            showMessage(message, 'red', "Error hashing new password.");
        });
    }).catch(error => {
        console.error("Error hashing old password: ", error);
        showMessage(message, 'red', "Error hashing old password.");
    });
};

// Function to handle access granted
function handleAccessGranted(visitorCount, messageElement) {
    if (visitorCount <= maxVisitors) {
        if (!localStorage.getItem('uniqueID')) {
            let uniqueID = generateUUID();
            localStorage.setItem('uniqueID', uniqueID);
            visitorCount++;
            db.collection('users').doc('manager').update({
                visitorCount: visitorCount,
                uniqueIDs: firebase.firestore.FieldValue.arrayUnion(uniqueID)
            }).then(() => {
                console.log("Unique ID added to Firebase array.");
                showMessage(messageElement, 'green', "Access granted. Welcome!");
            }).catch(error => {
                console.error("Error adding unique ID to Firebase: ", error);
                showMessage(messageElement, 'red', "Error adding unique ID.");
            });
        } else {
            showMessage(messageElement, 'green', "Access granted. Welcome!");
        }
    } else {
        handleMaxVisitorReached(messageElement);
    }
}

// Function to handle maximum visitor limit reached
function handleMaxVisitorReached(messageElement) {
    showMessage(messageElement, 'red', "Maximum visitor limit reached.");
}

// Function to handle incorrect password
function handleIncorrectPassword(messageElement) {
    showMessage(messageElement, 'red', "Incorrect password.");
}

// Function to ask for a new password
function askNewPassword(messageElement) {
    const newPassword = prompt("Enter a new password:");

    if (newPassword) {
        hash(newPassword).then(hashedPassword => {
            db.collection('users').doc('manager').set({
                password: hashedPassword,
                visitorCount: 0
            }).then(() => {
                showMessage(messageElement, 'green', "New password set. Please try again.");
            }).catch(error => {
                console.error("Error setting document: ", error);
                showMessage(messageElement, 'red', "Error setting new password.");
            });
        }).catch(error => {
            console.error("Error hashing password: ", error);
            showMessage(messageElement, 'red', "Error hashing new password.");
        });
    }
}

// Function to generate UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to hash a password
async function hash(input) {
    const encode = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encode);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Function to display message
function showMessage(element, color, text) {
    element.classList.remove('hidden');
    element.style.color = color;
    element.innerText = text;
}


function toast(message) {
  var toastElement = document.getElementById('toast');
  toastElement.innerHTML = message;
  toastElement.style.visibility = 'visible';

  setTimeout(function() {
    toastElement.style.visibility = 'hidden';
  }, 2000);
}

// save amount 
document.getElementById("saveAmount").onclick = async function saveAmount() {
  const userId = '21102002'; 
  const taskIndex = indexNumber; 
  const amountInput = document.getElementById('amount').value;
  const AmessageInput = document.getElementById('amount_related_message').value;
  const currentTime=getCurrentDateTime();
  if (amountInput !== '') {
    try {
      const userRef = db.collection('users').doc(userId);
      const doc = await userRef.get();
      if (doc.exists) {
    const userData = doc.data();
    let taskArray = userData.taskArray;
    taskArray[taskIndex].amountArray.unshift({ amount: amountInput, message: AmessageInput, savedTime: currentTime });


    await userRef.update({
       taskArray: taskArray
    });
amountPrint(taskIndex);
    document.getElementById('amount').value = '';
    document.getElementById('amount_related_message').value = '';
}


    } catch (error) {
      console.error('Error saving amount:', error);
    }
  } else {
    console.log('Amount input is empty.');
  }
};


function getCurrentDateTime() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    let yyyy = today.getFullYear();
    let hours = String(today.getHours()).padStart(2, '0');
    let minutes = String(today.getMinutes()).padStart(2, '0');
    let seconds = String(today.getSeconds()).padStart(2, '0');

    return dd + '-' + mm + '-' + yyyy + ' ' + hours + ':' + minutes + ':' + seconds;
}


async function amountPrint(index) {
  const userId = '21102002'; 
  const userRef = db.collection('users').doc(userId);
  
  try {
    const doc = await userRef.get();
    
    if (doc.exists) {
      const userData = doc.data();
      if (userData.taskArray && userData.taskArray.length > index) {
        const taskArray = userData.taskArray;
        const amountArray = taskArray[index].amountArray;
        const amountList = document.getElementById('amount-list');
        amountList.innerHTML = '';
        amountArray.forEach((item) => {
          const EachDiv = document.createElement('div');
          EachDiv.classList.add('amu');
          EachDiv.innerHTML= `
  <span>${item.amount}/- ${item.message}<br>${item.savedTime}</span>
  <button class="editbtn"><i class="fa-solid fa-pen-fancy"></i></button>
  <button class="deletebtn"><i class="fa-solid fa-trash"></i></button>
`;
          amountList.appendChild(EachDiv);
         
        });
      } else {
        console.log('taskArray or index out of bounds.');
      }
      
    } else {
      console.log('User document not found.');
    }
  } catch (error) {
    console.error('Error fetching document:', error);
  }
}

document.getElementById('amount-list').addEventListener('click', async function(event) {
  
  const element = event.target.parentNode;
    const parent = element.parentNode;
    const index = Array.prototype.indexOf.call(parent.children, element);
    const taskIndex = indexNumber; 
    const userId = '21102002';
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
  if (event.target && event.target.classList.contains('editbtn')) {
    if (doc.exists) {
      const userData = doc.data();
      let taskArray = userData.taskArray;

      let newAmount = prompt(`Current amount: ${taskArray[taskIndex].amountArray[index].amount}`);
      if (newAmount === null || newAmount === "") {
        newAmount = taskArray[taskIndex].amountArray[index].amount;
      }

      let message = prompt(`Current message: ${taskArray[taskIndex].amountArray[index].message}`);
      if (message === null || message === "") {
        message = taskArray[taskIndex].amountArray[index].message;
      }

      let savedTime = taskArray[taskIndex].amountArray[index].savedTime;
      taskArray[taskIndex].amountArray[index] = { amount: newAmount, message: message, savedTime: savedTime };
      await userRef.update({
        taskArray: taskArray
      });
    }
  }
  
  
  if (event.target && event.target.classList.contains('deletebtn')) {
    let conf=confirm('delete this element');
    if (conf){
    if (doc.exists) {
      const userData = doc.data();
      let taskArray = userData.taskArray;
      taskArray[taskIndex].amountArray.splice(index,1);
      await userRef.update({
        taskArray: taskArray
      });
    }
    }
  }
  amountPrint(taskIndex);
});
