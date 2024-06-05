document.addEventListener("DOMContentLoaded", () => {
    const lodges = [
        { id: 1, top: 20, left: 20, width: 50, height: 50, capacity: 4, cost: 100, startDate: new Date('2024-06-01'), endDate: new Date('2024-06-10') },
        { id: 2, top: 80, left: 20, width: 50, height: 50, capacity: 4, cost: 150, startDate: new Date('2024-06-15'), endDate: new Date('2024-06-25') },
        { id: 3, top: 140, left: 20, width: 50, height: 50, capacity: 6, cost: 200, startDate: new Date('2024-07-01'), endDate: new Date('2024-07-10') },
        { id: 4, top: 200, left: 460, width: 50, height: 50, capacity: 6, cost: 250, startDate: new Date('2024-06-05'), endDate: new Date('2024-06-15') },
        { id: 5, top: 100, left: 140, width: 50, height: 50, capacity: 2, cost: 75, startDate: new Date('2024-06-20'), endDate: new Date('2024-06-30') },
        { id: 6, top: 160, left: 140, width: 50, height: 50, capacity: 2, cost: 90, startDate: new Date('2024-07-05'), endDate: new Date('2024-07-15') },
        { id: 7, top: 220, left: 140, width: 50, height: 50, capacity: 2, cost: 90, startDate: new Date('2024-07-20'), endDate: new Date('2024-07-30') },
        { id: 8, top: 220, left: 220, width: 50, height: 50, capacity: 2, cost: 80, startDate: new Date('2024-08-01'), endDate: new Date('2024-08-10') },
        { id: 9, top: 160, left: 220, width: 50, height: 50, capacity: 2, cost: 85, startDate: new Date('2024-08-15'), endDate: new Date('2024-08-25') },
        { id: 10, top: 280, left: 220, width: 50, height: 50, capacity: 8, cost: 300, startDate: new Date('2024-09-01'), endDate: new Date('2024-09-10') },
    ];
    // const lodges = [];

    // Function to fetch and parse XML data
    function fetchLodgeData() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'lodges.xml', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                parseLodgeData(xhr.responseXML);
            }
        };
        xhr.send();
    }
    
    // Function to parse XML data and populate lodges array
    function parseLodgeData(xml) {
        const lodgeNames = ['lodge1', 'lodge2', 'lodge3', 'lodge4', 'lodge5', 'lodge6', 'lodge7', 'lodge8', 'lodge9', 'lodge10'];
        for (const lodgeName of lodgeNames) {
            const lodgeElements = xml.getElementsByTagName(lodgeName);
            for (let i = 0; i < lodgeElements.length; i++) {
                const lodgeElement = lodgeElements[i];
                const lodge = {
                    id: parseInt(lodgeElement.querySelector('id').textContent),
                    top: parseInt(lodgeElement.querySelector('top').textContent),
                    left: parseInt(lodgeElement.querySelector('left').textContent),
                    width: parseInt(lodgeElement.querySelector('width').textContent),
                    height: parseInt(lodgeElement.querySelector('height').textContent),
                    capacity: parseInt(lodgeElement.querySelector('capacity').textContent),
                    cost: parseInt(lodgeElement.querySelector('cost').textContent),
                    startDate: new Date(lodgeElement.querySelector('startDate').textContent),
                    endDate: new Date(lodgeElement.querySelector('endDate').textContent)
                };
                lodges.push(lodge);
            }
        }
    }
    
    // Call fetchLodgeData to load lodge information
    fetchLodgeData();
    
    
    const mapContainer = document.getElementById('map-container');
    const lodgeInfo = document.getElementById('lodge-info');
    const bookingFormContainer = document.getElementById('booking-form-container');

    lodges.forEach(lodge => {
        const lodgeElement = document.createElement('div');
        lodgeElement.classList.add('lodge');
        lodgeElement.style.top = `${lodge.top}px`;
        lodgeElement.style.left = `${lodge.left}px`;
        lodgeElement.style.width = `${lodge.width}px`;
        lodgeElement.style.height = `${lodge.height}px`;

        lodgeElement.addEventListener('mouseenter', () => {
            lodgeElement.style.backgroundColor = 'orange'; // Hover color
            displayLodgeInfo(lodge);
        });

        lodgeElement.addEventListener('mouseleave', () => {
            lodgeElement.style.backgroundColor = ''; // Reset to default color
            lodgeInfo.style.display = 'none';
        });

        lodgeElement.addEventListener('click', () => {
            openBookingForm(lodge);
        });

        mapContainer.appendChild(lodgeElement);
    });

    function displayLodgeInfo(lodge) {
        const lodgeIdElem = document.getElementById('lodge-id');
        const lodgeCostElem = document.getElementById('lodge-cost');
        const lodgeStatusElem = document.getElementById('lodge-status');
        const lodgeCapacityElem = document.getElementById('lodge-capacity');
        const lodgeImage = document.getElementById('lodge-image');

        lodgeIdElem.textContent = lodge.id;
        lodgeCostElem.textContent = `$${lodge.cost}`;
        lodgeCapacityElem.textContent = lodge.capacity;
        lodgeImage.src = `./images/lodge${lodge.id}.jpg`;

        const checkInDate = document.getElementById('check-in-date').value;
        const checkOutDate = document.getElementById('check-out-date').value;
        const numberOfGuests = parseInt(document.getElementById('number-of-guests').value, 10);

        if (!checkInDate || !checkOutDate || !numberOfGuests) {
            lodgeStatusElem.textContent = 'Please fill in all fields.';
            lodgeInfo.style.display = 'block';
            return;
        }

        if (numberOfGuests > lodge.capacity) {
            lodgeStatusElem.textContent = 'Capacity exceeded.';
            lodgeInfo.style.display = 'block';
            return;
        }

        if (isLodgeAvailableForDates(lodge, checkInDate, checkOutDate)) {
            lodgeStatusElem.textContent = 'Available';
        } else {
            lodgeStatusElem.textContent = 'Not available';
        }
        lodgeInfo.style.display = 'block';
    }

    function isLodgeAvailableForDates(lodge, checkInDate, checkOutDate) {
        const parsedCheckInDate = new Date(checkInDate);
        const parsedCheckOutDate = new Date(checkOutDate);

        return parsedCheckOutDate < lodge.startDate || parsedCheckInDate > lodge.endDate;
    }

    function openBookingForm(lodge) {
        const guestsInput = document.getElementById('guests');
        const checkInInput = document.getElementById('check-in');
        const checkOutInput = document.getElementById('check-out');
        const totalCostInput = document.getElementById('total-cost');

        guestsInput.value = lodge.capacity;
        checkInInput.value = document.getElementById('check-in-date').value;
        checkOutInput.value = document.getElementById('check-out-date').value;
        totalCostInput.value = lodge.capacity * lodge.cost;

        bookingFormContainer.style.display = 'block';
    }

    const submitBookingButton = document.getElementById('submit-booking');
    submitBookingButton.addEventListener('click', () => {
        generateSummary();
        const successPopup = document.getElementById('success-popup');
        successPopup.style.display = 'block';
    });

    const closeSuccessPopupButton = document.getElementById('close-success-popup');
    closeSuccessPopupButton.addEventListener('click', () => {
        const successPopup = document.getElementById('success-popup');
        successPopup.style.display = 'none';
    });

    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', () => {
        const checkInDate = document.getElementById('check-in-date').value;
        const checkOutDate = document.getElementById('check-out-date').value;
        const numberOfGuests = parseInt(document.getElementById('number-of-guests').value, 10);

        if (!checkInDate || !checkOutDate || !numberOfGuests) {
            alert('Please fill in all fields.');
            return;
        }

        lodges.forEach((lodge, index) => {
            const lodgeElement = document.querySelectorAll('.lodge')[index];
            if (numberOfGuests > lodge.capacity || !isLodgeAvailableForDates(lodge, checkInDate, checkOutDate)) {
                lodgeElement.classList.remove('available');
                lodgeElement.classList.add('unavailable');
            } else {
                lodgeElement.classList.remove('unavailable');
                lodgeElement.classList.add('available');
            }
        });
    });

    // Close booking form button
    const closeFormButton = document.createElement('button');
    closeFormButton.textContent = 'Close';
    closeFormButton.addEventListener('click', () => {
        bookingFormContainer.style.display = 'none';
    });
    bookingFormContainer.appendChild(closeFormButton);

    // Ensure check-out date is after check-in date
    const checkInDateInput = document.getElementById('check-in-date');
    const checkOutDateInput = document.getElementById('check-out-date');

    checkInDateInput.addEventListener('change', () => {
        checkOutDateInput.min = checkInDateInput.value;
    });

    function generateSummary() {
        const name = document.getElementById('name').value;
        const guests = document.getElementById('guests').value;
        const checkIn = document.getElementById('check-in').value;
        const checkOut = document.getElementById('check-out').value;
        const totalCost = document.getElementById('total-cost').value;

        const summaryContent = `
            Booking Summary:
            Name: ${name}
            Number of Guests: ${guests}
            Check-in Date: ${checkIn}
            Check-out Date: ${checkOut}
            Total Cost: $${totalCost}
        `;

        const blob = new Blob([summaryContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'booking_summary.txt';
        link.textContent = 'Download Booking Summary';
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    }
});
