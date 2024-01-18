const { type } = require('os');
const expect = require('chai').expect;
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

  test('here a student filters the thesis list with nothing and then resets it', async () => {
    // Navigate the page to a URL
    await page.goto('http://localhost:5173/');

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

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
    const tableSelector = 'table.table-striped.table-bordered.table-hover';

    const tableElement = await page.$(tableSelector);
    if (tableElement) {
      // Calcola il numero di righe della tabella
      const rowCount = await page.$$eval(`${tableSelector} tbody tr`, rows => rows.length);

      // Stampare il titolo della tesi nella prima riga
      const firstRowTitle = await page.$eval(`${tableSelector} tbody tr:first-child td:nth-child(2) a`, link => link.textContent);

    } else {
      throw new Error('Tabella non trovata sulla pagina.');
    }

    // Check if the selector and search button exist
    const selectorExists = await page.$('.selector');
    const searchButtonExists = await page.$('button.btn-outline-success');

    // Assert that the selector and search button exist
    expect(selectorExists).to.not.be.null;
    expect(searchButtonExists).to.not.be.null;
    if (selectorExists && searchButtonExists) {
      // Interact with the selector 
      await page.select('.selector', 'title');
      // Interact with the search button
      await page.click('button.btn-outline-success');
      // Wait for the results to load 
      await page.waitForSelector('table.table-striped.table-bordered.table-hover',{ visible: true, timeout: 1000 }).catch(() => null);
      // Get the number of rows after the search
      const rowCountAfterSearch = await page.$$eval('.table-responsive table tbody tr', rows => rows.length, { visible: true, timeout: 1000 }).catch(() => null);

      // Assert that the search produced the expected results
      expect(rowCountAfterSearch).to.equal(0);
    } else {
      console.error('Selector or search button not found on the page.');
    }

    //reset the searching result
    const initialRowCount = await page.$$eval('table.table-striped.table-bordered.table-hover tbody tr', rows => rows.length);
    const resetButton = await page.$('#reset-button');
    await page.waitForTimeout(2000);
    if (resetButton) {
      page.click('#reset-button')
    } else {
      throw new Error('Element not found');
    }

    // Wait for the number of rows to change
    await page.waitForFunction((initialRowCount) => {
      const currentRowCount = document.querySelectorAll('table.table-striped.table-bordered.table-hover tbody tr').length;
      return currentRowCount !== initialRowCount;
    }, {}, initialRowCount);

    // Get the number of rows after the search
    const rowCountAfterReset = await page.$$eval('.table-responsive table tbody tr', rows => rows.length);
    // Assert that the search produced the expected results
    expect(rowCountAfterReset).to.equal(5);


  }, 1 * 60 * 1000);

  test('here a student filters the thesis list by groups and then checks the results', async () => {
    // Navigate the page to a URL
    await page.goto('http://localhost:5173/');

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

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
    const tableSelector = 'table.table-striped.table-bordered.table-hover';

    const tableElement = await page.$(tableSelector);
    if (tableElement) {
      // Calcola il numero di righe della tabella
      const rowCount = await page.$$eval(`${tableSelector} tbody tr`, rows => rows.length);

      // Stampare il titolo della tesi nella prima riga
      const firstRowTitle = await page.$eval(`${tableSelector} tbody tr:first-child td:nth-child(2) a`, link => link.textContent);

    } else {
      throw new Error('Tabella non trovata sulla pagina.');
    }

    // Check if the selector and search button exist
    const selectorExists = await page.$('.selector');
    const searchButtonExists = await page.$('button.btn-outline-success');

    // Assert that the selector and search button exist
    expect(selectorExists).to.not.be.null;
    expect(searchButtonExists).to.not.be.null;
    if (selectorExists && searchButtonExists) {
      // Interact with the selector 
      await page.select('.selector', 'groups');
      // Interact with the search button
      await page.click("div.css-w9q2zk-Input2")
      await page.type("div.css-w9q2zk-Input2",'AI');
      await page.keyboard.press('Enter');
      await page.click('button.btn-outline-success');
      // Wait for the results to load 
      await page.waitForSelector('table.table-striped.table-bordered.table-hover',{ visible: true, timeout: 1000 }).catch(() => null);
      // Get the number of rows after the search
      const rowCountAfterSearch = await page.$$eval('.table-responsive table tbody tr', rows => rows.length, { visible: true, timeout: 1000 }).catch(() => null);

      // Assert that the search produced the expected results
      expect(rowCountAfterSearch).to.equal(4);
    } else {
      console.error('Selector or search button not found on the page.');
    }

  }, 1 * 60 * 1000);

  test('here a student filters the thesis list by groups and then checks the results', async () => {
    // Navigate the page to a URL
    await page.goto('http://localhost:5173/');

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

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
    const tableSelector = 'table.table-striped.table-bordered.table-hover';

    const tableElement = await page.$(tableSelector);
    if (tableElement) {
      // Calcola il numero di righe della tabella
      const rowCount = await page.$$eval(`${tableSelector} tbody tr`, rows => rows.length);

      // Stampare il titolo della tesi nella prima riga
      const firstRowTitle = await page.$eval(`${tableSelector} tbody tr:first-child td:nth-child(2) a`, link => link.textContent);

    } else {
      throw new Error('Table not found');
    }

    // Check if the selector and search button exist
    const selectorExists = await page.$('.selector');
    const searchButtonExists = await page.$('button.btn-outline-success');

    // Assert that the selector and search button exist
    expect(selectorExists).to.not.be.null;
    expect(searchButtonExists).to.not.be.null;
    if (selectorExists && searchButtonExists) {
      // Interact with the search button
      //just renew and ferr to get the thesis about renewable energy with supervisor Ferrari
      await page.click("div.css-w9q2zk-Input2")
      await page.type("div.css-w9q2zk-Input2",'ReNew'); //to show that is not case sensitive
      await page.keyboard.press('Enter');
      await page.click("div.css-w9q2zk-Input2")
      await page.type("div.css-w9q2zk-Input2",'ferr');
      await page.keyboard.press('Enter');
      await page.click('button.btn-outline-success');
      // Wait for the results to load 
      await page.waitForSelector('table.table-striped.table-bordered.table-hover',{ visible: true, timeout: 1000 }).catch(() => null);
      // Get the number of rows after the search
      const rowCountAfterSearch = await page.$$eval('.table-responsive table tbody tr', rows => rows.length, { visible: true, timeout: 1000 }).catch(() => null);

      // Assert that the search produced the expected results
      expect(rowCountAfterSearch).to.equal(1);
    } else {
      console.error('Selector or search button not found on the page.');
    }

  }, 1 * 60 * 1000);

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
    } else throw new Error("Something went wrong")

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