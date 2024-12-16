let calendar = document.querySelector('.calendar')

const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 ===0)
}

getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28
}

generateCalendar = (month, year) => {

    let calendar_days = calendar.querySelector('.calendar-days')
    let calendar_header_year = calendar.querySelector('#year')

    let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    calendar_days.innerHTML = ''

    let currDate = new Date()
    if (!month) month = currDate.getMonth()
    if (!year) year = currDate.getFullYear()

    let curr_month = `${month_names[month]}`
    month_picker.innerHTML = curr_month
    calendar_header_year.innerHTML = year

    // get first day of month
    
    let first_day = new Date(year, month, 1)

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
        let day = document.createElement('div')
        if (i >= first_day.getDay()) {
            day.classList.add('calendar-day-hover')
            day.innerHTML = i - first_day.getDay() + 1
            day.innerHTML += `<span></span>
                            <span></span>
                            <span></span>
                            <span></span>`
            if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                day.classList.add('curr-date')
            }
        }
        calendar_days.appendChild(day)
    }
}

let month_list = calendar.querySelector('.month-list')

month_names.forEach((e, index) => {
    let month = document.createElement('div')
    month.innerHTML = `<div data-month="${index}">${e}</div>`
    month.querySelector('div').onclick = () => {
        month_list.classList.remove('show')
        curr_month.value = index
        generateCalendar(index, curr_year.value)
    }
    month_list.appendChild(month)
})

let month_picker = calendar.querySelector('#month-picker')

month_picker.onclick = () => {
    month_list.classList.add('show')
}

let currDate = new Date()

let curr_month = {value: currDate.getMonth()}
let curr_year = {value: currDate.getFullYear()}

generateCalendar(curr_month.value, curr_year.value)

document.querySelector('#prev-year').onclick = () => {
    --curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}

document.querySelector('#next-year').onclick = () => {
    ++curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}
// Array to hold bookings (retrieved from localStorage if available)
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// Function to prompt for a reason and book an appointment
const bookAppointment = (dayElement) => {
    const selectedDate = dayElement.dataset.date;
    const reason = prompt("Enter a reason for booking this date:");
    
    if (reason) {
        // Add booking to the array
        bookings.push({ date: selectedDate, reason });
        localStorage.setItem('bookings', JSON.stringify(bookings)); // Save to localStorage
        displayBookings(); // Update UI
    }
};

// Function to display bookings on the calendar
const displayBookings = () => {
    // Clear previous display
    document.querySelectorAll('.calendar-days div').forEach(dayElement => {
        dayElement.classList.remove('booked');
        dayElement.title = ''; // Clear tooltip text
    });

    // Mark booked dates
    bookings.forEach(booking => {
        const dateElement = document.querySelector(`.calendar-days div[data-date='${booking.date}']`);
        if (dateElement) {
            dateElement.classList.add('booked');
            dateElement.title = `Booked: ${booking.reason}`; // Tooltip for reason
        }
    });
};

// Update generateCalendar to add data attribute and event listener for each day
generateCalendar = (month, year) => {
    let calendar_days = calendar.querySelector('.calendar-days');
    let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    calendar_days.innerHTML = '';

    let currDate = new Date();
    if (!month) month = currDate.getMonth();
    if (!year) year = currDate.getFullYear();
    let first_day = new Date(year, month, 1);

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
        let day = document.createElement('div');
        if (i >= first_day.getDay()) {
            const dayNum = i - first_day.getDay() + 1;
            day.classList.add('calendar-day-hover');
            day.innerHTML = dayNum;
            day.dataset.date = `${year}-${month + 1}-${dayNum}`; // Set date attribute

            // Event listener for booking
            day.addEventListener('click', () => bookAppointment(day));

            if (dayNum === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                day.classList.add('curr-date');
            }
        }
        calendar_days.appendChild(day);
    }

    displayBookings(); // Display existing bookings after generating the calendar
};

// Initial call to render calendar
generateCalendar(curr_month.value, curr_year.value);


