if (typeof chrome !== "undefined") {
    async function getCurrentTabUrl() {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab.url;
    }
    async function getCurrentTabTitle() {
         // Query for the active tab in the current window
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // tabs[0] is the active tab in the current window
        let activeTab = tabs[0];
        let title = activeTab.title; // Title of the active tab

        // Do something with the title
        console.log("Title of the active tab is: " + title);
        const  jobTitle = document.getElementById('jobTitle');
      jobTitle.value= title;
        return title;
    });
      }
  

    function saveJobLink(title, url, formattedDate) {
        chrome.storage.sync.get({ jobLinks: [] }, (data) => {
          let jobLinks = data.jobLinks;
          // Check if the URL is already saved
          if (!jobLinks.some(jobLink => jobLink.url === url)) {

            let faviconUrl = `https://www.google.com/s2/favicons?domain=${url}`; // Get favicon using Google's favicon service
            jobLinks.push({ title, url, faviconUrl , formattedDate});
            chrome.storage.sync.set({ jobLinks: jobLinks });
          }
          viewBookmarks(data.jobLinks);
        });
      }
      function updateNumber(jobLinks){
        const TotalJobs= jobLinks.length;
        const TotalJlabel= document.getElementById("TotalJLabel");
        TotalJlabel.textContent="Total = " + TotalJobs;
      }
      function viewBookmarks(jobLinks) {
        
        const bookmarksElement = document.getElementById("bookmarks");
        bookmarksElement.innerHTML = ""; // Clear existing bookmarks
    
        if (jobLinks.length > 0) {
            jobLinks.forEach((link, index) => {
                // Create main card container
                const cardContainer = document.createElement("div");
                cardContainer.className = "card-container";
    
                // Create main content section
                const mainContent = document.createElement("main");
                mainContent.className = "main-content";

              
                
                // Create and append the title
                const title = document.createElement("h1");
                const titleLink = document.createElement("a");
                titleLink.href = link.url;
                titleLink.textContent = link.title; // Use the job link's title
                titleLink.target = "_blank"; // Opens link in a new tab
                title.appendChild(titleLink);
                mainContent.appendChild(title);
    
                // // Create and append the description paragraph
                // const description = document.createElement("p");
                // description.textContent = "Our Equilibrium collection promotes balance and calm.";
                // mainContent.appendChild(description);
    
                // Create flex row for additional info
                const flexRow = document.createElement("div");
                flexRow.className = "flex-row";
    
                // Create coin-base div
                const coinBase = document.createElement("div");
                coinBase.className = "coin-base";
                const coinImage = document.createElement("img");
                coinImage.src =link.faviconUrl;
                coinImage.className = "small-avatar";
                coinBase.appendChild(coinImage);
                
                flexRow.appendChild(coinBase);
               
                
                // Create time-left div
                const timeLeft = document.createElement("div");
                timeLeft.className = "time-left";
                const clockImage = document.createElement("img");
                clockImage.src = "https://i.postimg.cc/prpyV4mH/clock-selection-no-bg.png";
                clockImage.alt = "clock";
                clockImage.className = "small-image";
                timeLeft.appendChild(clockImage);
                const timeText = document.createElement("p");
                timeText.textContent = link.formattedDate;
                timeLeft.appendChild(timeText);
             
                // Append timeLeft to flexRow
                flexRow.appendChild(timeLeft);
    
                // Append flexRow to mainContent
                mainContent.appendChild(flexRow);
                const iconDiv = document.createElement("div");
                iconDiv.className="icon-div";
              
                const urlIcon = document.createElement("img");
                urlIcon.src = "/assets/copying.png"; // Path to your delete icon image
                urlIcon.alt = "Copy URL";
                urlIcon.className = "tiny-icon";
                
                // Add click event listener to the delete icon
                urlIcon.addEventListener('click', function() {
                    CopyUrlBookmark(link.url);
                });
                iconDiv.appendChild(urlIcon);



                const deleteIcon = document.createElement("img");
                deleteIcon.src = "/assets/delete.png"; // Path to your delete icon image
                deleteIcon.alt = "Delete";
                deleteIcon.className = "tiny-icon";
                
                // Add click event listener to the delete icon
                deleteIcon.addEventListener('click', function() {
                    deleteBookmark(index);
                });
                iconDiv.appendChild(deleteIcon);




                mainContent.appendChild(iconDiv);
                // Append mainContent to cardContainer
                cardContainer.appendChild(mainContent);
    
                // Append the card to the bookmarks element
                bookmarksElement.appendChild(cardContainer);
            });
        } else {
            bookmarksElement.innerHTML = '<i>No job links saved</i>';
        }
        updateNumber(jobLinks);
    }
    
    function CopyUrlBookmark(url) {
        const tempTextArea = document.createElement('textarea');
        // Set the value of the text area to the URL
        tempTextArea.value = url;
        // Append the text area to the body
        document.body.appendChild(tempTextArea);
        // Select the text within the text area
        tempTextArea.select();
        // Copy the selected text to the clipboard
        document.execCommand('copy');
        // Remove the temporary text area from the body
        document.body.removeChild(tempTextArea);
    
        // Optional: Display a message to the user indicating that the URL has been copied
        alert('URL copied to clipboard!');
      
    }


function deleteBookmark(index) {
    chrome.storage.sync.get({ jobLinks: [] }, (data) => {
        let jobLinks = data.jobLinks;

        if (index >= 0 && index < jobLinks.length) {
            jobLinks.splice(index, 1);

            chrome.storage.sync.set({ jobLinks: jobLinks }, () => {
                viewBookmarks(jobLinks);
            });
        } else {
            console.error("Invalid index for bookmark deletion.");
        }
    });
}
      function clearAllJobLinks() {
        chrome.storage.sync.set({ jobLinks: [] }, () => {
          viewBookmarks([]);
          
        });
      }
  
    // Event listener for the Add Job button
    document.addEventListener('DOMContentLoaded', () => {
        const currentDate = new Date();

        // Format the date as "Mon DD, YYYY"
        const formattedDate = currentDate.toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        });


      const addJobButton = document.getElementById('addJobButton');
      getCurrentTabTitle();
      const formLabel = document.querySelector('.c-form');

    
      if (addJobButton) {

      addJobButton.addEventListener('click', async () => {
        
        let url = await getCurrentTabUrl();
        let title = document.getElementById('jobTitle').value.trim();

        if (title) {
            if (formLabel) formLabel.style.height = '0';

          saveJobLink(title, url, formattedDate);
        } else {
          // Handle case when title is not provided
          console.log('Title is required');
        }

      });

    } else {
        console.log("Button not found");
    }
      const clearAllButton = document.getElementById('clearAllButton');
      clearAllButton.addEventListener('click', () => {

        clearAllJobLinks();
        
        if (formLabel) formLabel.style.height = '3.5em';

      });
      chrome.storage.sync.get({ jobLinks: [] }, (data) => {
        viewBookmarks(data.jobLinks);
      });
    });
  }
  