
# Table of Contents

1. [Changes](#changes)
2. [Stories](#stories)
3. [General Information about the project implementation](#general-information-about-the-project-implementation)
   1. [AUTH v.1.0](#auth-v10)
      
   2. [AUTH v.2.0](#auth-v20)
      1. [Strategy Description](#strategy-description)
   3. [SESSIONS](#sessions)
   4. [Database Structure](#database-structure)
         1. [STUDENTS](#students)
         2. [TEACHERS](#teachers)
         3. [CAREERS](#careers)
         4. [DEGREES](#degrees)
         5. [THESIS_PROPOSALS](#thesis-proposals)
   5. [Nofification System](#notification-system)
4. [Useful ideas and future development needs](#useful-ideas-and-future-development-needs)
   1. [Update get thesis proposals](#update-get-thesis-proposals)
5. [React Client Application Routes](#react-client-application-routes)
   1. [Main Component](#main-component)
6. [API Server](#api-server)
   1. [Template for API Description](#template-for-api-description)
7. [Testing](#testing)
8. [Implementation for Integration (OBSOLETE)](#implementation-for-integration-obsolete)
   1. [Commands](#commands)


### Changes

**we should put here the changes between the sprint**

*Sprint 1*:
- I don't remember

*Sprint 2*:
- SAML2 for authentication
- Automated E2E testing

*Sprint 3*:
- Notification System

### Stories

*put here A TABLE of stories committed with references to the sprint and story points*

# General Information about the project implementation

## AUTH v.1.0
(obsolete see AUTH 2.0 that follows)

The authentication it's realized with passport framework, email and password are stored in the database with encrypted passwords and randomly (but manually) generated salt for the time being, since there is no registration process yet.

The Credentials have been generated using https://www.browserling.com/tools/scrypt
and can be tested with its relative counterpart tool https://www.browserling.com/tools/scrypt-check

The login is performed with email and password, the system check if there is a related email in the *auth* table that has a correspondant hashed password, then, afther authentication succeds, fetch all the info of the user from the tables *student* or *teachers*, based on the role.


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

Starting from demo2 the application performs authentication using the SAML 2.0 protocol, this is conveniently realized trough passport but with a new strategy `passport-saml` and https://auth0.com/ as IDP.
The credential remain the same of AUTH 1.0.

```
passport.use(new SamlStrategy({
  entryPoint: 'https://group16-thesis-management-system.eu.auth0.com/samlp/7gZcQP3Nmz2ymU1iqYBKd1HwZRmb1D09',
  path: '/login/callback', //motherfucker
  issuer: 'passport-saml',
  cert: cert,
  acceptedClockSkewMs: 30000 // avoid syncerror Error: SAML assertion not yet valid
}, function (profile, done) {


  return done(null, //take from the Saml token the parameters so that will be available in req.user ffs
    {
      id: profile['nameID'],
      email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
      name: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
      lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
    });
}));

```
### Strategy Description

- In the main strategy we see parameters used by the strategy in this order:
  - `entryPoint` of auth0 for Saml2 protocol 
  - `callback` path, that is the api in which the login request return after performing authentication on the idp, here we have avaialable the SAML assertion
  -`issuer`, in this case the library itself that that the process
  - `certificate`, stored in the server, provided by the auth0 tenantsm used by the saml protocol
  - `acceptedClockSkews` this is an option for saml2 protocol to allow a little bit of gap in terms of time differences between our server clock and auth0's one.

- In the middleware we fetch some data from the response schema, this are used in the callback to perform a lookup in our local db, so we can finally initialize our expression session with all the data related to the user, that are not present in auth0.





### SESSIONS

The session is initialized with these user data.
```
student:
{
  id: 200001,
  surname: 'Rossi',
  name: 'Mario',
  role: 'student',
  email: 'mario.rossi@studenti.polito.it',
  gender: 'M',
  nationality: 'Italian',
  degree_code: 'LM-1',
  enrollment_year: '2010'
}

professor:
{
  id: 268554,
  surname: 'Bianchi',
  name: 'Luigi',
  role: 'teacher',
  email: 'luigi.bianchi@polito.it',
  group_code: 'SO',
  department_code: 'DAUIN'
}

```



## Database Structure

#### STUDENTS
| id  | surname  | name | gender | nationality | email | degree_code | enrollment_year
|---  |---    |---  |--- |--- |--- |--- |---
200001 | Rossi | Mario | M | Italian | <mario.rossi@studenti.polito.it> | LM-1 | 2010

#### TEACHERS
| id  | surname  | name | email | group_code | department_code
|---  |---    |---  |--- |--- |---
268553 | Rossi | Maria | <maria.rossi@polito.it> | AI | DAD

#### CAREERS
| student_id  | course_code  | course_title | cfu | garde | date_registered
|---  |---    |---  |--- |--- |---
200023 | 02PQRST | Physics | 19 | 30L | 20-10-2018

#### DEGREES
| degree_code | degree_title
|---  |---
LM-1 | Computer Engineering

#### THESIS_PROPOSALS
| id  | title  | supervisor | cosupervisors | keywords | type | groups | description | requirements | notes | expiration | level | cds
|---  |---    |---  |--- |--- |--- |--- |--- |--- |--- |--- |--- |---
0 | Sustainable Energy Sources Research | 268560 | 12345,67890 | Renewable Energy, Sustainability, Research | Assigned | Energy Research Group, Sustainability Research Group | Conduct research on sustainable energy sources and their impact on the environment. | Environmental Science, Renewable Energy, Data Analysis | This project aims to explore renewable energy sources and their environmental effects. | 15-11-24 | bachelor | LT-3


*If you need a tool to explore the DB, you can try 'DB Browser for SQLITE' for Windows Desktop*


### Notification System

Starting from demo3 the application implements a notification system by email. Since the users in the database are using fake emails but with a real domain `polito.it`, we couldn't use the aforementioned email to actual sending notification, instead, we use a single real `gmail.com` address for each type of user in which all the emails will be received and another account for the system to send the emails.

- `thesismanagementnoreply@gmail.com`: the address that the application uses to send emails.
- `thesismanagementstudent@gmail.com`: the address in which we receive the emails for any student.
- `thesismanagementteacher@gmail.com`: the address in which we receive the emails for any teacher.

The email server is realized using a popular js library for express, `nodemailer` and uses SMTP protocol along side the "Password App" authentication configured in the system google account.

The backend makes use of an internal method to build the email called `buildEmail`, this method **must** receive two mandatory parameters from the front end api:

- `type`: the type of notification that needs to send, for example "application", used in the switch case to decide how to body of the email and to which address will be sent.
- `subject`: the text to put in the subject of the email (usually easier to build in the front-end where all data are available)

- additional parameters received related to the email will be stored in a **Rest Parameter** `(...data)`, these are used in the switch case to build the text, like *"hello {studentname}"* .

**Notifications implemented:**

- DEMO 3: a notification is sent to the student when a professor takes a decision about his application.

## Useful ideas and future development needs
### Update get thesis proposals
Students need to get thesis proposals filtered by their course, and professors need to get only their own thesis proposals (so the ones containing the corresponding teacher id), so it might be a good idea to split the two apis into one since the filtering needs to be done on a different field. Tests need to be update accordingly.

## React Client Application Routes

- Route `/thesis`: main page with the list of thesis. Different views for students and teachers
- Route `/proposal`: page with the Form to create a new thesis proposal or edit an old one
- Route `/login`: to perform login
- Route `*`: for non existing pages
## Main Component
- `Thesis Proposal`: after login it receives trough the props *All USER DATA FROM THE SESSION*, based on the role, the component shows and behaves differently.
- `Proposal Form`: This form is used to create a new Proposal adding all the necesssary field. If instead the teacher wants to update an existing proposal is sufficient to pass the old proposal object to this component.
- `ThesisProposal`: This component is used to show the list of all the thesis proposals to an user. It has a Selector and a Select component that permits the user to write and get suggestions for the filtering process. By choosing which filters to apply the user can get the list of thesis that satisfy  his preferences.
- `ThesisPage`: This component is used to show to an user all the important data about a thesis proposal.  If the logged user is a professor there is only a go back button (for now, later we will add the fact that we can modify it only if he is the owner). If the logged user is a student he has two buttons, one for going back and one for applyng to that specific thesis.
- `Applications`: This component renders a table of thesis applications, dynamically adapting its display based on the user's role (teacher or student). It efficiently utilizes the ApplicationsTable component to provide a clean and intuitive interface for managing thesis applications within the application..


## API Server

## Template for API Desription

- POST `/api/sessions`
  - Description: request for login
  - Request body:
    - object {`username`,`password`}
  - Response: `200 OK` (success)
    - Response body:
      - object user {`id`,`username`,`name`}
  - Response: `401 Unauthorized`
    - response body:
      - {`error`:"Incorrect username or password"}

- DELETE `/api/sessions/current`
  - Description: Logout
  - Response: `200 OK` (success) : {}

- GET `/api/sessions/current`
  - Description: Verify if the current user is logged in.
  - Response: `200 OK` (success)
    - Response body: object user
  - Response: `401 Unauthorized`
    - response body {`error`:"Not authenticated"}

- POST `/api/newapplication`
  - Description: inserts a new application for a thesis proposal (student)
  - Request body: object containing the id of the student applying and the id of the thesis proposal and the id of the supervisorfor that thesis
    - object{`studentId`, `proposalId`,`teacherId`}
  - Response: `201 Created` (success), `500 Internal Server Error` (generic error)
  - Response body: number, indicating the number of applications inserted (should always be 1)

- GET `/api/proposals/:degreeCode`
  - Description: retrieves all the thesis proposals a student can view (based on student's degree code)
  - Request param: `degreeCode`, the degree of the study course of the student
  - Response: `200 OK` (success), `404 Not Found` (in case of no proposals found),  `500 Internal Server Error` (generic error)
  - Response body: an array of objects, each containing a thesis proposal
    - { `id`, `title`, `supervisor`, `cosupervisors`, `keywords`, `type`, `groups`, `description`, `requirements`, `notes`, `expiration`, `level`,
`cds` } 

- GET `/api/cosupervisors`
  - Description: retrieves all possible co-supervisors for a new thesis proposals 
  - Response: `200 OK` (success), `404 Not Found` (in case of no internal or external co-supervisors found),  `500 Internal Server Error` (generic error)
  - Response body: an object containing two lists of strings, one for internal co-supervisors (other professors), one for external co-supervisors (for example company employees cooperating with the university)
    - { `internals`: [...], `externals`: [...] } 

- GET `/api/degrees`
  - Description: retrieves all possible degrees a professore can insert a new thesis proposal for
  - Response: `200 OK` (success), `404 Not Found` (in case of no data found),  `500 Internal Server Error` (generic error)
  - Response body: an array containing all the possible degrees

- POST `/api/newproposal`
  - Description: inserts a new thesis proposal
  - Request body: an object describing the proposal to insert
    - { `id`, `title`, `supervisor`, `cosupervisors`, `keywords`, `type`, `groups`, `description`, `requirements`, `notes`, `expiration`, `level`,
`cds` } 
    - Notes: 
      - The server automatically finds the right groups for the proposal (based on the supervisor and internal co-supervisor's groups), so an empty array can be passed for the groups field
      - The id is generated automatically, so any number can be passed for the id field
  - Response: `201 Created` (success), `500 Internal Server Error ` (insertion error)
  - Response body: the id of the newly created proposal


- GET `/api/student/applications/:studentId`
  - Description: retrieves all the applications the student has sent (including status)
  - Request param: the id of the student currently logged in (should be retrieved from the session cookie)
  - Response: `200 OK` (success), `404 Not Found` (no applications found for the specific studentId), `500 Internal Server Error` (generic server error)
  - Response body: an array of objects, each describing an application
    - {`studentId`, `thesisId`, `timestamp`, `status`, `teacherId`}
    
    (Note: it will be an array even if the student only inserted one application)


- GET `/api/teacher/applications`
- Description: retrieves all the applications sent for proposals of the logged if professor
  - Response: `200 OK` (success), `404 Not Found` (in case of no data found),  `500 Internal Server Error` (generic error)
  - Response body: an array containing all the applications: each application also contains the object representing the application th thesis and student details to be shown in the fron end
  - "enhancedApplications": 
    - [
      {
        - "studentId": 200001,
        - "thesisId": 3,
        - "timestamp": "08/11/2023 16:42:50",
        - "status": "pending",
        - "teacherId": 268553,
        - **"studentInfo"**: { info taken from teacher table },
        - **"thesisInfo"**: { info taken from thesis table }
     },
      // ... more entries ...
    ]

- PUT `/api/teacher/applications/:id`
  - Description: update a row in the application table setting the status to accepted/rejected according to the received parameter. Also when an application is accepetd all the other applications of the same student and for the same thesis are canceled.
  - Request body: object containing the decision "accepted" or "rejected" and the id of the student sending the application
  - Response: `200 Created` (success), `500 Internal Server Error` (generic error),`422 parameter error` (argument error)
  - Response body: the updated application {id, status}

- PUT `/api/teacher/proposal/:thesisid`
  - Description: update a thesis Proposal by passing new values for the desired fields.
  - Request body: object containing the proposal with the new data and also the id of the proposal to update
  - Response: `200 Created` (success), `500 Internal Server Error` (generic error),`422 parameter error` (argument error)
  - Response body: the updated thesis proposal

- DELETE `/api/deleteproposal/:proposalid`
  - Description: Deletes a thesis proposal based on the provided `proposalid`. Requires teacher authentication, allowing only the supervisor of the proposal to delete it.
  - Request Parameters: `proposalid` which is the id of the proposal to be deleted.
  - Responses:
    - `200 OK`: Proposal successfully deleted.
    - `401 Unauthorized`: Requesting teacher is not the supervisor of the proposal.
    - `404 Not Found`: Proposal with the given id doesn't exist.
    - `422 Unprocessable Entity`: `proposalid` is not valid.
    - `500 Internal Server Error`: Generic server error.
  - Response Body: number of proposals deleted

  - POST `api/notify`
    - Request Parameters: `proposalid` which is the id of the proposal to be deleted.
  - Responses:
    - `200 OK`: Proposal successfully deleted.
    - `500 Internal Server Error`: Generic server error.
  - Response Body: json object `{success: boolean , message/error: string}`


### Testing

`Jest` is set up for unit testing as demo1, but for demo2 we opted for a different library for e2e, still based on Jest.

### Implemetation for Integration
(OBSOLETE)


- setup process.env.NODE_ENV as 'test' in the integration test file
- import the server, which will start listening on port 3001
- the db file will create/open an in-memory db and populate it with the exported db in `thesis-management-project/code/server/db_TM.sql`
- connection to the in-memory sqlite database before every test case (in the file) start execution
- after all test cases the db is closed, the server is closed.

>*IMPORTANT*: keep the `db_TM.sql` updated as the `cleanDB/db_TM.db` is updated

### Commands

This commands are executed only on test files under `thesis-management-project/code/server/tests` directory

- `npm test`: runs all test 
- `npm test:unit`: runs only unit tests with coverage
- `npm run test:integration`: obsolete, still present but integration test are no more mmeaningfull