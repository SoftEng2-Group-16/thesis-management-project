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
    const buttonSelector = 'button.c1939bbc3.cc78b8bf3.ce1155df5.c1d2ca6e3.c331afe93';
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
  
    console.log(`Name of the first thesis: ${firstThesis}`);
    
    // Now 'cells' contains an array of all <td> elements in the table
    console.log("this is the number of rows", cells.length - 1); // Print the number of cells
  
    await page.click(cellSelector);
    
    const titleSelector = 'div.border-bottom.pb-2.mb-4.card-title.h5';
    const title = await page.$eval(titleSelector, component => component.textContent);
  
    if(title == firstThesis){
      
      console.log("The thesis is the same that we wanted");
    }else{
      console.log("The thesis is a different one");
    }
  
    await page.click("button.mt-3.ms-2.btn.btn-outline-danger")
    console.log("We returned to the thesis page and everything went fine")
  });

  test('a professor updates the first thesis', async () => {
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
    const buttonSelector = 'button.c1939bbc3.cc78b8bf3.ce1155df5.c1d2ca6e3.c331afe93';
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
    console.log("found!")
    await page.click('button.btn-close');

    await page.waitForSelector('table.table-striped.table-bordered.table-hover');
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
    if (allParagraphTexts.includes(`Expiration: ${formattedDate}`) && allParagraphTexts.includes(`Type: Abroad Thesis`) && 
    (titleChange == titleChanged) && keywordsChanged.includes(keywordsChange)) {
      console.log(`The data was changed correctly`);
    } else {
      throw new Error(`Some elements were not changed`);
    }
    
  }, 1 * 60 * 1000);

  test('a professor updates the first thesis but forgots to insert some needed data', async () => {

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
    const buttonSelector = 'button.c1939bbc3.cc78b8bf3.ce1155df5.c1d2ca6e3.c331afe93';
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
    console.log("The allert appeared and everything went fine")

  }, 1 * 60 * 1000);
});