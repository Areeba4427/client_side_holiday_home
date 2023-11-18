
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
});

const Booked = [], DateN = [], Day = [], SeasonTwo = [], Season = [], Period_Statment = [],
    PriceLess6 = [], PriceHigh6 = [], PerBasis = [], DaysOfChange = [], combinedArray = [], Nights = [];
let SeasonNew = [];
let Status, Current_Season;

const durationSelect = document.getElementById('duration');  //1week & 3 nights
const peopleSelect = document.getElementById('people');   //1-6 & 6-10 
const period_select = document.getElementById("period");   //date
const durationOptionsone = [
    { value: '1', textContent: '1 week' },
    { value: '2', textContent: '2 weeks' },
    { value: '3', textContent: '3 weeks' },
    { value: '4', textContent: '4 weeks' },
    { value: '5', textContent: '5 weeks' }
  ];

  const durationOptionstwo = [
    { value: '3', textContent: '3 Nights' },
    { value: '4', textContent: '4 Nights' },
    { value: '5', textContent: '5 Nights' },
    { value: '6', textContent: '6 Nights' },
    { value: '7', textContent: '7 Nights' }
  ];



function duration_select_function() {

    console.log(period_select.value);
    for (let i = 0; i < DateN.length && DateN[i] !== ''; i++) {

        if (period_select.value == DateN[i])
            Current_Season = Season[i]
    }
    console.log("current season: " + Current_Season)
    selectChange(Current_Season);

}
period_select.addEventListener("change", duration_select_function)
window.onload = selectChange('3');
function selectChange(season) {

    // Select element number of people 
    const option16 = peopleSelect.querySelector('option[value="1"]');
    peopleSelect.innerHTML = '';
    durationSelect.innerHTML = '';

    peopleSelect.appendChild(option16);
    if (season == '1' || season == '2') {
        const option610 = document.createElement('option');
        option610.value = '2';
        option610.textContent = '6-10';
        peopleSelect.appendChild(option610);

        durationOptionsone.forEach(option => {
            const durationOption = createOption(option.value, option.textContent);
            durationSelect.appendChild(durationOption);
          });

    }
    else if (season === '3') {
        peopleSelect.remove(1);

        durationOptionstwo.forEach(option => {
            const durationOption = createOption(option.value, option.textContent);
            durationSelect.appendChild(durationOption);
          });
    }

    // SeasonNew = [];

}

function createOption(value , textContent) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = textContent;
    return option;
}


// Function to populate the select element with options
function populateSelect() {
    for (let i = 0; i < SeasonNew.length; i++) {
        const option = document.createElement("option");
        option.value = SeasonNew[i];
        option.text = SeasonNew[i];
        period_select.appendChild(option);
    }
}



// // googe sheet API portion  -- GET REQUEST
const sheet_Range1 = 'SOURCE!A2:K500';
const NewURL = `https://ludoborsiglianaupdated.azurewebsites.net/google-sheets-proxy`;
fetch(NewURL)
    .then(response => response.json())
    .then(data => {
        const values = data.values;

        values.map(row => {
            Booked.push(row[0]);
            DateN.push((row[1]));
            Day.push((row[2]));
            SeasonTwo.push((row[3]));
            Season.push((row[4]));
            DaysOfChange.push(row[5]);
            PriceLess6.push(row[6]);
            PriceHigh6.push(row[7]);
            PerBasis.push(row[8]);
            Period_Statment.push(row[9]);
            Nights.push(row[10]);

        });

        selectElement();
    })


function selectElement() {
    let p = 0;
    period_select.innerHTML = "";

    for (let i = 0; i < DateN.length && DateN[i] !== ''; i++) {


        if (DaysOfChange[i] !== 'No change') {
            SeasonNew[p] = DateN[i];
            p++;
        }
    }
    period_select.innerHTML = "";
    populateSelect();
    PriceExtraction(DateN, PriceLess6, PriceHigh6, PerBasis);
}

window.onload = selectElement();

function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    var yyyy = today.getFullYear();
    document.getElementById("date").value = dd + '/' + mm + '/' + yyyy;
}
window.onload = getCurrentDate();


document.getElementById("submit").addEventListener("click", function (event) {
    if (!validateForm()) {
        event.preventDefault(); // Prevent the default form submission behavior
        return false;
    }
    SuccessMessage();
});


function SuccessMessage() {
    document.getElementById("BookingForm").style.display = "none";;
    document.getElementById("success-message").style.display = "block";
}

// Booking button click and add start and end date.
var Start = document.getElementById("start_date");
var End = document.getElementById("end_date");

document.getElementById("booking_button").addEventListener("click", () => {
    Start.value = period_select.value;

    var startDateParts = Start.value.split('/');
    var day = parseInt(startDateParts[0], 10);
    var month = parseInt(startDateParts[1], 10) - 1; // Months are zero-based
    var year = parseInt(startDateParts[2], 10);


    var startDate = new Date(year, month, day);

    if (Current_Season == 1 || Current_Season == 2) {
        startDate.setDate(startDate.getDate() + ((7 * durationSelect.value)));
    }
    else {
        startDate.setDate(startDate.getDate() + (durationSelect.value - 1));
    }
    var endDate = (startDate.getDate()).toString() + '/' +
        (startDate.getMonth() + 1).toString() + '/' +
        startDate.getFullYear();

    End.value = endDate;
    document.getElementById("app2").style.display = 'block';


    fetch(`https://ludoborsiglianaupdated.azurewebsites.net/client-request`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            if (data.values) {
                const existingData = data.values.length;

                const nextSerialNumber = existingData + 1;
                document.getElementById("serial").value = nextSerialNumber;

            } else {
                existingData = 0;
                const nextSerialNumber = existingData + 1;
                document.getElementById("serial").value = nextSerialNumber;

            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });


    BookingChecker(Booked, DateN, Day, SeasonTwo, Season, DaysOfChange, PriceLess6, PriceHigh6, PerBasis,
        Period_Statment, Nights, startDate, endDate);

})
function BookingChecker(Booked, DateN, Day, SeasonTwo, Season, DaysOfChange, PriceLess6, PriceHigh6, PerBasis, Period_Statement, Nights, startDate, endDate) {
    let startFlag = false;
    let isEmpty = true;


    for (let i = 0; i < DateN.length; i++) {
        if (DateN[i] === period_select.value) {

            startFlag = true;
        }

        if (startFlag) {
            if (Booked[i] !== '') {
                isEmpty = false;
                Status = 'failure';
                break;
            }

            Booked[i] = 'Y';

            if (DateN[i] === endDate) {
                startFlag = false;
            }
        }
    }

    for (let i = 0; i < Booked.length; i++) {
        combinedArray.push([Booked[i], DateN[i], Day[i], SeasonTwo[i], Season[i], DaysOfChange[i], PriceLess6[i], PriceHigh6[i], PerBasis[i], Period_Statement[i], Nights[i]]);
    }
    if (isEmpty) {
        Status = 'success';
    }

    document.getElementById("status").value = Status;


    PostBooking(Status, combinedArray,);
}

function hover(n) {
    if (n >= 1 && n <= 3) {
        var elementId = "display" + n;
        document.getElementById(elementId).style.display = "block";
    }
}
function dis(n) {
    if (n >= 1 && n <= 3) {
        var elementId = "display" + n;
        document.getElementById(elementId).style.display = "none";
    }
}




function PriceExtraction(DateN, PriceLess6, PriceHigh6, PerBasis) {

    console.log("In price extraction function: "+Current_Season);
    console.log("In price Extraction function: "+durationSelect.value);
    for (let i = 0; i < DateN.length && DateN[i] !== ''; i++) {
        if (period.value == DateN[i]) {
            if (peopleSelect.value == '1') {
                document.getElementById("total_per_basis").textContent = formatter.format(Number(PriceLess6[i]) * Number(durationSelect.value) );
            }
            else {
                document.getElementById("total_per_basis").textContent = formatter.format(Number(PriceHigh6[i]) * Number(durationSelect.value));
            }
            document.getElementById("per_basis_label").textContent = "Totaal"
        }
    }
}

function PostBooking(Status, combinedArray) {
    console.log(Status, combinedArray);
    fetch('https://ludoborsiglianaupdated.azurewebsites.net/google-sheets-changes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Status, combinedArray }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Assuming your server responds with JSON
        })
        .then((data) => {
            // Handle the response from your server here
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function validateForm() {
    var dateInput = document.forms["bookingForm"]["date"].value;
    var nameInput = document.forms["bookingForm"]["name"].value;
    var emailInput = document.forms["bookingForm"]["email"].value;
    var telInput = document.forms["bookingForm"]["tel"].value;
    var start_Date = document.forms['bookingForm']["start_date"].value;
    var end_Date = document.forms['bookingForm']["end_date"].value;
    var Guests = document.forms['bookingForm']["guests"].value;

    // Check if any required field is empty
    if (dateInput === "" || nameInput === "" || emailInput === "" || telInput === ""
        || start_Date === "" || end_Date === "" || Guests === "") {
        alert("All fields must be filled out");
        return false;
    }

    // Email validation using regular expression
    var emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (!emailRegex.test(emailInput)) {
        alert("Invalid email address");
        return false;
    }

    // Phone number validation using regular expression
    var telRegex = /^\d{9,10}$/;    // Assuming a 10-digit phone number
    if (!telRegex.test(telInput)) {
        alert("Invalid phone number (10 digits required)");
        return false;
    }
    if (document.getElementById("people").value == '1') {
        var upper_limit = 6;
        var lower_limit = 1;
    }
    else {
        var upper_limit = 10
        var lower_limit = 6;
    }

    if (Guests > upper_limit || Guests < lower_limit) {
        alert("The number of guests should be betweeen" + lower_limit + " to " + upper_limit);
        return false;
    }

    return true;
}

document.getElementById("go_back").addEventListener("click", () => {
    document.getElementById("app2").style.display = 'none';
    location.reload();
});

// Price Extraction
[durationSelect, peopleSelect, period].forEach(function (element) {
    element.addEventListener('change', function () {
        PriceExtraction(DateN, PriceLess6, PriceHigh6, PerBasis);
    });
});
