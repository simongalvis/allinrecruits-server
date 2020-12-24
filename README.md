# All-In Recruits
- All-In Recruits is a recruiting tool made for a client that enables them to receive running applications from candidates interested in their job positions.

## Link to live app
- https://allinrecruits.vercel.app/

## Summary
- The All-In Recruits API allows applicant users to make POST requests to upload application submissions. Admin users can retieve and delete applicant submissions with GET and DELETE requests.

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

## Endpoint documentation
- ``` POST /api/submissions ```: Uploads a user submission given a json request body including ```"fullname", "phonenumber", "email", "interestedposition", "resumelink"``

-  ``` GET /api/submissions ```: Retrieves a list of submissions made by users via the ``` POST /api/submissions``` endpoint

- ``` GET /api/submissions/submission_id ```: Retrieves a specific user submission given the id of the submission as a parameter, which is represented by the ````submission_id``` parameter

- ```DELETE /api/submissions/submission_id ```: Deletes a specific user submission given the id of the submission as a parameter, which is represented by the ````submission_id``` parameter

- ``` POST /api/admins ```: Creates a new admin user who is able to login and access applicant submissions

- ``` POST /api/admins/login ```: Verifies login information entered by a user making an attempt to login as an administrator

### Endpoint inputs
- ``` POST /api/submissions```: Uploads a user submission given a json request body. Example request body: <br/>
```yaml
   { 
        "fullname": "Wendell Yates",
        "phonenumber": "1234567890",
        "email": "sample@email.com",
        "interestedposition": "Art instructor",
        "resumelink": "http://sampleresume.com"
    }
```
- ``` POST /api/admins```: Creates a new admin user with a JSON request body. Example request body:<br/>
```yaml
    {
        "fullname": "Ellie Admin",
        "username": "ellieadmin",
        "password": "ellieAdminPassword27"
    }
```

- ``` POST /api/admins/login ```: Verifies admin credentials with a JSON request body. Example request body:<br/>
```yaml
    {
        "username": "ellieadmin",
        "password": "ellieAdminPassword27"
    }
```

- ``` submission_id ```: parameter used to make GET and DELETE requests based on a submission id present in the database. Example uses:<br/>
``` GET /api/submissions/1 ```
``` DELETE /api/submissions/2 ```




