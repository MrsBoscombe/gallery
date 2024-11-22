// Main function to start updating the page content on load
function start() {
    loadContent(); // Load CSV content initially
    displayImages();    // Display all images
    checkDateChange(); // Start checking for daily updates
    updateTimeAndDate(); // update the date and time
}

// Function to load CSV data and update the page
function loadContent() {
    // Load main information CSV
    Papa.parse('./assets/documents/diman-tv-main-information.csv', {
        download: true, // Download for remote files
        complete: function(results) {
            updateInformation(results.data);
        }
    });

    // Load marquee information
    fetch('assets/documents/marquee.csv')
        .then(response => response.text())
        .then(data => updateMarquee(data))
        .catch(error => {
            console.error('Error loading marquee:', error);
            document.getElementById('marquee-text').innerText = 'Error loading marquee text.';
        });
}

// Function to update information based on CSV content
function updateInformation(data) {
    const today = new Date();
    const formattedToday = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

    // Look for today's date in the CSV and update relevant elements
    for (let row of data) {
        if (row[0] === formattedToday) {
            document.getElementById("schoolDay").textContent = row[2] || "";
            document.getElementById("schoolWeek").textContent = row[3] || "";

            // Update lunch options
            ["lunch1", "lunch2", "lunch3", "lunch4", "lunch5"].forEach((id, index) => {
                document.getElementById(id).textContent = row[4 + index] || "";
            });

            // Update day type
            const dayTypeMap = ['No School Today', '2:28PM Dismissal', '12:28PM Dismissal', '11:58AM Dismissal', '11:00AM Dismissal', "School Vacation"];
            document.getElementById("dayType").textContent = dayTypeMap[row[1]] || "Error retrieving day type";

            // Update events
            ["event1", "event2", "event3", "event4"].forEach((id, index) => {
                document.getElementById(id).textContent = row[9 + index] || "";
            });
            break;
        }
    }
}

// Function to update the marquee content from CSV
function updateMarquee(data) {
    const marqueeItems = data.split(',').map(item => item.replace(/['"]+/g, ''));
    const marquee = document.getElementById('marquee-text');
    marquee.innerHTML = ''; // Clear any existing text

    marqueeItems.forEach(item => {
        const span = document.createElement('span');
        span.innerText = item;
        span.style.marginRight = '500px'; // Adjust spacing as needed
        marquee.appendChild(span);
    });

    marquee.style.visibility = 'visible';
}
/*  
function displayImages-ReadFilesFromFolder() {
    const imageGallery = document.getElementById('imageGallery');
    const imageDir = './assets/images/gallery/';
    const delayInSeconds = 7;

    // Fetch the image filenames from PHP
    fetch('./php/getfilenames.php')
        .then(response => response.json())
        .then(fileNames => {
            if (!fileNames || fileNames.length === 0) {
                console.warn("No images found in the gallery folder.");
                return;
            }

            let currentIndex = 0;

            const changeImage = () => {
                imageGallery.style.transition = 'opacity 0.6s'; // Add transition effect
                imageGallery.style.opacity = 0; // Fade out

                setTimeout(() => {
                    imageGallery.src = `${imageDir}${fileNames[currentIndex]}`;
                    imageGallery.style.opacity = 1; // Fade in
                    currentIndex = (currentIndex + 1) % fileNames.length; // Loop through images
                }, 600); // Match the fade-out duration
            };

            // Initial image display
            imageGallery.src = `${imageDir}${fileNames[currentIndex]}`;
            currentIndex++;

            // Start the rotation
            setInterval(changeImage, delayInSeconds * 1000);
        })
        .catch(error => console.error("Error loading filenames:", error));
}
        */

/* This version loads the filenames from an internal file,
    which means we need to add any new ads to that file! */

function displayImages() {
    const imageGallery = document.getElementById('imageGallery');
    const imageDir = './assets/images/';
    const delayInSeconds = 7; // Total delay per image
    const fadeDuration = 600; // Transition duration in milliseconds (0.6s)

    // Fetch and parse the text file
    fetch('./assets/documents/galleryImageList.txt')
        .then(response => response.text())
        .then(text => {
            const fileNames = text.split('\n').filter(line => line.trim() !== ''); // Split by line and remove empty lines

            if (fileNames.length === 0) {
                console.warn("No images found in the gallery list.");
                return;
            }

            let currentIndex = 0;

            const changeImage = () => {
                // Fade out
                imageGallery.style.transition = `opacity ${fadeDuration / 1000}s`;
                imageGallery.style.opacity = 0;

                setTimeout(() => {
                    // Change image after fade-out
                    imageGallery.src = `${imageDir}${fileNames[currentIndex]}`;

                    // Fade in
                    imageGallery.style.opacity = 1;

                    // Update index for the next image
                    currentIndex = (currentIndex + 1) % fileNames.length;
                }, fadeDuration);
            };

            // Initial image display without transition
            imageGallery.src = `${imageDir}${fileNames[currentIndex]}`;
            currentIndex++;

            // Start rotation
            setInterval(changeImage, delayInSeconds * 1000);
        })
        .catch(error => console.error("Error loading gallery list:", error));
}
  
//}




// Function to display a single static image
/*function displayImage() {
    const imageElement = document.getElementById("imageGallery");
    imageElement.src = "./assets/images/gallery/000-DimanLogo.webp"; // Set the image path
    imageElement.alt = "Diman Logo"; // Set alt text for accessibility
}*/


// Display the current time
function currentTime() {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedTime = currentTime.replace(/^0/, ''); // Remove leading zero
    
    let time = document.getElementById("time");
    time.textContent = formattedTime;
  }
  
function currentDate(){
    //📅 Date 
    let currentDate = new Date();
    let options = { weekday: 'short', month: 'long', day: 'numeric' };
    let formattedDate = currentDate.toLocaleDateString(navigator.language, options);
  
    let date = document.getElementById("date");
    date.textContent = formattedDate;
  
    console.log(formattedDate); // Example output: "Fri, June 14"
}

// Function to update time and date elements on the page
function updateTimeAndDate() {
    // Update time every minute
    currentTime();

    // Update date every minute (or whenever it changes)
    currentDate();

    setInterval(updateTimeAndDate, 60000);
}


// Check for date change every minute and reload content if the date has changed
function checkDateChange() {
    let currentDate = new Date().toDateString(); // Track current date as a string

    setInterval(() => {
        const newDate = new Date().toDateString();
        if (newDate !== currentDate) {
            currentDate = newDate; // Update to the new date
            loadContent(); // Reload the CSV data to refresh content
        }
    }, 600000); // Check every 600 seconds (10 minutes)
}

// Initialize content on page load
window.onload = start;
