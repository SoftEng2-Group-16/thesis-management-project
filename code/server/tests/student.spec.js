const puppeteer = require('puppeteer');
const expect = require('chai').expect;

describe('Student test', () => {
  let browser;
  let page;
  let sourceContent;
  const fs = require('fs').promises;

  beforeAll(async () => {
    // Launch the browser and open a new blank page
    //with headless:false we show the chromium browser
    //with headless:true we don't show the browser running, just the result
    browser = await puppeteer.launch({ headless: false });
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

    } catch (error) {
      console.error('Error copying database:', error.message);
    }
  });

  test.skip('here a students tries to apply but then cancels the confirmation dialog', async () => {
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


    let cells = await page.$$(`${tableSelector} tr`);
    cells = cells;

    const rowIndex = 2;
    const columnIndex = 2;

    // Select the cell using CSS selector
    const cellSelector = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;
    const cellHandle = await page.$(cellSelector);

    // Use evaluate to get the text content of the cell
    const firstThesis = await page.evaluate(cell => cell.textContent, cellHandle);

    // Now 'cells' contains an array of all <td> elements in the table

    // await page.click(cellSelector);
    await page.click('a[href="/thesis/1"]');

    const titleSelector = 'div.border-bottom.pb-2.mb-4.card-title.h5';
    const title = await page.$eval(titleSelector, component => component.textContent);

    if (title != firstThesis) {
      throw new Error("The thesis is a different one");
    }


    await page.click("#dropdown-item-button");
    await page.click("#button-apply");
    await page.click("#dialog-button-cancel");


    
    const applySelector = await page.waitForSelector('div.thesis-card.card');
    if(!applySelector) throw new Error("He is not on the thesis page");
  }, 1 * 60 * 1000);
   
  test.skip('here a students tries to apply for a thesis that he has already applied for', async () => {
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


    let cells = await page.$$(`${tableSelector} tr`);
    cells = cells;

    const rowIndex = 2;
    const columnIndex = 2;

    // Select the cell using CSS selector
    const cellSelector = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;
    const cellHandle = await page.$(cellSelector);

    // Use evaluate to get the text content of the cell
    const firstThesis = await page.evaluate(cell => cell.textContent, cellHandle);

    // Now 'cells' contains an array of all <td> elements in the table
    // await page.click(cellSelector);
    await page.click('a[href="/thesis/1"]');

    const titleSelector = 'div.border-bottom.pb-2.mb-4.card-title.h5';
    const title = await page.$eval(titleSelector, component => component.textContent);

    if (title != firstThesis) {
      throw new Error("The thesis is a different one");
    }


    await page.click("#dropdown-item-button");
    await page.click("#button-apply");
    await page.click("#dialog-button-confirm");

    
    await page.waitForSelector('div.fade.alert.alert-danger.alert-dismissible.show');
    const applySelector = 'div.fade.alert.alert-danger.alert-dismissible.show';
    if(!applySelector) throw new Error("No notification to the student");
  }, 1 * 60 * 1000);
 
  test.skip('here a student applies for a thesis that he did not apply for succesfully', async () => {
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
      const tableSelector = 'table.table-striped.table-bordered.table-hover';
      
  
      //await page.click(cellSelector);
      await page.click('a[href="/thesis/5"]');
      
  
      await page.click("#dropdown-item-button");
      await page.click("#button-apply");
      await page.click("#dialog-button-confirm");
    
      await page.waitForSelector('div.fade.alert.alert-success.alert-dismissible.show');
      const applySelector = 'div.fade.alert.alert-success.alert-dismissible.show';
      if(!applySelector) throw new Error("No notification to the student");
  }, 1 * 60 * 1000);

  test.skip('here a student sends a thesis request filling everything', async () => {
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
    
    //await page.click(cellSelector);
    await page.click('a[href="/thesisRequest"]');
      //inserting the title
      await page.click("#title")
      await page.type("#title",'New Thesis proposal');
      //inserting the description
      await page.click("#description")
      await page.type("#description",'Description about this new incredible thesis proposal');
      //inserting the supervisor
      await page.click("div.select__control.css-13cymwt-control")
      await page.type("div.select__control.css-13cymwt-control",'sof');
      await page.keyboard.press('Enter');
      //Inserting the cosupervisors
      await page.click("div.select__control.css-13cymwt-control:nth-child(2)")
      await page.type("div.select__control.css-13cymwt-control:nth-child(2)",'ant');
      await page.keyboard.press('Enter');
      //since it remains selected the user can write again
      await page.type("div.select__control.css-13cymwt-control:nth-child(2)",'ren');
      await page.keyboard.press('Enter');

      await page.click('button.btn.btn-primary');

      await page.waitForSelector('div.fade.alert.alert-success.alert-dismissible.show');

  }, 1 * 60 * 1000);

  test.skip('here a student sends a thesis request filling everything except the cosupervisors', async () => {
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
    
    //await page.click(cellSelector);
    await page.click('a[href="/thesisRequest"]');
      //inserting the title
      await page.click("#title")
      await page.type("#title",'New Thesis proposal');
      //inserting the description
      await page.click("#description")
      await page.type("#description",'Description about this new incredible thesis proposal');
      //inserting the supervisor
      await page.click("div.select__control.css-13cymwt-control")
      await page.type("div.select__control.css-13cymwt-control",'sof');
      await page.keyboard.press('Enter');
      //confirming
      await page.click('button.btn.btn-primary');

      await page.waitForSelector('div.fade.alert.alert-success.alert-dismissible.show');

  }, 1 * 60 * 1000);

  test.skip('here a student sends a thesis request forgetting the supervisor', async () => {
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
    
    //await page.click(cellSelector);
    await page.click('a[href="/thesisRequest"]');
      //inserting the title
      await page.click("#title")
      await page.type("#title",'New Thesis proposal');
      //inserting the description
      await page.click("#description")
      await page.type("#description",'Description about this new incredible thesis proposal');
      //confirming
      await page.click('button.btn.btn-primary');

      await page.waitForSelector('div.fade.alert.alert-danger.alert-dismissible.show');
      const firstLiText = await page.$eval('ul li:nth-child(1)', li => li.textContent);
      if(firstLiText != "Supervisor is required") throw new Error("The error notification is wrong");

  }, 1 * 60 * 1000);

  test.skip('here a student sends a thesis request forgetting the description', async () => {
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
    
    //await page.click(cellSelector);
    await page.click('a[href="/thesisRequest"]');
      //inserting the title
      await page.click("#title")
      await page.type("#title",'New Thesis proposal');
      //inserting the supervisor
      await page.click("div.select__control.css-13cymwt-control")
      await page.type("div.select__control.css-13cymwt-control",'sof');
      await page.keyboard.press('Enter');
      //confirming
      await page.click('button.btn.btn-primary');

      await page.waitForSelector('div.fade.alert.alert-danger.alert-dismissible.show');
      const firstLiText = await page.$eval('ul li:nth-child(1)', li => li.textContent);
      if(firstLiText != "Description is required") throw new Error("The error notification is wrong");

  }, 1 * 60 * 1000);

  test.skip('here a student sends a thesis request forgetting the title', async () => {
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
    
    //await page.click(cellSelector);
    await page.click('a[href="/thesisRequest"]');
      //inserting the description
      await page.click("#description")
      await page.type("#description",'Description about this new incredible thesis proposal');
      //inserting the supervisor
      await page.click("div.select__control.css-13cymwt-control")
      await page.type("div.select__control.css-13cymwt-control",'sof');
      await page.keyboard.press('Enter');
      //confirming
      await page.click('button.btn.btn-primary');

      await page.waitForSelector('div.fade.alert.alert-danger.alert-dismissible.show');
      const firstLiText = await page.$eval('ul li:nth-child(1)', li => li.textContent);
      if(firstLiText != "Title is required") throw new Error("The error notification is wrong");

  }, 1 * 60 * 1000);

  test.skip('here a student sends a thesis request forgetting everything', async () => {
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
    
    //await page.click(cellSelector);
    await page.click('a[href="/thesisRequest"]');
    //confirming
    await page.click('button.btn.btn-primary');

    await page.waitForSelector('div.fade.alert.alert-danger.alert-dismissible.show');
    const firstLiText = await page.$eval('ul li:nth-child(1)', li => li.textContent);
    const secondLiText = await page.$eval('ul li:nth-child(2)', li => li.textContent);
    const thirdLiText = await page.$eval('ul li:nth-child(3)', li => li.textContent);
    if(firstLiText != "Title is required") throw new Error("The error notification is wrong");
    if(secondLiText != "Supervisor is required") throw new Error("The error notification is wrong");
    if(thirdLiText != "Description is required") throw new Error("The error notification is wrong");

  }, 1 * 60 * 1000)

  test.skip('here a student sends a thesis request filling everything but adding as a cosupervisor the supervisor', async () => {
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
    
    //await page.click(cellSelector);
    await page.click('a[href="/thesisRequest"]');
      //inserting the title
      await page.click("#title")
      await page.type("#title",'New Thesis proposal');
      //inserting the description
      await page.click("#description")
      await page.type("#description",'Description about this new incredible thesis proposal');
      //inserting the supervisor
      await page.click("div.select__control.css-13cymwt-control")
      await page.type("div.select__control.css-13cymwt-control",'sof');
      await page.keyboard.press('Enter');
      //Inserting as cosupervisor the same supervisor
      await page.click("div.basic-multi-select.css-b62m3t-container:nth-child(2)")
      await page.type("div.basic-multi-select.css-b62m3t-container:nth-child(2)",'sof');
      await page.keyboard.press('Enter');
      //since it remains selected the user can write again (but it will give us an error anyways)
      await page.type("div.basic-multi-select.css-b62m3t-container:nth-child(2)",'ren');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(6000);
      await page.click('button.btn.btn-primary');

      await page.waitForSelector('div.fade.alert.alert-danger.alert-dismissible.show');
      const firstLiText = await page.$eval('ul li:nth-child(1)', li => li.textContent);
      if(firstLiText != "A teacher can not be both supervisor and cosupervisor") throw new Error("The error notification is wrong");

    }, 1 * 60 * 1000);

  test.skip('here a student sends a thesis request adding only the supervisor and making him also the cosupervisor', async () => {
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
      
    //await page.click(cellSelector);
    await page.click('a[href="/thesisRequest"]');
    //inserting the supervisor
    await page.click("div.select__control.css-13cymwt-control")
    await page.type("div.select__control.css-13cymwt-control",'sof');
    await page.keyboard.press('Enter');
    //Inserting as cosupervisor the same supervisor
    await page.click("div.basic-multi-select.css-b62m3t-container:nth-child(2)")
    await page.type("div.basic-multi-select.css-b62m3t-container:nth-child(2)",'sof');
    await page.keyboard.press('Enter');
    //since it remains selected the user can write again (but it will give us an error anyways)
    await page.type("div.basic-multi-select.css-b62m3t-container:nth-child(2)",'ren');
    await page.keyboard.press('Enter');
    //confirming
    await page.click('button.btn.btn-primary');
  
    await page.waitForSelector('div.fade.alert.alert-danger.alert-dismissible.show');
    const firstLiText = await page.$eval('ul li:nth-child(1)', li => li.textContent);
    const secondLiText = await page.$eval('ul li:nth-child(2)', li => li.textContent);
    const thirdLiText = await page.$eval('ul li:nth-child(3)', li => li.textContent);
    if(firstLiText != "Title is required") throw new Error("The error notification is wrong");
    if(secondLiText != "Description is required") throw new Error("The error notification is wrong");
    if(thirdLiText != "A teacher can not be both supervisor and cosupervisor") throw new Error("The error notification is wrong");
  
  }, 1 * 60 * 1000)
});


