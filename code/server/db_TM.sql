BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "applications" (
	"thesisid"	INTEGER NOT NULL,
	"studentid"	INTEGER NOT NULL,
	"timestamp"	TEXT NOT NULL,
	"status"	TEXT NOT NULL,
	"teacherid"	INTEGER,
	FOREIGN KEY("thesisid") REFERENCES "thesis_proposals"("id"),
	FOREIGN KEY("studentid") REFERENCES "students"("id"),
	FOREIGN KEY("teacherid") REFERENCES "teachers"("id"),
	PRIMARY KEY("thesisid","studentid")
);
CREATE TABLE IF NOT EXISTS "archived_thesis_proposals" (
	"id"	INTEGER NOT NULL UNIQUE,
	"title"	TEXT NOT NULL,
	"supervisor"	TEXT NOT NULL,
	"cosupervisors"	TEXT,
	"keywords"	TEXT NOT NULL,
	"type"	TEXT NOT NULL,
	"groups"	TEXT NOT NULL,
	"description"	TEXT NOT NULL,
	"requirements"	TEXT NOT NULL,
	"notes"	TEXT NOT NULL,
	"expiration"	TEXT NOT NULL,
	"level"	TEXT NOT NULL,
	"cds"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("cds") REFERENCES "degrees"("degree_code"),
	FOREIGN KEY("supervisor") REFERENCES "teachers"("id")
);
CREATE TABLE IF NOT EXISTS "auth" (
	"id"	INTEGER NOT NULL,
	"email"	TEXT,
	"role"	TEXT,
	"password"	TEXT NOT NULL,
	"salt"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "careers" (
	"student_id"	INTEGER NOT NULL,
	"course_code"	TEXT NOT NULL,
	"course_title"	TEXT NOT NULL,
	"cfu"	INTEGER NOT NULL,
	"grade"	TEXT NOT NULL,
	"date_registered"	TEXT NOT NULL,
	PRIMARY KEY("student_id","course_code"),
	FOREIGN KEY("student_id") REFERENCES "students"("id")
);
CREATE TABLE IF NOT EXISTS "degrees" (
	"degree_code"	TEXT NOT NULL UNIQUE,
	"degree_title"	TEXT NOT NULL,
	PRIMARY KEY("degree_code")
);
CREATE TABLE IF NOT EXISTS "external_cosupervisors" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"surname"	TEXT NOT NULL,
	"company"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "students" (
	"id"	INTEGER NOT NULL UNIQUE,
	"surname"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"gender"	TEXT NOT NULL,
	"nationality"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
	"degree_code"	TEXT NOT NULL,
	"enrollment_year"	TEXT NOT NULL,
	FOREIGN KEY("degree_code") REFERENCES "degrees"("degree_code"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "teachers" (
	"id"	INTEGER NOT NULL UNIQUE,
	"surname"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
	"group_code"	TEXT NOT NULL,
	"department_code"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "thesis_proposals" (
	"id"	INTEGER NOT NULL UNIQUE,
	"title"	TEXT NOT NULL,
	"supervisor"	TEXT NOT NULL,
	"cosupervisors"	TEXT,
	"keywords"	TEXT NOT NULL,
	"type"	TEXT NOT NULL,
	"groups"	TEXT NOT NULL,
	"description"	TEXT NOT NULL,
	"requirements"	TEXT NOT NULL,
	"notes"	TEXT NOT NULL,
	"expiration"	TEXT NOT NULL,
	"level"	TEXT NOT NULL,
	"cds"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("supervisor") REFERENCES "teachers"("id"),
	FOREIGN KEY("cds") REFERENCES "degrees"("degree_code")
);
INSERT INTO "applications" ("thesisid","studentid","timestamp","status") VALUES (3,200001,'08/11/2023 16:42:50','pending','268553');
INSERT INTO "applications" ("thesisid","studentid","timestamp","status") VALUES (1,200001,'18/11/2023 10:42:50','pending','268553');
INSERT INTO "auth" ("id","email","role","password","salt") VALUES (200001,'mario.rossi@studenti.polito.it','student','78a9b43f33c457b3f12446c7cc4ab6150498ad85c832ec81321ade572350aedfe5903e2cd6252db2b154a747d3a6c2e60a1db3f4578c1f53ccdc96fafcbd9df5','e8a1ea50eeaaa38f');
INSERT INTO "auth" ("id","email","role","password","salt") VALUES (200002,'maria.bianchi@studenti.polito.it','student','2fc9bef697d33a03b59eae40f55f07b56cb86c9707de9bc84903b13166ba1d31dcac9dea6afc3ac466b9b444e7b721f191720535e0ce8ddbe129f25fd6868803','4cf6a245a3ba5a7e');
INSERT INTO "auth" ("id","email","role","password","salt") VALUES (200003,'luigi.ferrari@studenti.polito.it','student','a8d5ff4330dbb180375c94912de0b2bf0b1f27a123e7356f4cb245ddc07b65b0539a0178a836d01cc528baaf34554f5bb719b179803d969f3a6d68f0e6074a23','8eb1844efeb3221f');
INSERT INTO "auth" ("id","email","role","password","salt") VALUES (200004,'giulia.russo@studenti.polito.it','student','0249760ddc153f79d810496c37153e0e4fe6ed019ff877004d3c975704f0a1f9ba92e0345de5024c4e5145833ce204922d2cd614637741cebf868d10f970bd0a','8ddc7df9db322a76');
INSERT INTO "auth" ("id","email","role","password","salt") VALUES (268553,'maria.rossi@polito.it','teacher','a30b2f893ade539a1f093f351336dbe3bdd21ade59428b01fa407e573d44145fb5427d45421c09b5bc4d104f4733475a5234875908fbb2ddbdf221fe9f83ab3d','72e4eeb14def3b21');
INSERT INTO "auth" ("id","email","role","password","salt") VALUES (268554,'luigi.bianchi@polito.it','teacher','007b3ebaac134f6151ae5f607ee90f512f526864b24b86e8e13ef32e7d64479f7b62f0a99a3cc2027c19fe9459c5e6ad1efb6a28be9ef9422856db49b7d6047c','a8b618c717683608');
INSERT INTO "auth" ("id","email","role","password","salt") VALUES (268555,'giovanna.ferrari@polito.it','teacher','07cf22abb602bba0bbebba322e29f5d0ec8bd1ffe914bd7ac6ca3bbe1423d9b1f345473ac3fec1b60d504dd2056d53b27e03e64939fe4ffdea579917742d6afd','e818f0647b4e1fe0');
INSERT INTO "auth" ("id","email","role","password","salt") VALUES (268556,'antonio.russo@polito.it','teacher','c013b18faabbfd361ae35bc14acbc0f33591048d178bb08314453cd709b4c96b5045b487f15538186f4039fdfccd9112bcb4728b656d2f11d027e7da10fea3e2','d545d0678920bb72 ');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200023,'02PQRST','Physics',19,'30L','20-10-2018');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200009,'01ABCDE','Computer Science',28,'20','02-03-2020');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200002,'02UVWXY','Geometry',22,'28','18-07-2022');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200003,'02PQRST','Physics',27,'28','12-04-2016');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200006,'02PQRST','Physics',23,'25','10-01-2016');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200002,'02PQRST','Chemistry',24,'28','05-06-2019');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200002,'02FGHIJ','Math',20,'28','22-06-2018');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200002,'01FGHIJ','Chemistry',24,'28','05-06-2019');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200023,'01PQRST','Physics',19,'30L','20-10-2018');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200009,'02ABCDE','Computer Science',28,'20','02-03-2020');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200002,'01UVWXY','Geometry',22,'28','18-07-2022');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200023,'02ABCDE','Computer Science',25,'25','15-03-2015');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200005,'02ABCDE','Computer Science',25,'25','15-03-2015');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200012,'01FGHIJ','Math',20,'28','22-06-2018');
INSERT INTO "careers" ("student_id","course_code","course_title","cfu","grade","date_registered") VALUES (200013,'01FGHIJ','Math',18,'30L','05-09-2019');
INSERT INTO "degrees" ("degree_code","degree_title") VALUES ('LM-1','Computer Engineering');
INSERT INTO "degrees" ("degree_code","degree_title") VALUES ('LM-2','Electrical Engineering');
INSERT INTO "degrees" ("degree_code","degree_title") VALUES ('LM-3','Mechanical Engineering');
INSERT INTO "degrees" ("degree_code","degree_title") VALUES ('LM-4','Civil Engineering');
INSERT INTO "degrees" ("degree_code","degree_title") VALUES ('LT-1','Aerospace Engineering');
INSERT INTO "degrees" ("degree_code","degree_title") VALUES ('LT-2','Biomedical Engineering');
INSERT INTO "degrees" ("degree_code","degree_title") VALUES ('LT-3','Electrical Engineering');
INSERT INTO "degrees" ("degree_code","degree_title") VALUES ('LT-4','Telecommunications Engineering');
INSERT INTO "degrees" ("degree_code","degree_title") VALUES ('LT-5','Materials Engineering');
INSERT INTO "degrees" ("degree_code","degree_title") VALUES ('LT-6','Nuclear Engineering');
INSERT INTO "degrees" ("degree_code","degree_title") VALUES ('LM-5','ICT for Smart Societies');
INSERT INTO "degrees" ("degree_code","degree_title") VALUES ('LM-6','Energy Engineering');
INSERT INTO "external_cosupervisors" ("id","name","surname","company","email") VALUES (1,'Marco','Rossi','Reply','marco.rossi@reply.com');
INSERT INTO "external_cosupervisors" ("id","name","surname","company","email") VALUES (2,'Giulia','Bianchi','OpenAI','giulia.bianchi@openai.com');
INSERT INTO "external_cosupervisors" ("id","name","surname","company","email") VALUES (3,'Alessio','Ferrari','OctopusEnergy','alessio.ferrari@octopus.com');
INSERT INTO "external_cosupervisors" ("id","name","surname","company","email") VALUES (4,'Elena','Ricci','STMicroelectronics','elena.ricci@stm.it');
INSERT INTO "external_cosupervisors" ("id","name","surname","company","email") VALUES (5,'Luca','Conti','Thales','luca.conti@thales.it');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200001,'Rossi','Mario','M','Italian','mario.rossi@studenti.polito.it','LM-1','2010');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200002,'Bianchi','Maria','F','Italian','maria.bianchi@studenti.polito.it','LM-2','2011');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200003,'Ferrari','Luigi','M','Italian','luigi.ferrari@studenti.polito.it','LT-3','2012');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200004,'Russo','Giulia','F','Italian','giulia.russo@studenti.polito.it','LT-4','2013');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200005,'Romano','Antonio','M','Italian','antonio.romano@studenti.polito.it','LM-3','2014');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200006,'Sanchez','Maria','F','Spanish','maria.sanchez@studenti.polito.it','LM-2','2015');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200007,'Garcia','Carlos','M','Spanish','carlos.garcia@studenti.polito.it','LT-1','2016');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200008,'Smith','John','M','English','john.smith@studenti.polito.it','LM-3','2017');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200009,'Johnson','Emily','F','English','emily.johnson@studenti.polito.it','LT-1','2018');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200010,'Perez','Ana','F','Italian','ana.perez@studenti.polito.it','LT-2','2019');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200011,'Gomez','Carlos','M','Spanish','carlos.gomez@studenti.polito.it','LM-1','2020');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200012,'Williams','Sophia','F','English','sophia.williams@studenti.polito.it','LM-2','2021');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200013,'Moreno','Luis','M','Spanish','luis.moreno@studenti.polito.it','LT-3','2022');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200014,'White','Olivia','F','English','olivia.white@studenti.polito.it','LT-4','2023');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200015,'Mancini','Luca','M','Italian','luca.mancini@studenti.polito.it','LM-3','2020');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200016,'Gonzalez','Sofia','F','Spanish','sofia.gonzalez@studenti.polito.it','LM-2','2021');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200017,'Brown','Michael','M','English','michael.brown@studenti.polito.it','LT-1','2022');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200018,'Martinez','Elena','F','Spanish','elena.martinez@studenti.polito.it','LM-3','2023');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200019,'Taylor','Daniel','M','English','daniel.taylor@studenti.polito.it','LT-1','2020');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200020,'Conti','Giorgia','F','Italian','giorgia.conti@studenti.polito.it','LT-2','2021');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200021,'Lopez','Miguel','M','Spanish','miguel.lopez@studenti.polito.it','LM-1','2022');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200022,'Harris','Ava','F','English','ava.harris@studenti.polito.it','LM-2','2023');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200023,'Morales','Pedro','M','Spanish','pedro.morales@studenti.polito.it','LT-3','2020');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200024,'Wilson','Isabella','F','English','isabella.wilson@studenti.polito.it','LT-4','2021');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200025,'Bianco','Carlo','M','Italian','carlo.bianco@studenti.polito.it','LM-3','2022');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200026,'Rodriguez','Marta','F','Spanish','marta.rodriguez@studenti.polito.it','LM-2','2023');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200027,'Davis','Liam','M','English','liam.davis@studenti.polito.it','LT-1','2020');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200028,'Ferrara','Giovanna','F','Italian','giovanna.ferrara@studenti.polito.it','LM-3','2021');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200029,'Gomez','Manuel','M','Spanish','manuel.gomez@studenti.polito.it','LM-2','2022');
INSERT INTO "students" ("id","surname","name","gender","nationality","email","degree_code","enrollment_year") VALUES (200030,'Johnson','Sophia','F','English','sophia.johnson@studenti.polito.it','LT-2','2023');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268553,'Rossi','Maria','maria.rossi@polito.it','AI','DAD');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268554,'Bianchi','Luigi','luigi.bianchi@polito.it','SO','DAUIN');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268555,'Ferrari','Giovanna','giovanna.ferrari@polito.it','SE','DAT');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268556,'Russo','Antonio','antonio.russo@polito.it','ED','DANERG');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268557,'Romano','Sofia','sofia.romano@polito.it','ETA','DISAT');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268558,'Gallo','Andrea','andrea.gallo@polito.it','AI','DAUIN');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268559,'Esposito','Lorenzo','lorenzo.esposito@polito.it','SO','DAT');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268560,'Martini','Silvia','silvia.martini@polito.it','SE','DANERG');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268561,'Fabbri','Claudia','claudia.fabbri@polito.it','ED','DISMA');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268562,'Mancini','Marco','marco.mancini@polito.it','ETA','DISAT');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268563,'De Luca','Giulia','giulia.deluca@polito.it','AI','DAD');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268564,'Barone','Alessio','alessio.barone@polito.it','SO','DAUIN');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268565,'Mariani','Stefano','stefano.mariani@polito.it','SE','DAT');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268566,'Vitale','Carlo','carlo.vitale@polito.it','ED','DANERG');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268567,'Greco','Carmela','carmela.greco@polito.it','ETA','DISAT');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268568,'Santoro','Roberto','roberto.santoro@polito.it','AI','DAUIN');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268569,'Pagano','Sara','sara.pagano@polito.it','SO','DAT');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268570,'Colombo','Davide','davide.colombo@polito.it','SE','DANERG');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268571,'Gatti','Simone','simone.gatti@polito.it','ED','DISMA');
INSERT INTO "teachers" ("id","surname","name","email","group_code","department_code") VALUES (268572,'Ferri','Anna','anna.ferri@polito.it','ETA','DISAT');
INSERT INTO "thesis_proposals" ("id","title","supervisor","cosupervisors","keywords","type","groups","description","requirements","notes","expiration","level","cds") VALUES (0,'Sustainable Energy Sources Research','268560','12345,67890','Renewable Energy, Sustainability, Research','Abroad Thesis','Energy Research Group, Sustainability Research Group','Conduct research on sustainable energy sources and their impact on the environment.','Environmental Science, Renewable Energy, Data Analysis','This project aims to explore renewable energy sources and their environmental effects.','15-11-24','bachelor','LT-3');
INSERT INTO "thesis_proposals" ("id","title","supervisor","cosupervisors","keywords","type","groups","description","requirements","notes","expiration","level","cds") VALUES (1,'AI-Driven Healthcare Solutions','268553','23456,78901','Artificial Intelligence, Healthcare, Machine Learning','Company Thesis','AI Research Group, Medical Research Group','Develop AI-powered healthcare solutions for diagnosing diseases.','Machine Learning, Medical Science, Data Analysis','This project focuses on leveraging AI for healthcare advancements.','20-11-24','bachelor','LT-2');
INSERT INTO "thesis_proposals" ("id","title","supervisor","cosupervisors","keywords","type","groups","description","requirements","notes","expiration","level","cds") VALUES (2,'Smart Cities Urban Planning','268557','34567,89012','Urban Planning, Smart Cities, Sustainability','University Thesis','Urban Planning Research Group, Sustainability Research Group','Plan and develop smart city solutions for urban sustainability.','Urban Development, Sustainability, Data Analysis','This project aims to create sustainable smart city solutions.','10-12-23','master','LM-5');
INSERT INTO "thesis_proposals" ("id","title","supervisor","cosupervisors","keywords","type","groups","description","requirements","notes","expiration","level","cds") VALUES (3,'Blockchain Technology and Cryptocurrencies','268558','45678,90123','Blockchain, Cryptocurrency, Security','Company Thesis','Blockchain Research Group, Security Research Group','Explore the potential of blockchain technology and cryptocurrencies.','Blockchain Development, Security, Financial Technology','This project focuses on the security and applications of blockchain and cryptocurrencies.','31-12-23','master','LM-1');
INSERT INTO "thesis_proposals" ("id","title","supervisor","cosupervisors","keywords","type","groups","description","requirements","notes","expiration","level","cds") VALUES (4,'Environmental Impact of Renewable Energy','268556','12345,67890','Renewable Energy, Environment, Sustainability','University Thesis','Energy Research Group, Sustainability Research Group','Study the environmental impact of renewable energy sources.','Environmental Science, Sustainability, Data Analysis','This project investigates the ecological footprint of renewable energy.','10-04-24','master','LM-1');
COMMIT;
