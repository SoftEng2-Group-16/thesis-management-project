## SUMMARY 



## AUTH v.1.0

The authentication it's realized with passport framework, username and password are stored in the database with encrypted passwords and randomly (but manually) generated salt for the time being, since there is no registration process yet.

The Credentials have been generated using https://www.browserling.com/tools/scrypt
and can be tested with its relative counterpart tool https://www.browserling.com/tools/scrypt-check


| username  | password    | role   |
|---        |---          |---|
|  GGeppetto |  password1 |  office_manager |
|  LVenigni |  password2 | system_manager  |
|  FGatto    |  password3 | employee  |
| MRossi | password3 | employee  |
| LVerdi | password3 | employee  |

### SESSIONS

The session is currently initialized with all the data related to the user that is been serialized.
```
{
  id: 1,
  firstname: 'Giuseppe',
  lastname: 'Geppetto',
  counter: null,
  username: 'GGeppetto',
  password: '953192f7f990e0bd0eb45e79383eb6dd5e053ff3e815c470b1fe8683f66962aaf6b438beb02230a7ea1cb22176bdd4c4b8e70764d7adf56f582f0e071dd779c8',
  salt: 'e8a1ea50eeaaa38f',
  role: 'officer'
}
```

This is **WRONG** and needs to be fixed, the serialization should not invlude sensitive information, but only name surname username and role.

## Database Structure

COUNTERS
| id  | services  | service_time
|---        |---  |---
1     | shipping,booking | t1
2     | account   | t2
3     | shipping,account |t3

The services field is a string, we need a function to transform the json to a string 
Service_time is the avarage time for the service, to use in the formula

SERVICES
| id  | type   | desciption
|---        |--- | ---
1     | account | info
2     | shipping | info
3     | booking | info

TICKETS
| id |counterId | ts_created | ts_finished | service_type | employeeid |status
|---        |--- | --- |--- |--- |--- |---


status is pending if there is no counter available for the requested service and so the customer is in the queue, is also pending during the time he is being served.
A first update is done when the system assign the counter and the employeeid.
A final update is done once the customer has been served updating the ts_finished and putting the status to Closed


*If you need a tool to explore the DB, you can try 'DB Browser for SQLITE' for Windows Desktop*


## Useful ideas and future development needs

**Note by LFMV: I removed the constraint NOTNULL on the field Counter (External Key) since only the 'employee' user are bound with counters**

**Idea for the main board**: we should add another possible state for the ticket (passing from `pending`/`closed` to something like `opened`/`assigned`/`closed`). In this way:
  - When the ticket is created, the default status is `opened` (need to modify the opening API)
  - When the ticket is assigned to an employee/counter, the status goes to `assigned` (need to modify the assign ticket API)
  - When the ticket is finished, the status goes to `closed` (need to modify the close ticket API)
  - To populate the board on the homepage, we simply need to add a GET API which provides all the rows in the ticket table  with the status set to assigned (should be as many as the number of counters, maybe less if a counter has closed its last ticket and is waiting to call the next customer, **never** more)

## API Server

## User
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

- PUT: `/api/closeticket/:ticketId`
  - Description: closes the ticket when the customer is served (change ticket status to closed and adds closing timestamp)
  - Response: `200 OK` (success)
    - Response body:  contains the number of changes made (should be 1, just one row is updated)
  - Response: `500 Internal Server Error` (failure) when an error is encountered

- PUT: `/api/assignticket/:ticketId`
  - Description: updates the ticket selected from the queue with the counterId and the employeeId
  - Request body: object containing counterId and employeeId to assign the ticket to -> {`counterId`, `employeeId`}
  - Response: `200 OK` (success)
    - Response body:  contains the number of changes made (should be 1, just one row is updated)
  - Response: `500 Internal Server Error` (failure) when an error is encountered
  
- GET: `/api/nextcustomer/:counterId`
  - Description: gets next ticket to serve, picking it from the queue of services performed by the counter with the given id
  - Response: `200 OK` (success)
    - Response body: contains the selected ticket -> {`id`, `counterId`, `timestampCreated`, `timestampFinished`, `serviceType`, `employeeId`, `status`}

      Note: `timestampFinished`, `counterId` and `employeeId` will be empty or null since the ticket has not been assigned yet, only fetched; ticketStatus will be set to `pending` since the ticket has yet to be served.
  - Response: `404 Not found` (failure), retuned if retrieval of tickets in queue or if retrieval of services for the counter fails

    Note: could also mean empty queue! Needs to be tested more comprehensively
  - Response: `500 Internal Server Error` (failure), general server error 


## Customer
- GET `/api/services`
  - Description: get the list of services
  - Response: `200 OK` (success)
    - Response body: list of Service object 
  - Response: `404 Not Found`
    - response body {"error":"No service found"}

- POST `/api/ticket`
  - Description: choose a service type and add the ticket to the table without specifing the counterId and employeeId
  - Response: `200 OK` (success)
    - Response body: id of the ticket has been created
  - Response: `503 Service Unavailable`
    - response body {"error":"Database error during the creation of new reservation"}

- DELETE `/api/tickets/:id`
  - Description: remove from the table the ticket with the specified ticket id
  - Response: `200 OK` (success)
    - Response body: number of deleted rows, always 1
  - Response: `503 Service Unavailable`
     - response body {"error":"Database error during the delete of ticket",id}

## Utility functions
### `getJson(httpResponsePromise)`
- **Description**: A utility function for parsing HTTP responses.
- **Parameters**:
  - `httpResponsePromise` (Promise) - A promise representing the HTTP response.

- **Returns**:
  - A Promise that resolves with the parsed JSON response or rejects with an error message.

- **Behavior**:
  - If the HTTP response is successful parse the JSON response and resolve the promise with the parsed JSON.
  - If the response is not successful attempt to parse the response body to extract an error message and reject the promise with the error message.
  - If there's an error in making the HTTP request (e.g., a network issue), reject the promise with a "Cannot communicate" error message.
  
  

This utility function is helpful when working with API requests, ensuring that you can handle HTTP responses in a consistent manner, whether they represent success or errors.
