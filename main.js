const firebaseConfig = {
  apiKey: "AIzaSyBfQErg1fpq6v0uTeZHsn3VRGeaUGU8CnY",
  authDomain: "mess-e8b2b.firebaseapp.com",
  projectId: "mess-e8b2b",
  storageBucket: "mess-e8b2b.appspot.com",
  messagingSenderId: "1097476946862",
  appId: "1:1097476946862:web:cc6a252a88ce145923263f"
};

//inspect off
document.addEventListener("contextmenu",function (e) {
  e.preventDefault()
},false)

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Optionally initialize Firestore
const db = firebase.firestore();

// Export the Firebase configuration if needed
export default firebaseConfig;

var lastMorningUpdateTime=9;
var lastEveningUpdateTime=17;
var userName;
 async function hash(input) {
   const decode = new TextEncoder().encode(input);
   const hashBuffer = await crypto.subtle.digest('SHA-256', decode);
   const hashArray = Array.from(new Uint8Array(hashBuffer));
   const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
   return hashHex;
 }
 
 // Model 
 
 var modal = document.getElementById("myModal");
var btn = document.getElementById("logo");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
    modal.style.display = "block";
}
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }else if(event.target == password_change_modal){
      password_change_modal.style.display = "none";
    }
    
}

var password_change_modal = document.getElementById("customModal");

document.getElementById('password_change').onclick = async function() {
  modal.style.display = "none";
   password_change_modal.style.display = "block";
}
 
 // password change 
 document.getElementById('password_change_button').onclick = async function() {
    try {
        const uniqueId = 21102002;
        const docRef = db.collection('users').doc(uniqueId.toString());
        const doc = await docRef.get();
        let old_password = document.getElementById('old_password');
        let new_password = document.getElementById('new_password');
        const hashPassword = await hash(old_password.value);
        const newhashPassword = await hash(new_password.value);
if (doc.exists) {
    const taskArray = doc.data().taskArray;
    const selectElement = document.getElementById('name');
    const selectedIndex = selectElement.selectedIndex;

    if (new_password!='' && taskArray[selectedIndex].pin==hashPassword) {
        console.log(taskArray[selectedIndex].pin);
         taskArray[selectedIndex].pin = newhashPassword;
         old_password.innerHTML = '';
         new_password.innerHTML = '';
         password_change_modal.style.display = "none";
         modal.style.display = "none";
        await docRef.update({ taskArray: taskArray });
        console.log(new_password.value);
        toast('New Password :'+ new_password.value);
    } else if (new_password=='' || new_password==null) {
      toast('Please Enter New Password');
    } else {
        toast('Worng password');
    }
} else {
    console.log('No such document!');
}
    } catch (error) {
        console.error("Error during password change: ", error);
    }
   
}


 // name password check
 var selectedIndex;
document.getElementById('n_submit').addEventListener('click', async () => {
    try {
        const uniqueId = 21102002;
        const docRef = db.collection('users').doc(uniqueId.toString());
        const doc = await docRef.get();
        pins = [];
        if (doc.exists) {
            const taskArray = doc.data().taskArray;
            taskArray.forEach(person => {
                pins.push(person.pin);
            });
        } else {
            console.log('No such document!');
            toast('No such document!');
        }
        const selectElement = document.getElementById('name');
         selectedIndex = selectElement.selectedIndex;
        let pin = document.getElementById('pin').value;
        const hashedPassword = await hash(pin);
        if (pins[selectedIndex] == hashedPassword) {
          timeCondition();
          timeCondition2();
          toast('Login successful! Welcome');
            document.getElementById('n_select').style.display = 'none';
            document.getElementById('all_content').style.display = 'block';
            userName =document.getElementById('name').value;
            document.getElementById('user_name').innerHTML = userName;
          
           
            highlighteRow();
          
        } else {
            console.log('Incorrect pin');
            toast('Incorrect pin...!');
        }
    } catch (error) {
        console.error('Error fetching task array: ', error);
        toast('Error fetching task array: ',error.massage,true);
    }
});



// name fetch in select option 
async function fetchAndPopulateNames() {
    try {
        const uniqueId = 21102002;
        const docRef = db.collection('users').doc(uniqueId.toString());
        const doc = await docRef.get();
        if (doc.exists) {
            const taskArray = doc.data().taskArray;
            const nameSelect = document.getElementById('name');
            taskArray.forEach(person => {
                const option = document.createElement('option');
                option.value = person.text;
                option.text = person.text;
                nameSelect.appendChild(option);
            });
        } else {
            console.log('No such document!');
            toast('No such document!');
        }
    } catch (error) {
        console.error('Error fetching task array: ', error);
        toast('Error fetching task array: ',error.massage,true);
    }
}

fetchAndPopulateNames();

function highlighteRow(){
    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tr");
    rows.forEach((row, index) => {
        if (index === selectedIndex + 1) {
            row.classList.add('highlighted');
        } else {
            row.classList.remove('highlighted');
        }
    });
 }
 
function updateMeal(residentMeal, guestMeals) {
    let mealCode = "";
    switch (residentMeal) {
        case 'lunch':
            mealCode = "1D";
            break;
        case 'dinner':
            mealCode = "1R";
            break;
        case 'both':
            mealCode = "2";
            break;
        case '×':
             mealCode = "×";
             break;
        default:
            mealCode = "0";
    }
    let guestMealCount = {
        'GD': 0,
        'GR': 0,
        'GDR': 0
    };

    guestMeals.forEach(guestMeal => {
        switch (guestMeal) {
            case 'lunch':
                guestMealCount['GD']++;
                break;
            case 'dinner':
                guestMealCount['GR']++;
                break;
            case 'both':
                guestMealCount['GDR']++;
                break;
        }
    });
    for (const [key, value] of Object.entries(guestMealCount)) {
        if (value > 0) {
            mealCode += `+${value}${key}`;
        }
    }
    return mealCode;
}
// Function to fetch and print data in the table
// var currentday=true;
async function fetchAndPrintData(){
    try {
        // Clear existing table data
var rows = table.querySelectorAll('tr');
rows.forEach(function(row, index) {
    if (index !== 0) {
        row.remove();
    }
});

        const uniqueId = 21102002;
        const docRef = db.collection('users').doc(uniqueId.toString());
        const doc = await docRef.get();
        if (doc.exists) {
          
            const taskArray = doc.data().taskArray;
            const table = document.querySelector("table");
            taskArray.forEach((person, index) => {
               
                const row = table.insertRow();
                row.insertCell(0).innerText = index + 1;
                row.insertCell(1).innerText = person.text;
                
                let resident = person.todayM[0];
               let guest = person.todayM.slice(1);
               
                
            let todayM = updateMeal(resident,guest);
            
               let residentPrev= person.prevM[0];
               let guestPrev = person.prevM.slice(1);
               
             let prevM= updateMeal(residentPrev, guestPrev);
            
             let residentNext= person.nextM[0];
               let guestNext = person.nextM.slice(1);

           let nextM = updateMeal(residentNext,guestNext);

                row.insertCell(2).innerText = '¥';
                row.insertCell(3).innerText = todayM; 
                if (nextM == '0') {
                    row.insertCell(4).innerText = '';
                }else {
                  row.insertCell(4).innerText =nextM;
                }
                
            });
            highlighteRow();
            
        } else {
            console.log('No such document!');
            toast('No such document!');
        }
    } catch (error) {
        console.error('Error fetching task array: ', error);
        toast('Error fetching task array: ' + error.message, true); // Correct typo: error.message
    }
    totalMeal(0);
}
fetchAndPrintData();

let nextDayMode = false;

 //time condition
async function timeCondition() {
    const uniqueId = 21102002;
    const docRef = db.collection('users').doc(uniqueId.toString());
    const doc = await docRef.get();

    if (doc.exists) {
        const taskArray = doc.data().taskArray;
        var resident = taskArray[selectedIndex].todayM[0]; 
        
        if (resident=='×') {
          resident ='opt_out';
        }
        
        document.querySelector(`input[name="monday_meal"][value="${resident}"]`).checked = true;

    
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const labels = document.querySelectorAll('#mealForm label');
        const lunch = labels[0];
        const dinner = labels[1];
        const both = labels[2];
        const off = labels[3];
        if (nextDayMode != true) {
            if (currentHour >= lastEveningUpdateTime) {
                lunch.previousElementSibling.disabled = true;
                dinner.previousElementSibling.disabled = true;
                both.previousElementSibling.disabled = true;
                off.previousElementSibling.disabled = true;
            } else if (resident == 'lunch' && currentHour >= lastMorningUpdateTime) {
                off.previousElementSibling.disabled = true;
                dinner.previousElementSibling.disabled = true;
                lunch.previousElementSibling.disabled = false;
                both.previousElementSibling.disabled = false;
            }else if (resident == 'dinner' && currentHour >= lastMorningUpdateTime) {
                dinner.previousElementSibling.disabled = false;
                lunch.previousElementSibling.disabled = true;
                both.previousElementSibling.disabled = true;
                off.previousElementSibling.disabled = false;
            } else if (resident == 'both' && currentHour >= lastMorningUpdateTime) {
              off.previousElementSibling.disabled = true;
                dinner.previousElementSibling.disabled = true;
                lunch.previousElementSibling.disabled = false;
                both.previousElementSibling.disabled = false;
            } else if ((resident == 'opt_out' || resident == '×' )&& currentHour >= lastMorningUpdateTime) {

                lunch.previousElementSibling.disabled = true;
                both.previousElementSibling.disabled = true;
                dinner.previousElementSibling.disabled = false;
                off.previousElementSibling.disabled = false;
            }
        } else {
            lunch.previousElementSibling.disabled = false;
            dinner.previousElementSibling.disabled = false;
            both.previousElementSibling.disabled = false;
            off.previousElementSibling.disabled = false;
        }
    } else {
        console.error("Document does not exist.");
    }
}

// time condition 2
 async function timeCondition2() {
    const uniqueId = 21102002;
    const docRef = db.collection('users').doc(uniqueId.toString());
    const doc = await docRef.get();
    if (doc.exists) {
        const taskArray = doc.data().taskArray[selectedIndex].todayM;
        const labels = document.querySelectorAll('#guestMealOptions label');
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const lunch = labels[0];
        const dinner = labels[1];
        const both = labels[2];
        const off = labels[3];
        const arr = taskArray.slice(1);
        const options = ['Lunch', 'Dinner', 'Both', 'Opt_out']; // Updated options list
        const guestCount = arr.length; // Set guestCount based on the length of arr
        let guestMealOptionsHTML = "";

        // Generate guest meal options dynamically starting from index 1 
        for (let i = 0; i < guestCount; i++) {
            guestMealOptionsHTML += "<label for='guest" + (i + 1) + "_meal'>Guest " + (i + 1) + " Meal: </label>";
            guestMealOptionsHTML += "<select id='guest" + (i + 1) + "_meal' name='guest" + (i + 1) + "_meal'>";
            for (let j = 0; j < options.length; j++) {
                const value = options[j].toLowerCase(); // Match the option with the arr values
                const selected = (i < arr.length && value === arr[i]) ? " selected" : "";
                guestMealOptionsHTML += "<option value='" + value + "'" + selected + ">" + options[j] + "</option>";
            }
            guestMealOptionsHTML += "</select><br>";
        }

        document.getElementById("guestMealOptions").innerHTML = guestMealOptionsHTML;

        // Apply conditions after the selects have been added 
        const selects = document.querySelectorAll('#guestMealOptions select');
        
        selects.forEach((select, index) => {
            const selectedMeal = select.value.toLowerCase();
        
            // Reset all options to enabled
            options.forEach(option => {
                select.querySelector('option[value="' + option.toLowerCase() + '"]').disabled = false;
            });

            // Apply conditions based on currentHour and selectedMeal
            if (nextDayMode != true) {
            if (currentHour >= lastEveningUpdateTime) {
               select.querySelector('option[value="lunch"]').disabled = true;
               select.querySelector('option[value="dinner"]').disabled = true;
                select.querySelector('option[value="both"]').disabled = true;
                select.querySelector('option[value="opt_out"]').disabled = true;
            } else if (selectedMeal === 'lunch' && currentHour >= lastMorningUpdateTime) {
                select.querySelector('option[value="dinner"]').disabled = true;
                select.querySelector('option[value="opt_out"]').disabled = true;
            }else if (selectedMeal === 'dinner' && currentHour >= lastMorningUpdateTime) {
              select.querySelector('option[value="lunch"]').disabled = true;
              select.querySelector('option[value="both"]').disabled = true;
            } else if (selectedMeal === 'both' && currentHour >= lastMorningUpdateTime) {
                select.querySelector('option[value="dinner"]').disabled = true;
                select.querySelector('option[value="opt_out"]').disabled = true;
            } else if ((selectedMeal === 'opt_out' || selectedMeal==='×' ) && currentHour >= lastMorningUpdateTime) {
                select.querySelector('option[value="lunch"]').disabled = true;
                select.querySelector('option[value="both"]').disabled = true;
            }
            }
        });

    } else {
        console.error("Document does not exist.");
    }
}

let pins = [];

document.getElementById('mealForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var mondayMeal = document.querySelector('input[name="monday_meal"]:checked').value;
    var guestMealPreferences = [];
    var guestCount = document.getElementById('guestMealOptions').getElementsByTagName('select').length;
   // alert(guestCount);
    for (let i = 1; i <= guestCount; i++) {
        var guestMealPreference = document.getElementById('guest' + i + '_meal').value;
       if (guestMealPreference!='opt_out') {
        guestMealPreferences.push(guestMealPreference);
       }
    }

    var mealResults = document.getElementById('mealResults');
    mealResults.innerHTML = "<h3>Meal Preferences for " + (nextDayMode ? "Tomorrow:" : "Today:") + "</h3>";
    mealResults.innerHTML += "<p>Your Meal Preference: " + mondayMeal + "</p>";
    mealResults.innerHTML += "<h5>Guest Meal Preferences:</h5>";
    for (let i = 0; i < guestMealPreferences.length; i++) {
        mealResults.innerHTML += "<p>Guest " + (i + 1) + ": " + guestMealPreferences[i] + "</p>";
    }
      if(mondayMeal=='opt_out' || mondayMeal=='×'){
        mondayMeal='×';
      }
    if (nextDayMode) {
        updateNextDayMealTable(mondayMeal, guestMealPreferences);
    } else {
        updateMealTable(mondayMeal, guestMealPreferences);
    }
    
});

function updateMealTable(residentMeal, guestMeals) {
    const userName = document.getElementById('name').value;
    const table = document.querySelector("table");
    const selectElement = document.getElementById('name');
    const selectedIndex = selectElement.selectedIndex;
    let userRow = null;
    
    for (let i = 1; i < table.rows.length; i++) {
        if (table.rows[i].cells[1].innerHTML == userName) {
            userRow = table.rows[i];
            break;
        }
    }
    
   var  mealCode=updateMeal(residentMeal,guestMeals);
    if (userRow) {
        userRow.cells[3].innerText = mealCode;
        const uniqueId = 21102002; 
        const docRef = db.collection('users').doc(uniqueId.toString());
        docRef.get().then(doc => {
            if (doc.exists) {
                let taskArray = doc.data().taskArray;
                guestMeals.unshift(residentMeal);
                taskArray[selectedIndex].todayM = guestMeals;
                docRef.update({
                    taskArray: taskArray
                }).then(() => {
                    console.log("Document successfully updated!");
                }).catch((error) => {
                    console.error("Error updating document: ", error);
                });
            }
        }).catch((error) => {
            console.error("Error fetching document: ", error);
            toast('Error fetching task array: ',error.massage,true);
        });
        toast(mealCode);
    }
}

var userRow =null;
function updateNextDayMealTable(residentMeal, guestMeals) {
    const userName = document.getElementById('name').value;
    const table = document.querySelector("table");
    const selectElement = document.getElementById('name');
    const selectedIndex = selectElement.selectedIndex;
     userRow = 2;

    for (let i = 1; i < table.rows.length; i++) {
        if (table.rows[i].cells[1].innerHTML === userName) {
            userRow = table.rows[i];
            break;
        }
    }
   var mealCode=updateMeal(residentMeal,guestMeals);
    guestMeals.unshift(residentMeal);
    if (userRow) {
       if(mealCode == '0'){
         mealCode='×';
       }
         userRow.cells[4].innerText = mealCode; 
        const uniqueId = 21102002; 
        const docRef = db.collection('users').doc(uniqueId.toString());
        docRef.get().then(doc => {
            if (doc.exists) {
                let taskArray = doc.data().taskArray;
                taskArray[selectedIndex].nextM = guestMeals;
                docRef.update({
                    taskArray: taskArray
                }).then(() => {
                    console.log("Document successfully updated!");
                    toast("Document successfully updated!");
                }).catch((error) => {
                    console.error("Error updating document: ", error);
                    toast("Error updating document: ", error.massage,true);
                });
            }
        }).catch((error) => {
            console.error("Error fetching document: ", error);
            toast("Error fetching document: ", error.massage,true);
        });

        console.log(mealCode);
        toast(mealCode);
    }
    
}

// table refresh 
document.getElementById('next_day').addEventListener('click', function() {
  var options = document.querySelectorAll('#mealForm input[type="radio"]');
  options.forEach(function(option) {
    option.checked = false;
  });
  fetchAndPrintData();
  timeCondition();
  timeCondition2();
    nextDayMode = !nextDayMode;
    document.getElementById('meal_preference_text').innerText = nextDayMode ? 'Select your meal preference for Tomorrow:' : 'Select your meal preference for Today:';
    this.innerHTML = nextDayMode ? '<i class="fa-solid fa-angles-left"></i> Back to Today' : 'Next day<i class="fa-solid fa-angles-right"></i>';

});

document.getElementById('guestCountBtn').addEventListener('click', async function() {
    const uniqueId = 21102002;
    const docRef = db.collection('users').doc(uniqueId.toString());
    const doc = await docRef.get();
    if (doc.exists) {
        const taskArray = doc.data().taskArray[selectedIndex].todayM;
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        
        const arr = taskArray.slice(1);
        const guestCount = arr.length; // Set guestCount based on the length of arr

        // Prompt for guest count
        let enteredGuestCount;
        if (nextDayMode != true) {
            if (currentHour >= lastMorningUpdateTime && currentHour <= lastEveningUpdateTime) {
                do {
                    let input = prompt(`Enter the number of guests (must be at least ${guestCount}):`);
                    if (input === null || input === '') {
                        enteredGuestCount = guestCount;
                    } else {
                        enteredGuestCount = parseInt(input);
                    }
                } while (isNaN(enteredGuestCount) || enteredGuestCount < guestCount);
            } else if(currentHour <= lastEveningUpdateTime){
                let input = prompt("Enter the number of guests:");
                if (input === null || input === '') {
                    enteredGuestCount = guestCount;
                } else {
                    enteredGuestCount = parseInt(input);
                }
            } else {
              alert("Time is over, You can't change it now.")
            }
            
        } else {
            let input = prompt("Enter the number of guests:");
            if (input === null || input === '') {
                enteredGuestCount = guestCount;
            } else {
                enteredGuestCount = parseInt(input);
            }
        }

        // Generate the guest meal options HTML
        let guestMealOptionsHTML = document.getElementById('guestMealOptions').innerHTML; // Keep existing content
        if (nextDayMode == true) {
         guestMealOptionsHTML='';
         for (let i=1; i <= enteredGuestCount; i++) {
            guestMealOptionsHTML += "<label for='guest" + i + "_meal'>Guest " + i + " Meal: </label>";
            guestMealOptionsHTML += "<select id='guest" + i + "_meal' name='guest" + i + "_meal'>";
            guestMealOptionsHTML += "<option value='both'>Both Lunch and Dinner</option>";
            guestMealOptionsHTML += "<option value='lunch'>Lunch Only</option>";
            guestMealOptionsHTML += "<option value='dinner'>Dinner Only</option>";
            guestMealOptionsHTML += "<option value='opt_out'>Opt out</option>";
            guestMealOptionsHTML += "</select><br>";
        }
       }else{
        for (let i = guestCount + 1; i <= enteredGuestCount; i++) {
            guestMealOptionsHTML += "<label for='guest" + i + "_meal'>Guest " + i + " Meal: </label>";
            guestMealOptionsHTML += "<select id='guest" + i + "_meal' name='guest" + i + "_meal'>";
            guestMealOptionsHTML += "<option value='both'>Both Lunch and Dinner</option>";
            guestMealOptionsHTML += "<option value='lunch'>Lunch Only</option>";
            guestMealOptionsHTML += "<option value='dinner'>Dinner Only</option>";
            guestMealOptionsHTML += "<option value='opt_out'>Opt out</option>";
            guestMealOptionsHTML += "</select><br>";
        }
        }
        document.getElementById('guestMealOptions').innerHTML = guestMealOptionsHTML;

        // Apply default meal selection and conditions to disable meal options based on the current hour
        for (let i = guestCount + 1; i <= enteredGuestCount; i++) {
          
          if (nextDayMode != true) {
            const select = document.getElementById(`guest${i}_meal`);
            const selectedMeal = currentHour < lastMorningUpdateTime ? 'both' : 'dinner';
            select.value = selectedMeal;
            
            if (currentHour >= lastEveningUpdateTime) {
                select.querySelector('option[value="lunch"]').disabled = true;
                select.querySelector('option[value="dinner"]').disabled = true;
                select.querySelector('option[value="both"]').disabled = true;
                select.querySelector('option[value="opt_out"]').disabled = true;
            } else if (currentHour >= lastMorningUpdateTime) {
                if (selectedMeal === 'lunch') {
                    select.querySelector('option[value="dinner"]').disabled = true;
                    select.querySelector('option[value="opt_out"]').disabled = true;
                } else if (selectedMeal === 'dinner') {
                    select.querySelector('option[value="lunch"]').disabled = true;
                    select.querySelector('option[value="both"]').disabled = true;
                } else if (selectedMeal === 'both') {
                    select.querySelector('option[value="dinner"]').disabled = true;
                    select.querySelector('option[value="opt_out"]').disabled = true;
                } else if (selectedMeal === 'opt_out' || selectedMeal ==='×') {
                    select.querySelector('option[value="lunch"]').disabled = true;
                    select.querySelector('option[value="both"]').disabled = true;
                }
            }
        }
        }
    }
});




// Function to update the meals at the change of the day
async function updateMealsAtDateChange() {
    const uniqueId = 21102002;
    const docRef = db.collection('users').doc(uniqueId.toString());
    try {
        const doc = await docRef.get();
        if (doc.exists) {
            let taskArray = doc.data().taskArray;
            taskArray.forEach(task => {
                task.prevM = task.todayM;
                if(task.nextM=='0' || task.nextM==''){
                  task.todayM =task.todayM ;
               }else{
                  task.todayM=task.nextM;
               }
              task.nextM = ['0'];
            });
            await docRef.update({ taskArray });
         fetchAndPrintData();
        } else {
       
            toast('No such document!');
        }
    } catch (error) {
     
        toast("Error updating meals: ", error.massage,true);
    }
    
}



// Create a new Date object 

async function saveDateToFirestore() {
            const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
            try {
                await db.collection("lastdate").doc("21102002").set({
                    lastCheckedDate: today
                });
                console.log("Date saved to Firestore.");
            } catch (error) {
                console.error("Error saving date to Firestore: ", error);
            }
        }

        // Function to check the date difference and alert if necessary
        
        async function checkDateDifference() {
            const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
            try {
                const doc = await db.collection("lastdate").doc("21102002").get();
                if (doc.exists) {
                    const savedDate = doc.data().lastCheckedDate;
                    const saved = new Date(savedDate);
                    const current = new Date(today);

                    // Calculate the difference in days
                    const differenceInTime = current.getTime() - saved.getTime();
                    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

                    // Check if the difference is exactly 1 day or more
                    if (differenceInDays === 1) {
                       updateMealsAtDateChange();
                    } else if (differenceInDays > 1) {
                        const daysOffMeal = Math.floor(differenceInDays - 1);                    
                        updateMealsAtDateChange(); 
                    }
                } else {
                    alert('No data in Firestore');
                }

                // Save today's date to Firestore
                saveDateToFirestore();
            } catch (error) {
                console.error("Error getting date from Firestore: ", error);
            }
        }

        // Call the function to check the date difference when the page loads
      
      
      window.onload = function() {
    setTimeout(checkDateDifference, 1000);
};

    
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1; 
const year = date.getFullYear();
day = day < 10 ? '0' + day : day;
month = month < 10 ? '0' + month : month;
const formattedDate = `${day}${month}${year}`;





//toast msg function 
function toast(message) {
  var toastElement = document.getElementById('toast');
  toastElement.innerHTML = message;
  toastElement.style.visibility = 'visible';
  setTimeout(function() {
    toastElement.style.visibility = 'hidden';
  }, 2000);
}


// total meal
async function totalMeal(t) {
//  console.log(t);
  let total_day = 0,total_rat = 0;
  const uniqueId = 21102002;
  const docRef = db.collection('users').doc(uniqueId.toString());

  try {
    const doc = await docRef.get();
    if (doc.exists) {
      const taskArray = doc.data().taskArray;
      for (let i = 0; i < taskArray.length; i++) {
        const x = taskArray[i].todayM;
        for (let j = 0; j < x.length; j++) {
          if (x[j] == 'lunch') {
            total_day++;
          } else if (x[j] == 'dinner') {
            total_rat++;
          } else if (x[j] == 'both') {
            total_day++;
            total_rat++;
          }
        }
      }
    } else {
      console.log('No such document!');
      toast('No such document!');
      return;
    }

    var totalMeal = total_day + total_rat;
    const table = document.querySelector("#table table");
    let row;

    if (t === 0) {
      // Insert new row with cells
      row = table.insertRow();
      row.insertCell(0).innerHTML = '<i class="fa-solid fa-arrow-right"></i>';

      row.insertCell(1).textContent = "Total";
      row.insertCell(2).innerHTML = "Meals" + '<i class="fa-solid fa-arrow-right"></i>';

      row.insertCell(3).textContent = "TD:" + total_day + ", " + "T:" + total_rat + ", " + "TDR:" + totalMeal;
      row.insertCell(4).textContent ='--';
    } else {
    
      // Update existing row
      const rows = table.getElementsByTagName("tr");
      if (rows.length > 0) {
        row = rows[rows.length - 1]; // Get the last row
        row.style.border='1px solid black';
        if (row.cells.length >= 4) {
          // Update existing fourth cell
          row.cells[3].textContent = "TD:" + total_day + ", " + "TR:" + total_rat + ", " + "TDR:" + totalMeal;
        } else {
          console.error('Fourth cell does not exist in the last row!');
          toast('Fourth cell does not exist in the last row!', true);
        }
      } else {
        console.error('No rows found in the table!');
        toast('No rows found in the table!', true);
      }
    }
  } catch (e) {
    console.error("Error updating meals: ", e);
    toast("Error updating meals: " + e.message, true);
  }
}


setInterval(function() {
    totalMeal(1);
}, 12000);

async function fetchAndGenerateTable() {
            try {
                const uniqueId = 21102002;
                const docRef = db.collection('users').doc(uniqueId.toString());
                const doc = await docRef.get();

                if (doc.exists) {
                    const taskArray = doc.data().taskArray;
                    const names = taskArray.map(item => item.text);
                    const mealDataArray = taskArray.map(item => item.totalMeal);
                 generateTable(names, mealDataArray);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        function formatDate(dateString) {
            const day = dateString.slice(6, 8);
            const month = dateString.slice(4, 6);
            const year = dateString.slice(0, 4);
            return `${day}/${month}/${year}`;
        }

        function decodeCode(code) {
            let R = 0;
            let G = 0;
            let parts = code.split('+');
            parts.forEach(part => {
                let number = parseInt(part);
                if (isNaN(number)) {
                    number = 1;
                }

                if (part.includes('GDR')) {
                    G += number * 2;
                } else if (part.includes('2')) {
                    R += number;
                } else if (part.includes('GD') || part.includes('GR')) {
                    G += number;
                } else if (part.includes('R') || part.includes('D')) {
                    R += number;
                }
            });

            return { R, G };
        }

        function generateTable(names, mealDataArray) {
            const tableContainer = document.getElementById("tableContainer");
            const table = document.createElement("table");
            table.id="totalMealTable";

            const headerRow = document.createElement("tr");
            const firstHeaderCell = document.createElement("th");
            firstHeaderCell.textContent = "Name \\ Date";
            headerRow.appendChild(firstHeaderCell);

            const dates = new Set();
            mealDataArray.forEach(mealData => {
                mealData.forEach(meal => {
                    const date = meal.split('-')[0];
                    dates.add(date);
                });
            });

            const sortedDates = Array.from(dates).sort();

            sortedDates.forEach(date => {
                const headerCell = document.createElement("th");
                headerCell.textContent = formatDate(date);
                headerRow.appendChild(headerCell);
            });

            const totalHeaderCell = document.createElement("th");
            totalHeaderCell.textContent = "Total Meal/Head";
            headerRow.appendChild(totalHeaderCell);
            table.appendChild(headerRow);

            const totals = {
                TD: Array(sortedDates.length).fill(0),
                TR: Array(sortedDates.length).fill(0),
                TDR: Array(sortedDates.length).fill(0)
            };

            names.forEach((name, nameIndex) => {
                const row = document.createElement("tr");
                const nameCell = document.createElement("td");
                nameCell.textContent = name;
                row.appendChild(nameCell);

                let totalR = 0;
                let totalG = 0;

                sortedDates.forEach((date, dateIndex) => {
                    var mealData = mealDataArray[nameIndex].find(meal => meal.startsWith(date));
                    if (!mealData || mealData === "×") {
                        mealData = `${date}-×`;
                    }
                    const cell = document.createElement("td");
                    if (mealData) {
                        const mealDetails = mealData.split('-')[1];
                        cell.textContent = mealDetails;
                        const { R, G } = decodeCode(mealDetails);
                        totalR += R;
                        totalG += G;
                        totals.TD[dateIndex] += R;
                        totals.TR[dateIndex] += G;
                        totals.TDR[dateIndex] += (R + G);
                    } else {
                        cell.textContent = "×";
                        cell.classList.add("editable");
                    }
                    row.appendChild(cell);
                });

                const totalCell = document.createElement("td");
                totalCell.innerHTML = `Rm=${totalR},Gm=${totalG},Tm=${totalR + totalG}`;
                row.appendChild(totalCell);
                table.appendChild(row);
            });

            const totalRow = document.createElement("tr");
            const totalLabelCell = document.createElement("td");
            totalLabelCell.textContent = "Total Meal / Day";
            totalRow.appendChild(totalLabelCell);

            totals.TD.forEach((td, index) => {
                const totalCell = document.createElement("td");
                totalCell.innerHTML = `TDR=${totals.TDR[index]}`;
                totalRow.appendChild(totalCell);
            });

            let totalT = 0;
            totals.TDR.forEach(total => {
                totalT += total;
            });
            const totalTCell = document.createElement("td");
            totalTCell.textContent = `Total Meal=${totalT}`;
            totalRow.appendChild(totalTCell);

            table.appendChild(totalRow);

            tableContainer.innerHTML = "";
            tableContainer.appendChild(table);
        }

        function formatDateForFirebase(dateString) {
            const [day, month, year] = dateString.split('/');
            return `${year}${month}${day}`;
        }

        
        document.getElementById('totalMeal').onclick = function() {
    fetchAndGenerateTable();
    document.getElementById('totalMealPrint').style.display = 'block';
    document.getElementById('all_content').style.display = 'none';
    
  let modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
        modals[i].style.display = 'none';
    }
}

document.getElementById('close_total_meal').onclick = function() {
    document.getElementById('totalMealPrint').style.display = 'none';
    document.getElementById('all_content').style.display = 'block';
    
    let modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
        modals[i].style.display = 'none';
    }
}


document.getElementById('user_feedback').onclick = function() {
  document.getElementById('your_feedback').style.display = 'block';
  loadFeedback();
  document.getElementById('all_content').style.display = 'none';
}

document.getElementById('feedback_windo_close').onclick = function() {
  document.getElementById('your_feedback').style.display = 'none';
  document.getElementById('all_content').style.display = 'block';
}

        
 document.getElementById('saveFeedback').onclick = async function saveFeedback() {
    const feedbackInput = document.getElementById('feedback_input').value.trim(); // Added trim() to remove leading/trailing whitespace
    if (feedbackInput) {
        try {
            await db.collection('feedback')
                    .doc('21102002')
                    .collection('all_feedback')
                    .add({
                        name: userName, // Assuming userName is defined elsewhere in your code
                        feedback: feedbackInput,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    });
            document.getElementById('feedback_input').value = ''; // Clear input after successfully saving
            loadFeedback(); // Reload feedback after saving
        } catch (error) {
            console.error('Error saving feedback:', error);
            // Handle error (e.g., display a message to the user)
        }
    } else {
        console.log('Feedback input is empty.');
        // Optionally handle case where feedback input is empty
    }
}

        async function editFeedback(id, newFeedback) {
            await db.collection('feedback').doc('21102002').collection('all_feedback').doc(id).update({
                feedback: newFeedback
            });
            loadFeedback();
        }

        async function deleteFeedback(id) {
            await db.collection('feedback').doc('21102002').collection('all_feedback').doc(id).delete();
            loadFeedback();
        }

        function formatRealDate(timestamp) {
            const date = timestamp.toDate();
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        }

        function createFeedbackElement(doc) {
            const feedbackItem = document.createElement('div');
            feedbackItem.className = 'feedback-item';

            const feedbackHeader = document.createElement('div');
            feedbackHeader.className = 'feedback-header';
            feedbackHeader.textContent = `${doc.data().name.toUpperCase()}`;
            feedbackItem.appendChild(feedbackHeader);

            const feedbackText = document.createElement('div');
            feedbackText.className = 'feedback-text';
            feedbackText.textContent = doc.data().feedback;
            feedbackItem.appendChild(feedbackText);

            const feedbackFooter = document.createElement('div');
            feedbackFooter.className = 'feedback-footer';

            const feedbackMeta = document.createElement('div');
            feedbackMeta.textContent = formatRealDate(doc.data().timestamp);
            feedbackFooter.appendChild(feedbackMeta);

            // Show Edit and Delete buttons only if the current user is the author of the feedback
            if (doc.data().name === userName) {
                const feedbackActions = document.createElement('div');
                feedbackActions.className = 'feedback-actions';

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.onclick = () => {
                    const newFeedback = prompt('Edit your feedback:', doc.data().feedback);
                    if (newFeedback !== null) {
                        editFeedback(doc.id, newFeedback);
                    }
                };
                feedbackActions.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteFeedback(doc.id);
                feedbackActions.appendChild(deleteButton);

                feedbackFooter.appendChild(feedbackActions);
            }

            feedbackItem.appendChild(feedbackFooter);

            return feedbackItem;
        }

        async function loadFeedback() {
            const feedbackDiv = document.getElementById('all_feedback');
            feedbackDiv.innerHTML = '';
            const snapshot = await db.collection('feedback').doc('21102002').collection('all_feedback').orderBy('timestamp', 'desc').get();
            snapshot.forEach(doc => {
                const feedbackItem = createFeedbackElement(doc);
                feedbackDiv.appendChild(feedbackItem);
            });
        }
