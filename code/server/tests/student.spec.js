const puppeteer = require('puppeteer');


describe('Student test', () => {
  let browser;
  let page;

  beforeAll(async () => {  
    // Launch the browser and open a new blank page
    //with headless:false we show the chromium browser
    //with headless:true we don't show the browser running, just the result
    browser = await puppeteer.launch( {headless: true});
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('here a students tries to apply for a thesis that he has already applied for', async () => {
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

    
    console.log("Applying for a thesis that we have already applied")

    await page.click("button.mt-3.btn.btn-success")
    await page.waitForSelector('div.fade.alert.alert-danger.alert-dismissible.show');
    const applySelector = 'div.fade.alert.alert-danger.alert-dismissible.show';
    const result = await page.$eval(applySelector, component => component.textContent);
    console.log(result)


    await page.click("button.mt-3.ms-2.btn.btn-danger")
    console.log("We returned to the thesis page and everything went fine")
  });
});


