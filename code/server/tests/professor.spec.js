const { type } = require('os');
const puppeteer = require('puppeteer');


describe('Professor tests', () => {
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
  

  test('a professor checks the first thesis', async () => {
    // Navigate the page to a URL
    await page.goto('http://localhost:5173/');

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});
  
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
    const tableSelector = 'table.table-striped.table-bordered.table-hover';
    
    
    let cells = await page.$$(`${tableSelector} tr`);
    cells = cells; 
  
    const rowIndex = 1;
    const columnIndex = 2;
  
    // Select the cell using CSS selector
    const cellSelector = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;
    const cellHandle = await page.$(cellSelector);
  
    // Use evaluate to get the text content of the cell
    const firstThesis = await page.evaluate(cell => cell.textContent, cellHandle);
      
    // Now 'cells' contains an array of all <td> elements in the table
  
    await page.click(cellSelector);
    
    const titleSelector = 'div.border-bottom.pb-2.mb-4.card-title.h5';
    const title = await page.$eval(titleSelector, component => component.textContent);
  
    if(!(title == firstThesis)){
      throw new Error("The thesis is a different one");
    }
    //return to home page
    await page.click("button.mt-3.ms-2.btn.btn-outline-danger")
  });

  test('a professor updates the Third thesis', async () => {
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
    const tableSelector = 'table.table-striped.table-bordered.table-hover';
    
    
    let cells = await page.$$(`${tableSelector} tr`);
    cells = cells; 
  
    const rowIndex = 3;
    const columnIndex = 2;
  
    // Select the cell using CSS selector (in this case the first thesis)
    const cellSelector = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;
  
    await page.click(cellSelector);
    
  
    await page.click("a.mt-3.ms-2.btn.btn-outline-primary")



    // Assume there's already some text in the text area
    const titleChange = 'New Title';
    const keywordsChange = 'Change';
    const typeChange = 'Abroad Thesis';

    // Changing the title
    await page.click(`#title`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#title`, titleChange);

    //changing the keywords
    await page.click(`#keywords`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#keywords`, keywordsChange);

    //changing the type
    await page.click(`#type`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#type`, typeChange);

    //changing the description
    await page.click(`#description`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#description`, 'New description.');

    //changing the notes
    await page.click(`#notes`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#notes`, 'New notes.');


    //changing the date
    await page.click(`input.mydatepicker`);
    // go to next month
    await page.click(`button.react-datepicker__navigation.react-datepicker__navigation--next`);
    //select day 24
    await page.click(`div.react-datepicker__day.react-datepicker__day--024`);


    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    
    await page.click('button.btn.btn-primary');

    await page.waitForSelector('div.fade.alert.alert-success.alert-dismissible.show');

    await page.click('button.btn-close');

    await page.waitForSelector('div.table-responsive');
    const cellSelector1 = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;
    await page.click(cellSelector1);
    
    //creating the date changed: is always the 24 of the next month
    const today = new Date();
    //adding one month
    today.setMonth(today.getMonth() + 1);
    const day = 24;
    const month = today.getMonth() + 1; // Months are zero-based, so add 1
    const year = today.getFullYear();

    const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;

    // Here i get all the elements that share the same style and show some basic informations
    const allParagraphTexts = await page.$$eval('p.mb-2.card-text', paragraphs => paragraphs.map(p => p.textContent));



    const titleChanged = await page.$eval('div.border-bottom.pb-2.mb-4.card-title.h5', element => element.textContent);
    const keywordsChanged = await page.$eval('p.mt-2.card-text', element => element.textContent);
    //here i check if the data is changed. If not throw an error
    if (!(allParagraphTexts.includes(`Expiration: ${formattedDate}`) && allParagraphTexts.includes(`Type: Abroad Thesis`) && 
    (titleChange == titleChanged) && keywordsChanged.includes(keywordsChange))) {
      throw new Error(`Some elements were not changed`);
    }
    
  }, 1 * 60 * 1000);

  test('a professor updates the third thesis but forgets to insert some needed data', async () => {

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
    const tableSelector = 'table.table-striped.table-bordered.table-hover';
    
    
    let cells = await page.$$(`${tableSelector} tr`);
    cells = cells; 
  
    const rowIndex = 3;
    const columnIndex = 2;
  
    // Select the cell using CSS selector (in this case the first thesis)
    const cellSelector = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;
  
    await page.click(cellSelector);
    
  
    await page.click("a.mt-3.ms-2.btn.btn-outline-primary")



    // Assume there's already some text in the text area
    const titleChange = 'New Title';
    const keywordsChange = 'Change';
    const typeChange = 'Abroad Thesis';

    // Forgetting the title
    await page.click(`#title`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
 

    //changing the keywords
    await page.click(`#keywords`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#keywords`, keywordsChange);



 


    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    
    await page.click('button.btn.btn-primary');

    await page.waitForSelector('div.fade.alert.alert-danger.alert-dismissible.show');

  }, 1 * 60 * 1000);

  test('a professor tries to update a thesis with pending requests', async () => {
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
    const tableSelector = 'table.table-striped.table-bordered.table-hover';
    
    
    let cells = await page.$$(`${tableSelector} tr`);
    cells = cells; 
  
    const rowIndex = 1;
    const columnIndex = 2;
  
    // Select the cell using CSS selector (in this case the first thesis)
    const cellSelector = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;
  
    await page.click(cellSelector);
    
  
    await page.click("a.mt-3.ms-2.btn.btn-outline-primary")

    const alert = await page.waitForSelector('div.fade.alert.alert-danger.alert-dismissible.show');
    //here i check if the data is changed. If not throw an error
    if (!alert) {
      throw new Error(`We can change a thesis with pending requests`);
    }
    
  }, 1 * 60 * 1000);

  test('a professor copies the first thesis', async () => {
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
    const tableSelector = 'table.table-striped.table-bordered.table-hover';
    
    
    const numberOfRows1 = await page.$$eval('table.table-striped.table-bordered.table-hover tr', rows => rows.length);

    const rowIndex = 1;
    const columnIndex = 2;
  
    // Select the cell using CSS selector (in this case the first thesis)
    const cellSelector = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;
  
    await page.click(cellSelector);
    
  
    await page.click("a.mt-3.ms-2.btn.btn-outline-success")

    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    
    await page.click('button.btn.btn-primary');

    await page.waitForSelector('div.fade.alert.alert-success.alert-dismissible.show');

    await page.click('button.btn-close');

    await page.waitForSelector('table.table-striped.table-bordered.table-hover');



    // Use page.$$eval to get text content of all cells in the second column
    const textInSecondColumn = await page.$$eval('table.table-striped.table-bordered.table-hover tr td:nth-child(2)', cells =>
    cells.map(cell => cell.textContent.trim())
    );
    //getting the new number of rows that should be the previous one + 1
    const numberOfRows2 = await page.$$eval('table.table-striped.table-bordered.table-hover tr', rows => rows.length);

    //it does not consider the headers so it's minus 1 for the textInSecondColumn
    const copiedPosition = textInSecondColumn.length -1;
    if(((numberOfRows1 + 1) != numberOfRows2) || (textInSecondColumn[0] != textInSecondColumn[copiedPosition])){
      throw new Error("The thesis was not added or is a different one")
    }

    
  }, 1 * 60 * 1000);

  test('a professor copies the first thesis changing some parameters', async () => {
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
    const tableSelector = 'table.table-striped.table-bordered.table-hover';
    
    
    const numberOfRows1 = await page.$$eval('table.table-striped.table-bordered.table-hover tr', rows => rows.length);

    const rowIndex = 1;
    const columnIndex = 2;
  
    // Select the cell using CSS selector (in this case the first thesis)
    const cellSelector = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;
  
    await page.click(cellSelector);
    
  
    await page.click("a.mt-3.ms-2.btn.btn-outline-success")

        // Assume there's already some text in the text area
    const titleChange = 'New Title Copy';
    const keywordsChange = 'Change';
    const typeChange = 'Abroad Thesis';

    // Changing the title
    await page.click(`#title`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#title`, titleChange);

    //changing the keywords
    await page.click(`#keywords`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#keywords`, keywordsChange);

    //changing the type
    await page.click(`#type`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#type`, typeChange);

    //changing the description
    await page.click(`#description`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#description`, 'New description.');

    //changing the notes
    await page.click(`#notes`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#notes`, 'New notes.');


    //changing the date
    await page.click(`input.mydatepicker`);
    // go to next month
    await page.click(`button.react-datepicker__navigation.react-datepicker__navigation--next`);
    //select day 24
    await page.click(`div.react-datepicker__day.react-datepicker__day--024`);

    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    
    await page.click('button.btn.btn-primary');

    await page.waitForSelector('div.fade.alert.alert-success.alert-dismissible.show');

    await page.click('button.btn-close');

    await page.waitForSelector('table.table-striped.table-bordered.table-hover');



    // Use page.$$eval to get text content of all cells in the second column
    const textInSecondColumn = await page.$$eval('table.table-striped.table-bordered.table-hover tr td:nth-child(2)', cells =>
    cells.map(cell => cell.textContent.trim())
    );
    //getting the new number of rows that should be the previous one + 1
    const numberOfRows2 = await page.$$eval('table.table-striped.table-bordered.table-hover tr', rows => rows.length);

    //it does not consider the headers so it's minus 1 for the textInSecondColumn
    const copiedPosition = textInSecondColumn.length -1;

    if(((numberOfRows1 + 1) != numberOfRows2) || (textInSecondColumn[0] == textInSecondColumn[copiedPosition])){
      throw new Error("The thesis was not added or is a exact copy of the other one")
    }

    //now i check the elements of the thesis (it's alway the last thesis) 
    const cellSelector1 = `${tableSelector} tr:nth-child(${textInSecondColumn.length}) td:nth-child(${2})`;
    await page.click(cellSelector1);
    
    //creating the date changed: is always the 24 of the next month
    const today = new Date();
    //adding one month
    today.setMonth(today.getMonth() + 1);
    const day = 24;
    const month = today.getMonth() + 1; // Months are zero-based, so add 1
    const year = today.getFullYear();

    const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;

    // Here i get all the elements that share the same style and show some basic informations
    const allParagraphTexts = await page.$$eval('p.mb-2.card-text', paragraphs => paragraphs.map(p => p.textContent));



    const titleChanged = await page.$eval('div.border-bottom.pb-2.mb-4.card-title.h5', element => element.textContent);
    const keywordsChanged = await page.$eval('p.mt-2.card-text', element => element.textContent);
    //here i check if the data is changed. If not throw an error
    if (!(allParagraphTexts.includes(`Expiration: ${formattedDate}`) && allParagraphTexts.includes(`Type: Abroad Thesis`) && 
    (titleChange == titleChanged) && keywordsChanged.includes(keywordsChange))) {
      throw new Error(`Some elements were not changed`);
    }
    
  }, 1 * 60 * 1000);

  test('a professor copies the first thesis changing some parameters but deleting some', async () => {
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
    const tableSelector = 'table.table-striped.table-bordered.table-hover';
    
    
    const numberOfRows1 = await page.$$eval('table.table-striped.table-bordered.table-hover tr', rows => rows.length);

    const rowIndex = 1;
    const columnIndex = 2;
  
    // Select the cell using CSS selector (in this case the first thesis)
    const cellSelector = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;
  
    await page.click(cellSelector);
    
  
    await page.click("a.mt-3.ms-2.btn.btn-outline-success")

        // Assume there's already some text in the text area
    const titleChange = 'New Title Copy';
    const keywordsChange = 'Change';
    const typeChange = 'Abroad Thesis';

    // Changing the title but i forget to put it
    await page.click(`#title`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');


    //changing the keywords
    await page.click(`#keywords`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#keywords`, keywordsChange);

    //changing the type
    await page.click(`#type`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#type`, typeChange);

    //changing the description
    await page.click(`#description`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#description`, 'New description.');

    //changing the notes
    await page.click(`#notes`);
    await page.keyboard.down('Control');
    await page.keyboard.press('A'); // Select all text
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await page.type(`#notes`, 'New notes.');


    //changing the date
    await page.click(`input.mydatepicker`);
    // go to next month
    await page.click(`button.react-datepicker__navigation.react-datepicker__navigation--next`);
    //select day 24
    await page.click(`div.react-datepicker__day.react-datepicker__day--024`);

    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    
    await page.click('button.btn.btn-primary');

    await page.waitForSelector('div.fade.alert.alert-danger.alert-dismissible.show');
    
  }, 1 * 60 * 1000);

  test('a professor archives a thesis and does all the checks', async () => {
    //here i added some waits since some elemnts can or cannot be present so we wait the right time to render the elements
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
    const tableSelector = 'table.table-striped.table-bordered.table-hover';
    
    
    const rowIndex = 1;
    const columnIndex = 2;
    const numberOfRowsActive1 = await page.$$eval('table.table-striped.table-bordered.table-hover tr', rows => rows.length);

    // Use the name of the archived thesis
    const thesisName = await page.$eval(
      `table.table-striped.table-bordered.table-hover tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`,
      cell => cell.textContent.trim()
    );
    
    //checking if there are some pending proposals
    await page.click('#applications');
    await page.waitForSelector('table.table-striped.table-bordered.table-hover');

    // Used to save the name of the thesis
    let textInThirdColumn = await page.$$eval('table.table-striped.table-bordered.table-hover tr td:nth-child(3)', cells =>
      cells.map(cell => cell.textContent.trim())
      );
    //used to see the status
    let textInSixthColumn = await page.$$eval('table.table-striped.table-bordered.table-hover tr td:nth-child(6)', cells =>
      cells.map(cell => cell.textContent.trim())
      );
    let counterPending = 0;

    //incrementing the counter for each pending request for the first thesis
    textInThirdColumn.forEach((value, index) => {
      if(value == thesisName){

        //we have also to count the rejected since in the end we don't know if previously it was rejected or pending
        //this was made in order to have a more general and working test so that we can test it for every thesis proposal
        if(textInSixthColumn[index] == "pending" || textInSixthColumn[index] == "rejected" ) counterPending++;
      }
    });
     
     

    //return back to my proposals
    await page.click('#my-proposals');
    //here we go to the archived and we save the number of archived thesis to compare then after
    await page.waitForTimeout(3000);
    await page.evaluate(() => {
      const label = document.querySelector('label[for="ArchivedProposals"]');
      label.click();
    });
    // Wait for 5 seconds (5000 milliseconds) so that we know that the table changes
    await page.waitForTimeout(3000);

    let numberOfRowsArchived1 = 1; //the header at least is considered
    const selectorExists = await page.$('table.table-striped.table-bordered.table-hover');
    if (selectorExists) {
      numberOfRowsArchived1 = await page.$$eval('table.table-striped.table-bordered.table-hover tr', rows => rows.length); 
    }
    //now we return back 
    await page.waitForTimeout(3000);  
    await page.evaluate(() => {
      const label = document.querySelector('label[for="activeProposals"]');
      label.click();
    });
    // Wait for 5 second (5000 milliseconds) so that we know that the table changes
    await page.waitForTimeout(3000);

    await page.waitForSelector('table.table-striped.table-bordered.table-hover');

    // Select the cell using CSS selector (in this case the first thesis)
    const cellSelector = `${tableSelector} tr:nth-child(${rowIndex}) td:nth-child(${columnIndex})`;
    //opening the first thesis page and archieving it
    await page.click(cellSelector);

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    //archive thesis
    await page.click('button.mt-3.ms-2.btn.btn-outline-warning');
    await page.click('#dialog-button-confirm');


    await page.waitForSelector('table.table-striped.table-bordered.table-hover');

    const numberOfRowsActive2 = await page.$$eval('table.table-striped.table-bordered.table-hover tr', rows => rows.length);
    //the new number of active has to be lower
    if(numberOfRowsActive1 != numberOfRowsActive2 +1) throw new Error("No thesis Archived");

    //here we go to the archived and we save the number of archived thesis to compare then after
    await page.waitForTimeout(3000); 
    await page.evaluate(() => {
      const label = document.querySelector('label[for="ArchivedProposals"]');
      label.click();
    });
    // Wait for one second (1000 milliseconds) so that we know that the table changes
    await page.waitForTimeout(3000); 

    await page.waitForSelector('table.table-striped.table-bordered.table-hover');
    const numberOfRowsArchived2 = await page.$$eval('table.table-striped.table-bordered.table-hover tr', rows => rows.length); 
    //the new number of archived has to be bigger
    if((numberOfRowsArchived1 +1) != numberOfRowsArchived2) throw new Error("No thesis Archived");

   
    await page.click('#applications');
    await page.waitForSelector('table.table-striped.table-bordered.table-hover');

    // Used to save the name of the thesis
    textInThirdColumn = await page.$$eval('table.table-striped.table-bordered.table-hover tr td:nth-child(3)', cells =>
      cells.map(cell => cell.textContent.trim())
      );
    //used to see the status
    textInSixthColumn = await page.$$eval('table.table-striped.table-bordered.table-hover tr td:nth-child(6)', cells =>
      cells.map(cell => cell.textContent.trim())
      ); 
    //decrementing the counter for each rejected request for the first thesis
    textInThirdColumn.forEach((value, index) => {
      if(value == thesisName){
        if(textInSixthColumn[index] == "rejected") counterPending--;
      }
    });
    //if it's 0 it's fine since we rejected all the pending requests    
    if(counterPending != 0) throw new Error("The applications were not rejected")
  }, 1 * 60 * 1000);
  
});