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

      console.log(`Database restored`);
    } catch (error) {
      console.error('Error copying database:', error.message);
    }
  });

  /**useful funtion
   *  const html = await page.evaluate(() => document.body.innerHTML);
        console.log(html);
   */


  
  test('here a students tries to apply for a thesis that he has already applied for', async () => {
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
    console.log("this is the number of rows", cells.length - 1); // Print the number of cells

    // await page.click(cellSelector);
    await page.click('a[href="/thesis/1"]');

    const titleSelector = 'div.border-bottom.pb-2.mb-4.card-title.h5';
    const title = await page.$eval(titleSelector, component => component.textContent);

    if (title != firstThesis) {
      throw new Error("The thesis is a different one");
    }


    await page.click("#dropdown-item-button");
    await page.click("#button-apply");
    
    await page.waitForSelector('div.fade.alert.alert-danger.alert-dismissible.show');
    const applySelector = 'div.fade.alert.alert-danger.alert-dismissible.show';
    if(!applySelector) throw new Error("No notification to the student");
  }, 1 * 60 * 1000);
 
  test('here a student applies for a thesis that he did not apply for succesfully', async () => {
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
    
      await page.waitForSelector('div.fade.alert.alert-success.alert-dismissible.show');
      const applySelector = 'div.fade.alert.alert-success.alert-dismissible.show';
      if(!applySelector) throw new Error("No notification to the student");
  }, 1 * 60 * 1000);
  
  test.skip('here a student filters the thesis list and then resets it', async () => {
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

      console.log('Numero di righe della tabella:', rowCount);
      expect(rowCount).to.equal(4);

      // Stampare il titolo della tesi nella prima riga
      const firstRowTitle = await page.$eval(`${tableSelector} tbody tr:first-child td:nth-child(2) a`, link => link.textContent);

      console.log('Titolo della tesi nella prima riga:', firstRowTitle);
      expect(firstRowTitle).to.equal('Sustainable Energy Sources Research');
    } else {
      console.error('Tabella non trovata sulla pagina.');
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
      await page.waitForSelector('table.table-striped.table-bordered.table-hover');

      // Get the number of rows after the search
      const rowCountAfterSearch = await page.$$eval('.table-responsive table tbody tr', rows => rows.length);

      // Assert that the search produced the expected results
      expect(rowCountAfterSearch).to.equal(0);
    } else {
      console.error('Selector or search button not found on the page.');
    }

    //reset the searching result
    const initialRowCount = await page.$$eval('table.table-striped.table-bordered.table-hover tbody tr', rows => rows.length);
    const resetButton = await page.$('#reset-button');

    if (resetButton) {
      page.click('#reset-button')
      console.log("Reset button clicked");
    } else {
      console.error('Element not found');
    }

    // Wait for the number of rows to change
    await page.waitForFunction((initialRowCount) => {
      const currentRowCount = document.querySelectorAll('table.table-striped.table-bordered.table-hover tbody tr').length;
      return currentRowCount !== initialRowCount;
    }, {}, initialRowCount);

    // Get the number of rows after the search
    const rowCountAfterReset = await page.$$eval('.table-responsive table tbody tr', rows => rows.length);
    // Assert that the search produced the expected results
    expect(rowCountAfterReset).to.equal(4);


  }, 1 * 60 * 1000);
});


