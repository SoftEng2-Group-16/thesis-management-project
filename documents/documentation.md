
# Table of Contents

- [Table of Contents](#table-of-contents)
    - [Changes](#changes)
    - [Stories](#stories)
- [General Information about the project implementation](#general-information-about-the-project-implementation)
  - [AUTH v.1.0](#auth-v10)
  - [AUTH v.2.0](#auth-v20)
    - [Description](#description)
    - [SESSIONS](#sessions)
  - [Database Structure](#database-structure)
    - [Example rows (one for each table)](#example-rows-one-for-each-table)
      - [STUDENTS](#students)
      - [TEACHERS](#teachers)
      - [CAREERS](#careers)
      - [DEGREES](#degrees)
      - [THESIS\_PROPOSALS](#thesis_proposals)
    - [Notification System](#notification-system)
  - [Useful ideas and future development needs](#useful-ideas-and-future-development-needs)
  - [React Client Application Routes](#react-client-application-routes)
  - [Main Component](#main-component)
  - [API Server](#api-server)
    - [API Description](#api-description)
    - [Session APIs:](#session-apis)
    - [Proposals APIs:](#proposals-apis)
    - [Applications APIs:](#applications-apis)
    - [General and utils APIs:](#general-and-utils-apis)
  - [Testing](#testing)
    - [Commands](#commands)


### Changes

**we should put here the changes between the sprint**

*Sprint 1*:
- Beginning of development

*Sprint 2*:
- SAML2 for authentication
- Automated E2E testing

*Sprint 3*:
- Notification System

### Stories

*put here A TABLE of stories committed with references to the sprint and story points*

# General Information about the project implementation

## AUTH v.1.0
(**NOTE**: it's obsolete)

The authentication is realized with Passport framework, email and password are stored in the database with encrypted passwords and randomly (but manually) generated salt for the time being, since there are no specific requirements for the first sprint.

Credentials have been generated using https://www.browserling.com/tools/scrypt
and can be tested with its relative counterpart tool https://www.browserling.com/tools/scrypt-check

The login is performed with email and password, with a local strategy. The system checks if there is a related email in the *auth* table that has a correspondant hashed password, then, if authentication succeds, fetches all the info of the user from the tables *student* or *teachers*, based on the role.


|   Email                     |   Password    |   Role   |
|-----------------------------|---------------|---------|
| mario.rossi@studenti.polito.it       | 200001        | student |
| maria.bianchi@studenti.polito.it     | 200002        | student |
| luigi.ferrari@studenti.polito.it     | 200003        | student |
| giulia.russo@studenti.polito.it      | 200004        | student |
| maria.rossi@polito.it       | 268553        | teacher |
| luigi.bianchi@polito.it     | 268554        | teacher |
| giovanna.ferrari@polito.it  | 268555        | teacher |
| antonio.russo@polito.it     | 268556        | teacher |

## AUTH v.2.0

Starting from demo2 (1st release) the application performs authentication using the SAML 2.0 protocol, this is conveniently realized through Passport but with a new strategy `passport-saml` and https://auth0.com/ as IDP.
The credential remain the same of AUTH 1.0.

```js
passport.use(new SamlStrategy({
  entryPoint: 'https://group16-thesis-management-system.eu.auth0.com/samlp/7gZcQP3Nmz2ymU1iqYBKd1HwZRmb1D09',
  path: '/login/callback',
  issuer: 'passport-saml',
  cert: cert,
  acceptedClockSkewMs: -1 // avoid syncerror Error: SAML assertion not yet valid
}, function (profile, done) {
  return done(null, {//take from the Saml token the parameters so that will be available in req.user 
      id: profile['nameID'],
      email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
      name: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
      lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
    });
}));

```
### Description
- Parameters we need to provide:
  - `entryPoint` of the Auth0 tenant 
  - `path`, where we need to be redirected (on our server) after performing authentication on the IDP; here, the SAML assertion (result of authentication) is avaliable to determine if login was successful or not
  - `issuer`, who's managing the authentication, in this case the `passport-saml` library
  - `certificate`, stored in the server, provided by the Auth0 tenant during the set up phase
  - `acceptedClockSkews` this is an option for SAML2.0 protocol to allow a little bit of gap in terms of time differences between our server clock and Auth0's one.

- In the middleware, after interrogating the IDP, we fetch some data based on the response and use it in the callback to perform a lookup in our local db, so we can finally initialize our Express session with all the data related to the current user.


### SESSIONS

The session is initialized with these user data.
```json
student: {
  id: 200001,
  surname: "Rossi",
  name: "Mario",
  role: "student",
  email: "mario.rossi@studenti.polito.it",
  gender: "M",
  nationality: "Italian",
  degree_code: "LM-1",
  enrollment_year: "2010"
}

professor: {
  id: 268554,
  surname: "Bianchi",
  name: "Luigi",
  role: "teacher",
  email: "luigi.bianchi@polito.it",
  group_code: "SO",
  department_code: "DAUIN"
}

```


## Database Structure
### Example rows (one for each table)

##### APPLICATIONS

| thesisid | studentid | timestamp | status | teacherid | cv_id 
|---  |--- | ---- | --- | ---- | --- 
| 0 | 200001 | 13/01/2024 11:10:12 | pending | 268555 |	1

#### ARCHIVED_THESIS_PROPOSALS
*Note: it has the same structure of the table thesis_proposals, it's used to store archived proposals*
| id  | title  | supervisor | cosupervisors | keywords | type | groups | description | requirements | notes | expiration | level | cds
|---  |---    |---  |--- |--- |--- |--- |--- |--- |--- |--- |--- |---
0 | Sustainable Energy Sources Research | 268560 | 12345,67890 | Renewable Energy, Sustainability, Research | Assigned | Energy Research Group, Sustainability Research Group | Conduct research on sustainable energy sources and their impact on the environment. | Environmental Science, Renewable Energy, Data Analysis | This project aims to explore renewable energy sources and their environmental effects. | 15-11-24 | bachelor | LT-3

#### AUTH 
*Note: obsolete, was used for authentication when SAML2.0 wasn't implemented*
| id | email| role | password | salt |
|--- |---   |---   |---       |---   |
| 200001 | mario.rossi@studenti.polito.it |student | 78a9b43f33c457b3f12446c7cc4ab6150498ad85c832ec81321ade572350aedfe5903e2cd6252db2b154a747d3a6c2e60a1db3f4578c1f53ccdc96fafcbd9df5 | e8a1ea50eeaaa38f

#### CAREERS
| student_id  | course_code  | course_title | cfu | garde | date_registered
|---  |---    |---  |--- |--- |---
200023 | 02PQRST | Physics | 19 | 30L | 20-10-2018

#### CV_APPLICATION
| cv_id | list_exams | file_name | file_content |
| ---  | --- | --- | --- |
| 1 |	[{"studentId":200001,"courseCode":"01ABCDE","courseTitle":"Computer Science","cfu":10,"grade":"20","date":"02-03-2020"},{"studentId":200001,"courseCode":"02PQRST","courseTitle":"Physics","cfu":6,"grade":"30L","date":"20-10-2018"},{"studentId":200001,"courseCode":"02UVWXY","courseTitle":"Geometry","cfu":10,"grade":"28","date":"18-07-2022"}]|	PDIS.pdf |	BLOB |

#### DEGREES
| degree_code | degree_title
|---  |---
LM-1 | Computer Engineering

#### EXTERNAL_COSUPERVISORS
| id | name | surname | company | email |
|--- |---   |---      |---      |---    |
| 1 | Marco | Rossi | Reply |  marco.rossi@reply.com |

#### STUDENTS
| id  | surname  | name | gender | nationality | email | degree_code | enrollment_year
|---  |---    |---  |--- |--- |--- |--- |---
200001 | Rossi | Mario | M | Italian | <mario.rossi@studenti.polito.it> | LM-1 | 2010

#### TEACHERS
| id  | surname  | name | email | group_code | department_code
|---  |---    |---  |--- |--- |---
268553 | Rossi | Maria | <maria.rossi@polito.it> | AI | DAD


#### THESIS_PROPOSALS
| id  | title  | supervisor | cosupervisors | keywords | type | groups | description | requirements | notes | expiration | level | cds
|---  |---    |---  |--- |--- |--- |--- |--- |--- |--- |--- |--- |---
0 | Sustainable Energy Sources Research | 268560 | 12345,67890 | Renewable Energy, Sustainability, Research | Assigned | Energy Research Group, Sustainability Research Group | Conduct research on sustainable energy sources and their impact on the environment. | Environmental Science, Renewable Energy, Data Analysis | This project aims to explore renewable energy sources and their environmental effects. | 15-11-24 | bachelor | LT-3


#### THESIS_START_REQUEST
| id | timestamp | status | thesis_title | supervisor | cosupervisors | thesis_description | studentid 
|---  |--- | ---- | --- | ---- | --- | ---- | ---
| 1 | 15/01/2024 14:39:46 | created | AI-Driven Healthcare Solutions | 268553, Maria Rossi | Luigi Bianchi, 268554, DAUIN | Develop AI-powered healthcare solutions for diagnosing diseases. | 200001 |

#### VC_DATE
| date | id |
|---   |--- |
| 11/12/2024 | 0 |

*If you need a tool to explore the DB, you can try 'DB Browser for SQLITE' for Windows Desktop*


### Notification System

Starting from demo3 the application, implements a notification system by email. Since the users in the database are using fake emails but with a real domain `polito.it`, we couldn't use the aforementioned email to actual sending notification, instead, we use a single real `gmail.com` address for each type of user in which all the emails will be received and another account for the system to send the emails.

- `thesismanagementnoreply@gmail.com`: the address that the application uses to send emails.
- `thesismanagementstudent@gmail.com`: the address in which we receive the emails for any student.
- `thesismanagementteacher@gmail.com`: the address in which we receive the emails for any teacher.

The email system is realized using a popular js library for Express, `nodemailer` and uses SMTP protocol along side the "Password App" authentication configured in the Google account settings (for the no-reply account).

The backend makes use of an internal method to build the email called `buildEmail`, this method **must** receive two mandatory parameters from the front end api:

- `type`: the type of notification that needs to send, used to decide how the body of the email will be like and who to send the notification to.
- `subject`: the text to put in the subject of the email (usually easier to build in the front-end where all data is available)

- additional parameters received related to the email will be stored in a **Rest Parameter** `(...data)`, these are used to build the final email content.

**Notifications implemented:**

- DEMO 3: a notification is sent to the student when a professor takes a decision about his application.

## Useful ideas and future development needs
None yet...

## React Client Application Routes

- Route `/thesis`: main page with the list of thesis. Different views for students and teachers
- Route `/proposal`: page with the Form to create a new thesis proposal or edit an old one
- Route `/login`: to perform login
- Route `/thesisRequest`: page with the form for the student to create a new thesis start request
- Route `*`: for non existing pages

## Main Component
- `Thesis Proposal`: after login it receives trough the props *All USER DATA FROM THE SESSION*, based on the role, the component shows and behaves differently.
- `Proposal Form`: This form is used to create a new Proposal adding all the necesssary field. If instead the teacher wants to update an existing proposal is sufficient to pass the old proposal object to this component.
- `ThesisProposal`: This component is used to show the list of all the thesis proposals to an user. It has a Selector and a Select component that permits the user to write and get suggestions for the filtering process. By choosing which filters to apply the user can get the list of thesis that satisfy  his preferences.
- `ThesisPage`: This component is used to show to an user all the important data about a thesis proposal.  If the logged user is a professor there is only a go back button (for now, later we will add the fact that we can modify it only if he is the owner). If the logged user is a student he has two buttons, one for going back and one for applyng to that specific thesis.
- `Applications`: This component renders a table of thesis applications, dynamically adapting its display based on the user's role (teacher or student). It efficiently utilizes the ApplicationsTable component to provide a clean and intuitive interface for managing thesis applications within the application..
- `ThesisRequest`: This form is used by the student to create a new thesis start request after discussing with a teacher. The collected datas are: the title of the thesis, its description, the supervisor and optionally a list of cosupervisors.

## API Server

### API Description

### Session APIs:
- POST `/api/sessions`
  - Description: request for login
  - Request body:
    - object {`username`,`password`}
  - Response: `200 OK` (success)
  - Response body:
    - object user {`id`,`username`,`name`}
  - Response: `401 Unauthorized`
  - Response body:
    - {`error`:"Incorrect username or password"}

- DELETE `/api/sessions/current`
  - Description: Logout
  - Response: `200 OK` (success)

- GET `/api/sessions/current`
  - Description: Verify if the current user is logged in.
  - Response: `200 OK` (success)
    - Response body: user object
  - Response: `401 Unauthorized`
    - response body {`error`:"Not authenticated"}

### Proposals APIs:
- POST `/api/newproposal`
  - Description: inserts a new thesis proposal
  - Request body: an object describing the proposal to insert
    - { `id`, `title`, `supervisor`, `cosupervisors`, `keywords`, `type`, `groups`, `description`, `requirements`, `notes`, `expiration`, `level`,
`cds` } 
  - Notes: 
    - The server automatically finds the right groups for the proposal (based on the supervisor and internal co-supervisor's groups), so an empty array can be passed for the groups field
    - The id is generated automatically, so any number can be passed for the id field
  - Response: `201 Created` (success), `500 Internal Server Error ` (insertion error)
  - Response body: the `id` of the newly created proposal

- GET `/api/thesis/student`
  - Description: retrieves all the thesis proposals the currently logged student can view
  - Response: `200 OK` (success), `404 Not Found` (in case of no proposals found),  `500 Internal Server Error` (generic error)
  - Response body: an array of objects, each containing a thesis proposal
    - { `id`, `title`, `supervisor`, `cosupervisors`, `keywords`, `type`, `groups`, `description`, `requirements`, `notes`, `expiration`, `level`,
`cds` }

- GET `/api/thesis/teacher`
  - Description: retrieves all the active thesis proposals for the currently logged teacher
  - Response: `200 OK` (success), `404 Not Found` (in case of no proposals found),  `500 Internal Server Error` (generic error)
  - Response body: an array of objects, each containing a thesis proposal
    - { `id`, `title`, `supervisor`, `cosupervisors`, `keywords`, `type`, `groups`, `description`, `requirements`, `notes`, `expiration`, `level`,
`cds` }

- PUT `/api/teacher/proposal/:thesisid`
  - Description: update a thesis Proposal by passing new values for the desired fields.
  - Request body: object containing the proposal with the new data and also the id of the proposal to update
  - Response: `200 Created` (success), `500 Internal Server Error` (generic error),`422 parameter error` (argument error)
  - Response body: the updated thesis proposal

- DELETE `/api/teacher/deleteproposal/:proposalid`
  - Description: Deletes a thesis proposal based on the provided `proposalid`. Requires teacher authentication, allowing only the supervisor of the proposal to delete it.
  - Request Parameters: `proposalid` which is the id of the proposal to be deleted.
  - Responses:
    - `200 OK`: Proposal successfully deleted.
    - `401 Unauthorized`: Requesting teacher is not the supervisor of the proposal.
    - `404 Not Found`: Proposal with the given id doesn't exist.
    - `422 Unprocessable Entity`: `proposalid` is not valid.
    - `500 Internal Server Error`: Generic server error.
  - Response Body: number of proposals deleted

- GET `/api/cosupervisors`
  - Description: retrieves all possible co-supervisors for a new thesis proposals 
  - Response: `200 OK` (success), `404 Not Found` (in case of no internal or external co-supervisors found),  `500 Internal Server Error` (generic error)
  - Response body: an object containing two lists of strings, one for internal co-supervisors (other professors), one for external co-supervisors (for example company employees cooperating with the university)
    - { `internals`: [...], `externals`: [...] } 

- GET `/api/degrees`
  - Description: retrieves all possible degrees a professore can insert a new thesis proposal for
  - Response: `200 OK` (success), `404 Not Found` (in case of no data found),  `500 Internal Server Error` (generic error)
  - Response body: an array containing all the possible degrees


### Applications APIs:
- POST `/api/newapplication`
  - Description: inserts a new application for a thesis proposal (student)
  - Request body: object containing the id of the student applying and the id of the thesis proposal and the id of the supervisorfor that thesis
    - object{`studentId`, `proposalId`,`teacherId`}
  - Response: `201 Created` (success), `500 Internal Server Error` (generic error)
  - Response body: number, indicating the number of applications inserted (should always be 1)


- GET `/api/student/applications/`
  - Description: retrieves all the applications the currently logged student has sent (including status)
  - Response: `200 OK` (success), `404 Not Found` (no applications found for the specific studentId), `500 Internal Server Error` (generic server error)
  - Response body: an array of objects, each describing an application
    - {`studentId`, `thesisId`, `timestamp`, `status`, `teacherId`}
      
    (Note: it will be an array even if the student only inserted one application)

- GET `/api/teacher/applications`
  - Description: retrieves all the applications sent for proposals belonging to the logged professor
  - Response: `200 OK` (success), `404 Not Found` (in case of no data found),  `500 Internal Server Error` (generic error)
  - Response body: an array containing all the applications: each application also contains the object representing the application th thesis and student details to be shown in the fron end
  - "enhancedApplications": 
    - [ { `studentId`, `thesisId`, `timestamp`, `status`, `teacherId`, `{studentInfo}`, `{thesisInfo}` }, ...]

- PUT `/api/teacher/applications/:thesisid`
  - Description: update a row in the application table setting the status to accepted/rejected according to the value received in the body. Also when an application is accepetd all the other applications of the same student and for the same thesis are canceled.
  - Request param: the id of the proposal the application refers to
  - Request body: object containing the decision "accepted" or "rejected" and the id of the student sending the application
  - Response: `200 Created` (success), `500 Internal Server Error` (generic error),`422 parameter error` (argument error)
  - Response body: the updated application {id, status}

- PUT `/api/teacher/archiveproposal`
  - Description: archives a thesis proposal by moving it from the active to the archived table and cancelling all the related pending applications.
  - Request body: object containing the id of the proposal to archive; it also uses the id of the currently logged teacher (retrieved from the session cookie).
  - Response: `200 OK` (success), `404 Not Found` (no proposal found), `500 Internal Server Error` (generic server error), `401 Unauthorized` (if a professor tries to delete a proposal not owned, should not happen from the client), `422 Unprocessable Content` (happens when trying to archive a proposal which already has an accepted application, should not happen from the client)
  - Response body: the number of archived proposals (should always be 1)

- GET `/api/cv/:id/download`
  - Description: downloads the cv file present on the cv_application table
  - Request param: the id of the cv application
  - Response: `200 OK` (success), `404 Not Found` (no cv application found), `500 Internal Server Error` (generic server error)
  - Response body: the url to download the file

### Thesis start request APIs:
- POST `/api/newstartrequest`
  - Description: used by a student to send a new thesis start request to the secretary
  - Request body: an object containing info about the selected thesis
    - {`thesisTitle`, `supervisor`, `cosupervisors`, `thesisDescription`}
  - Response: `201 Created` (success), `500 Internal Server Error` (generic error), `422 Unprocessable Content`(body doesn't contain all the necessary info)
  - Response body: the id of the last tuple created in the DB


### General and utils APIs:
- POST `/api/notify`
  - Description: used to build the email notification (with the internal function `buildEmail`) and send it
  - Request body: an object containing the details of the email to be sent and useful params to build it
    - {`subject`, `type`, `data`}
  - Response: `200 OK` (if message sent succesfully), `500 Internal Server Error` (if something goes wrong)
  - Response body: an object containing a boolean describing success or failure, and the corresponding message
    - {`success`, `message`}

- POST `/api/clockchanged`
  - Description: used to manage proposals and applications, based on changes on the virtual date (which is also stored in the DB for sanity and persistance)
  - Request body: the selected date from the client
  - Response: `200 OK` (success), `500 Internal Server Error` (failure)
  - Response body: the number of moved proposals (from both tables, active and archived)

- GET `/api/initialdate`
  - Description: fetches the last date used from the virtual clock system
  - Response: `200 OK` (success), `500 Internal Server Error` (failure)
  - Response body: a string containing the system date
  


## Testing

`Jest` is the library chosen and set up for unit testing since demo1. 

From demo2 on, we opted for `Puppeteer`, a library based on Jest, to automate E2E tests.

### Commands

This commands are executed only on test files under `thesis-management-project/code/server/tests` directory

- `npm test`: runs all test 
- `npm test:unit`: runs only unit tests with coverage
- `npm test:spec`: runs the e2e tests with coverage. For e2e is suggested to run each test singularly with the command `npm test ` + the name of the .spec file. For now we have 3 spec files. One for the student were we try only student stories, one for the professoe were we do the same, and one called user, were we test stories that need some sort of interactions between users.