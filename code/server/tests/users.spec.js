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
    browser = await puppeteer.launch( {headless: false});
    page = await browser.newPage();
    //save the db before the changes we are going to do
    const sourcePath = '../server/db_TM_dirty.db';
    sourceContent = await fs.readFile(sourcePath);
  });

  afterEach(async () => {
    try {
      const destinationPath = '../server/db_TM_dirty.db';        


      // Write the content to the destination file asynchronously
      await fs.writeFile(destinationPath, sourceContent);
    } catch (error) {
      throw new Error('Error copying database:', error.message);
    }
  });

  afterAll(async () => {
    await browser.close();


    try {
      const destinationPath = '../server/db_TM_dirty.db';        


      // Write the content to the destination file asynchronously
      await fs.writeFile(destinationPath, sourceContent);
    } catch (error) {
      throw new Error('Error copying database:', error.message);
    }
  });

  test('Students checks the pending application', async () => {
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
    const buttonSelector = 'button.c4900dc2e.cac92d701.c7024c898.c8f0f67a1.cb9ac0d3a';
    await page.click(buttonSelector);

    //use this part above as a login in every test since it's needed.

    await page.waitForSelector('table.table-striped.table-bordered.table-hover');

    await page.click('a[href="/applications"]');
 
    await page.waitForSelector('table.table-striped.table-bordered.table-hover');
    const tableSelector = 'table.table-striped.table-bordered.table-hover';
    
    
    let cells = await page.$$(`${tableSelector} tr`);
    cells = cells; 

    const rowIndex = 1;
    const columnIndex = 5;

    // Select the cell using CSS selector
    const cellSelector1 = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;
    const cellHandle1 = await page.$(cellSelector1);

    const firstApplication = await page.evaluate(cell => cell.textContent, cellHandle1);
  

    if(firstApplication == 'pending') {
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
    const buttonSelector = 'button.c4900dc2e.cac92d701.c7024c898.c8f0f67a1.cb9ac0d3a';
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

    await page.click('button.mt-3.ms-2.btn.btn-dark');
    await page.waitForSelector('div.fade.alert.alert-warning.alert-dismissible.show');

    //the professor now logs out and the student logs in
    await page.click('button.btn.btn-outline-light.h-75');

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

    await page.click('a[href="/applications"]');

    await page.waitForSelector('table.table-striped.table-bordered.table-hover');
    cells = await page.$$(`${tableSelector} tr`);
    cells = cells; 

    const newIndex = 5;
    const newIndex1 = 2;

    // Select the first application
    //this one is the result
    const cellSelector1 = `${tableSelector} tr:nth-child(1) td:nth-child(${newIndex})`;
    //this one is the link
    const cellSelector3 = `${tableSelector} tr:nth-child(1) td:nth-child(${newIndex1})`;


    

    const result = await page.$eval(cellSelector1, component => component.textContent);
    if(result != 'rejected'){
      throw new Error("Something went wrong");
    }
    //here i wait to see the result component
    await page.click(cellSelector3);
    const rejected = await page.waitForSelector('div.mb-4.bg-warning.card');
    if(!rejected) throw new Error("Also in the application page the thesis is rejected");
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
   const buttonSelector = 'button.c4900dc2e.cac92d701.c7024c898.c8f0f67a1.cb9ac0d3a';
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

    await page.click('a[href="/applications"]');

    await page.waitForSelector('table.table-striped.table-bordered.table-hover');
    cells = await page.$$(`${tableSelector} tr`);
    cells = cells; 

    const newIndex = 5;
    const newIndex1 = 2;

    // Select the first application
    //this one is the result
    const cellSelector1 = `${tableSelector} tr:nth-child(1) td:nth-child(${newIndex})`;
    //this one is the link
    const cellSelector3 = `${tableSelector} tr:nth-child(1) td:nth-child(${newIndex1})`;


    

    const result = await page.$eval(cellSelector1, component => component.textContent);
    if(result != 'accepted'){
      throw new Error("Something went wrong");
    }
    //here i wait to see the result component
    await page.click(cellSelector3);
    const rejected = await page.waitForSelector('div.mb-4.bg-success.text-white.card');
    if(!rejected) throw new Error("Also in the application page the thesis is accepted")
  });
});