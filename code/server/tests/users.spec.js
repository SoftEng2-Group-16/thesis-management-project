const puppeteer = require('puppeteer');
jest.setTimeout(30000);


describe('User interactions test', () => {
  let browser;
  let page;
  let sourceContent;
  const fs = require('fs').promises;

  beforeAll(async () => {  
    // Launch the browser and open a new blank page
    //with headless:false we show the chromium browser
    //with headless:true we don't show the browser running, just the result
    browser = await puppeteer.launch( {headless: true});
    page = await browser.newPage();
    //save the db before the changes we are going to do
    const sourcePath = '../server/db_TM_dirty.db';
    sourceContent = await fs.readFile(sourcePath);
  });

  afterAll(async () => {
    await browser.close();


    try {
      const destinationPath = '../server/db_TM_dirty.db';        


      // Write the content to the destination file asynchronously
      await fs.writeFile(destinationPath, sourceContent);

      console.log(`Database restored`);
    } catch (error) {
      console.error('Error copying database:', error.message);
    }
  });

  test('Students checks the two pennding applications', async () => {
    // Navigate the page to a URL
    await page.goto('http://localhost:5173/');

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});

    //this below is the mocked login for the student
    //here we wait for the page to re-render the saml login
    await page.waitForSelector('#username');
    // use # for the id
    await page.type('#username', 'mario.rossi@studenti.polito.it');
    await page.type('#password', '200001');
    const buttonSelector = 'button.c320322a4.c480bc568.c20af198f.ce9190a97.cbb0cc1ad';
    await page.click(buttonSelector);

    //use this part above as a login in every test since it's needed.

    await page.waitForSelector('table.table-striped.table-bordered.table-hover');
    const navbar = '#applications';
   

 
    const navbarLink = await page.$(navbar);
    await navbarLink.click();
 
    await page.waitForSelector('table.table-striped.table-bordered.table-hover');
    const tableSelector = 'table.table-striped.table-bordered.table-hover';
    
    
    let cells = await page.$$(`${tableSelector} tr`);
    cells = cells; 

    const rowIndex = 1;
    const rowIndex1 = 2;
    const columnIndex = 5;

    // Select the cell using CSS selector
    const cellSelector1 = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;
    const cellSelector2 = `${tableSelector} tr:nth-child(${rowIndex1}) td:nth-child(${columnIndex})`;
    const cellHandle1 = await page.$(cellSelector1);
    const cellHandle2 = await page.$(cellSelector2);

    const firstApplication = await page.evaluate(cell => cell.textContent, cellHandle1);
    const secondApplication = await page.evaluate(cell => cell.textContent, cellHandle2);

    if(firstApplication == 'pending' && secondApplication == 'pending') {
        console.log("both pending")
    } else console.error("Something went wrong")

  });
  
  test('A professor rejects a thesis proposal and the student sees the result', async () => {
    // Navigate the page to a URL
    await page.goto('http://localhost:5173/');

    // Set screen size
    await page.setViewport({width: 1080, height: 600});
  
    //this below is the mocked login for the professor
    //here we wait for the page to re-render the saml login
    await page.waitForSelector('#username');
    // use # for the id
    await page.type('#username', 'maria.rossi@polito.it');
    await page.type('#password', '268553');
    //if there is no id use the css selector (hover over the conttent and find it, it's the first element)
    const buttonSelector = 'button.c320322a4.c480bc568.c20af198f.ce9190a97.cbb0cc1ad';
    await page.click(buttonSelector);
  
    //use this part above as a login in every test since it's needed.
    await page.waitForSelector('table.table-striped.table-bordered.table-hover');
    const navbar = '#applications';
    

  
    const navbarLink = await page.$(navbar);
    await navbarLink.click();

    await page.waitForSelector('table.table-striped.table-bordered.table-hover');
    const tableSelector = 'table.table-striped.table-bordered.table-hover';
    let cells = await page.$$(`${tableSelector} tr`);
    cells = cells; 

    const rowIndex = 1;
    const columnIndex = 3;

    // Select the first application
    const cellSelector = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;


    await page.click(cellSelector);
    await page.waitForSelector('div.thesis-card.card');
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

    await page.click('button.mt-3.ms-2.btn.btn-dark');
    await page.waitForSelector('div.fade.alert.alert-warning.alert-dismissible.show');

    //the professor now logs out and the student logs in
    await page.click('button.btn.btn-outline-light');

    //this below is the mocked login for the professor
    //here we wait for the page to re-render the saml login
    await page.waitForSelector('#username');
    // use # for the id
    await page.type('#username', 'mario.rossi@studenti.polito.it');
    await page.type('#password', '200001');
    //if there is no id use the css selector (hover over the conttent and find it, it's the first element)
    await page.click(buttonSelector);
  
    //use this part above as a login in every test since it's needed.
    await page.waitForSelector('table.table-striped.table-bordered.table-hover');

    await page.click('#applications');

    await page.waitForSelector('table.table-striped.table-bordered.table-hover');
    cells = await page.$$(`${tableSelector} tr`);
    cells = cells; 

    const newIndex = 5;
    const newIndex1 = 2;

    // Select the first application
    //this one is the result
    const cellSelector1 = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${newIndex})`;
    //this one is the link
    const cellSelector3 = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${newIndex1})`;
    

    const result = await page.$eval(cellSelector1, component => component.textContent);
    console.log(result)
    if(result == 'rejected'){
      
      console.log("The application was rejected");
    }else{
      console.error("Something went wrong");
    }
    //here i wait to see the result component
    await page.click(cellSelector3);
    await page.waitForSelector('div.mb-4.bg-warning.card');
    console.log("Also in the application page the thesis is rejected")
  });

  test('A professor accepts a thesis proposal and the student sees the result', async () => {
   // Navigate the page to a URL
   await page.goto('http://localhost:5173/');

   // Set screen size
   await page.setViewport({width: 1080, height: 600});
 
   //this below is the mocked login for the professor
   //here we wait for the page to re-render the saml login
   await page.waitForSelector('#username');
   // use # for the id
   await page.type('#username', 'maria.rossi@polito.it');
   await page.type('#password', '268553');
   //if there is no id use the css selector (hover over the conttent and find it, it's the first element)
   const buttonSelector = 'button.c320322a4.c480bc568.c20af198f.ce9190a97.cbb0cc1ad';
   await page.click(buttonSelector);
 
   //use this part above as a login in every test since it's needed.
   await page.waitForSelector('table.table-striped.table-bordered.table-hover');
   const navbar = '#applications';
   

 
   const navbarLink = await page.$(navbar);
   await navbarLink.click();

   await page.waitForSelector('table.table-striped.table-bordered.table-hover');
   const tableSelector = 'table.table-striped.table-bordered.table-hover';
   let cells = await page.$$(`${tableSelector} tr`);
   cells = cells; 

   const rowIndex = 2;
   const columnIndex = 3;

   // Select the first application
   const cellSelector = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;


   await page.click(cellSelector);
   await page.waitForSelector('div.thesis-card.card');
   await page.evaluate(() => {
       window.scrollTo(0, document.body.scrollHeight);
     });

    await page.click('button.mt-3.ms-2.btn.btn-success');

    await page.waitForSelector('div.fade.alert.alert-success.alert-dismissible.show');

    //the professor now logs out and the student logs in
    await page.click('button.btn.btn-outline-light');

    //this below is the mocked login for the professor
    //here we wait for the page to re-render the saml login
    await page.waitForSelector('#username');
    // use # for the id
    await page.type('#username', 'mario.rossi@studenti.polito.it');
    await page.type('#password', '200001');
    //if there is no id use the css selector (hover over the conttent and find it, it's the first element)
    await page.click(buttonSelector);
  
    //use this part above as a login in every test since it's needed.
    await page.waitForSelector('table.table-striped.table-bordered.table-hover');

    await page.click('#applications');

    await page.waitForSelector('table.table-striped.table-bordered.table-hover');
    cells = await page.$$(`${tableSelector} tr`);
    cells = cells; 

    const newIndex = 5;
    const newIndex1 = 2;

    // Select the first application
    //this one is the result
    cellSelector1 = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${newIndex})`;
    //this one is the link
    const cellSelector3 = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${newIndex1})`;
    

    result = await page.$eval(cellSelector1, component => component.textContent);
    console.log(result)
    if(result == 'accepted'){
      
      console.log("The application was accepted");
    }else{
      console.error("Something went wrong");
    }
    //here i wait to see the result component
    await page.click(cellSelector3);
    await page.waitForSelector('div.mb-4.bg-success.text-white.card');
    console.log("Also in the application page the thesis is accepted");
  });
});