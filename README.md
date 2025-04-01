


# TogetherNow


## Overview
**BBY13-Comp1800.**  
Summarize your project's purpose, problem solved, key features, user benefits, development context, and main technologies used.

Example:

This client-side JavaScript web application provides real-time weather updates for cities worldwide. It simplifies accessing weather information through an intuitive mobile-first interface, allowing users to input a city name and receive data on temperature, humidity, and conditions.

Developed for the [Course Name] course, applying User-Centred Design practices, agile project management processes, integrating a weather API, and Firebase backend services.

---

## Features

Example:
- Real-time weather updates for any city.
- Responsive design for desktop and mobile.
- Displays temperature, humidity, and weather conditions.

---

## Technologies Used

Example:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase for hosting
- **Database**: Firestore
- **User_Auth**: Firebase authentication

---

## Usage

Example:
1. Input 'yarn run dev' in terminal under project root and visit `http://localhost:5173`.
2. Enter the name of the city in the search bar and press enter.
3. View the weather information displayed on the screen.

---

## Project Structure

1800_202510_BBY13/  
├── node_modules/  
├── public/           # Skeleton Pages (HTML, images, imports)  
    ├── dashboard_spare.html    # Template for dashboard
    ├── dashboard.html          # Personal dashboard where jobs can be created and myJobs are displayed
    ├── login_spare.html        # Template for login
    ├── profile.html            # Profile MainPage where user sees their info
    ├── readmore.html           # Page which expands on the job posting and where users can leave a comment
    ├── updateprofile.html      # Page where users can update any information or photo on their profile
    ├── webapp.html             # The main Job Posting Dashboard
    └── widget.html
├── src/             # Source code (JS, CSS)  
    ├── styles/         # Style Sheets (CSS)
        ├── dashboard.css       # Style sheet for the dashboard
        ├── login.css           # Style sheet for login page
        ├── main.css            # Style sheet for the main page
        ├── navbar.css          # Style sheet for the navbar (universal)
        ├── profile.css         # Style sheet for profile MainPage
        ├── profileupdate.css   # Style sheet for profile editing page
        ├── readmore.css        
        └── webapp.css          # Style sheet for the webapp page where job postings are displayed
│   ├── dashboard.js        # Javascript File for dashboard 
    ├── firebase.js         # Javascript file referncing firebase.js (universal)
    ├── index.js            # Check if page loaded
    ├── login.js            # Js file for Login page
    ├── loginUI_spare.js    # JS template for Login page
    ├── profile.js          # Js file responsible for displaying user profile data
    ├── profileupdate.js    # Js file responsible for updating user profile data
    ├── profileview.js      # Js file responsible for fetching user profile data
│   ├── readmore.js
    ├── sample-config.js    
│   └── webapp.js           # Js file for dashboard where jobs are posted
├── index.html       # Starting html File, site loads to this page
├── package.json 
├── cors.json        # to fix CORS error 
├── yarn.lock        # Launch via yarn
└── vite.config.js   # Vite configuration  

Within public/:           # Skeleton Pages (HTML, images, imports)  
├── images/         # Visuals (Images, SVG, Favicon)
    ├── aboutus.jpg             # Card #1
    ├── clipboard.svg           # Feature #1
    ├── controller.svg          # Unused SVG
    ├── default-avatar.svg      # Default avatar for users
    ├── hero.jpg                # Hero Background
    ├── javascript.svg          # Unused SVG
    ├── messages.svg            # Feature #3
    ├── moneyskill.svg          # Feature #2
    ├── test.jpg                # Unused SVG - Placeholder (old Hero)
    ├── theprocess.jpg          # Process Image
    ├── togethernow.png         # Logo - old    
    ├── togethernow.svg         # Logo - Current
    ├── vite.svg                # Unused SVG
    ├── whatwedo.jpg            # Card #3
    └── whywestarted.jpg        # Card #2
├── dashboard_spare.html    # Template for dashboard
├── dashboard.html          # Personal dashboard where jobs can be created and myJobs are displayed
├── login_spare.html        # Template for login
├── profile.html            # Profile MainPage where user sees their info
├── readmore.html           # Page which expands on the job posting and where users can leave a comment
├── updateprofile.html      # Page where users can update any information or photo on their profile
├── webapp.html             # The main Job Posting Dashboard
└── widget.html


Within src/:             # Source code (JS, CSS)  
├── styles/         # Style Sheets (CSS)
    ├── dashboard.css       # Style sheet for the dashboard
    ├── login.css           # Style sheet for login page
    ├── main.css            # Style sheet for the main page
    ├── navbar.css          # Style sheet for the navbar (universal)
    ├── profile.css         # Style sheet for profile MainPage
    ├── profileupdate.css   # Style sheet for profile editing page
    ├── readmore.css        
    └── webapp.css          # Style sheet for the webapp page where job postings are displayed
├── dashboard.js        # Javascript File for dashboard 
├── firebase.js         # Javascript file referncing firebase.js (universal)
├── index.js            # Check if page loaded
├── login.js            # Js file for Login page
├── loginUI_spare.js    # JS template for Login page
├── profile.js          # Js file responsible for displaying user profile data
├── profileupdate.js    # Js file responsible for updating user profile data
├── profileview.js      # Js file responsible for fetching user profile data
├── readmore.js
├── sample-config.js    
└── webapp.js           # Js file for dashboard where jobs are posted 

Within src/:  
├── mainPage.jsx         # Entry point  
├── App.jsx          # Main component  
├── styles/          # Folder for CSS files  
│   ├── main.css     # Global styles  
│   └── App.css      # Styles specific to App.jsx  
└── components/  
    ├── Button.jsx  
    └── Button.css   # Styles specific to Button component  

---

## Contributors-TEAM LLM
- **Livjot**, I'm so excited to be starting this project and learning coding! 
- **Larry** - sort of coding
- **May** is here!
---

## Acknowledgments

Example:
- Weather data sourced from [OpenWeatherMap](https://openweathermap.org/).
- Code snippets for ___ algoirthm were adapted from resources such as [Stack Overflow](https://stackoverflow.com/) and [MDN Web Docs](https://developer.mozilla.org/).
- Icons sourced from [FontAwesome](https://fontawesome.com/) and images from [Unsplash](https://unsplash.com/).

MainPage:
- Icons for mainpage from [Flaticon](https://www.flaticon.com/icon-fonts-most-downloaded?weight=bold&type=uicon).
- Logo sourced from [Flaticon](https://www.flaticon.com/free-icon/hug_7081266).
- Hero Image sourced from [VistingAngels](https://www.visitingangels.com/articles/outdoor-activities-for-seniors-caregivers/200)
- Process Image sourced from [AssistingHands](https://www.assistinghands-il-wi.com/blog/teach-senior-parents-to-use-technology/)
- About Us Card #1 sourced from [StockCake](https://stockcake.com/i/generational-handshake-outdoors_1449259_561774)
- About Us Card #2 sourced from [iStock](https://www.istockphoto.com/photo/senior-men-embracing-on-a-pool-party-gm1390899974-447704106)
- About Us Card #3 sourced from [liveinhomecare](https://www.liveinhomecare.com/helping-the-elderly-july-2021-2/helping-the-elderly/).
---

## Limitations and Future Work
### Limitations

- App allows users to create job postings and have a record of the jobs they've created.
- Limited to only adding a job title and description with giving other users the ability to comment.
- The job postings can be enhanced to include poster details, or a way to communicate.

### Future Work

Example: 
- Add poster profile which hrefs to their profile details.
- Create a dark mode for better usability in low-light conditions.

## License

Example:
This project is licensed under the MIT License. See the LICENSE file for details.




