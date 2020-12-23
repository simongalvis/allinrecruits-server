# All-In Recruits
- All-In Recruits is a recruiting tool made for a client that enables them to receive running applications from candidates interested in their job positions.

## Link to live app
- https://allinrecruits.vercel.app/

## Summary
- Job seekers can use All-In Recruits to quickly and simply upload their information including their name, number, email, interested position, and resume. 
- Administrators can see all of the submissions filtered by job position and conveniently browse through candidates that may be suited for job openings. Administrators can also delete submissions they are not interested in.

## Screenshots

- <b>Landing Page</b><br/>
![Application Page](/images/landing-page-screenshot.png)

- <b>Submissions Page</b><br/>
![Submissions Page](/images/applicant-list-screenshot.png)

- <b>Admin Dashboard</b><br/>
![Admin Dashboard](/images/admin-dashboard-screenshot.png)

- <b>Application Page</b><br/>
![Application Page](/images/application-page-screenshot.png)

- <b>Admin Login Page</b><br/>
![Application Page](/images/admin-login-screenshot.png)





## Built With
- React
- Nodejs
- Express
- SQL
- PostgreSQL
- CSS


## Features
- Upload information in exchange for potential job opportunities
- View submissions filtered by job position
- Log in to account and find previously posted submissions

## Author
- Simon Galvis

## Setup 
- Download this code and run ``` npm install ``` to install dependencies needed to run the server

- Run the server locally in developer mode using ``` npm run dev```

- Run the server regularly locally using ``` npm run```

- Get a list of submissions: ``` GET /api/submissions```

- Get a specific submission: ``` GET /api/submissions/submission_id```

- Post an admin: ``` POST /api/admins```

- Post a submission: ``` POST /api/submissions```