
# INFO

STUDENT mario Rossi 2000001   LM1
STUDENT maria Bianchi 200002   LM2

TEACHER Maria Rossi 268553  
    -thesis AI-DRIVEN... LM1
    -thesis BLOCKCHAIN... LM1,LM2,LM3

TEACHER giovanna Ferrari 268555 
    -thesis SUSTAINABL ENERGY... LM1
    -thesis SMART CITY... LM1,LM2

TEACHER Luigi bianchi 268554 
    -thesis ENVIROMENTAL IMPACT...LT2

APPLICATION 200001-> AI DRIVEN... 268553 (1)
APPLICATION 200001-> BLOCKCHAIN... 268553 (2)
APPLICATION 200002-> BLOCKCHAIN... 268553 (3)

# DEMO 2

## STEPS TO PERFORM

    -lOGIN AS maria.rossi@polito.it 268553 -> show existing proposals;
                                              create thesis for LM1,LM2

    -LOGIN AS maria.bianchi@studenti.polito.it 200002-> show proposals and filtering for last insert one
                                                     send application (4) for the new thesis 
                                                     show the pending applications

    -lOGIN AS maria.rossi@polito.it 268553 -> show applications
                                              accept last application (3) from 200002
                                              reject application (2) from 200001

    -LOGIN AS maria.bianchi@studenti.polito.it 200002-> show application (4) has been accepted and the other canceled   
                                                       
    -LOGIN AS mario.rossi@studenti.polito.it 200001-> show applications rejected   
                                       
    
THESIS DATA:
internet of Things (IoT) Security
IoT Security, Cyber-Physical Systems
Research	Internship	
Investigate security challenges in IoT devices and propose robust solutions.This project focuses on enhancing the security of IoT devices through in-depth analysis and solution proposals
Network Protocols, Device Authentication, Threat Modeling

# DEMO 3

## UPDATE proposal

### TEACHER

- Login:
    - maria.rossi@polito.it
    - 268553
- Thesis:
    - AI-Driven Healthcare Solutions
- Edit button
- Modify the description with:

```
Implement an intelligent system leveraging machine learning algorithms to analyze medical data for the development of AI-driven healthcare solutions aimed at precise and efficient disease diagnosis. The system will utilize advanced algorithms to interpret complex medical datasets, aiding in early detection and accurate identification of various ailments, thereby revolutionizing diagnostic procedures within the healthcare domain.
```
- Edit date from 20/11/2024 to 01/03/2024
- Show the modification
- Logout

### STUDENT

- Login:
    - mario.rossi@studenti.polito.it
    - 200001
- Thesis:
    - AI-Driven Healthcare Solutions

> **END**

## NOTIFY application DECISION

### TEACHER

- Login:
    - luigi.bianchi@polito.it
    - 268554
- Choose thesis
- Accept it

### SYSTEM

- Show the notification sent to the student

### STUDENT

- Login
    - luigi.ferrari@studenti.polito.it
    - 200003
- show application status ('accepted')

## DELETE proposal

### TEACHER 1

- Login:
    - maria.rossi@polito.it
    - 268553
- Thesis:
    - Blockchain Technology and Cryptocurrencies
- logout

### STUDENT 1

- Login:
    - mario.rossi@studenti.polito.it
    - 200001
- Go to `applications` tab
- show application status:
    - Blockchain Technology and Cryptocurrencies
- logout

### TEACHER 2

- Login
- Delete `Blockchain` proposal
- show list approval

### STUDENT 2

- Login
- Go to `applications` tab
- show application status:
    - Blockchain Technology and Cryptocurrencies

> **END**

## COPY proposal

### TEACHER

- Login:
    - giovanna.ferrari@polito.it
    - 268555
- Thesis:
    - Smart Cities Urban Planning
- copy button
-Edit with:

```bash
title: Internet of Things (IoT) Security
keywords: IoT Security, Cyber-Physical Systems
description: Investigate security challenges in IoT devices and propose robust solutions.This project focuses on enhancing the security of IoT devices through in-depth analysis and solution proposals
requirements: Network Protocols, Device Authentication, Threat Modeling
cds: only LM-1
date: 30/04/2024
```

- show proposal

### STUDENT

- Login:
    - mario.rossi@studenti.polito.it
    - 200001
- show thesis:
    - Internet of Things (IoT) Security

> **END**

## ARCHIVE proposal

### TEACHER

- Login:
    - teacher that has a proposal with an application in 'pending' state
- Choose that thesis
- Archive

### STUDENT

- Login
    - student that did the application on the proposal
- show application status ('rejected')

> **END**