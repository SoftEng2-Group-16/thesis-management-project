const puppeteer = require('puppeteer');

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('http://localhost:5173/');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  //this below is the mocked login for the student
  await page.waitForSelector('#username');
  // use # for the id
  await page.type('#username', 'mario.rossi@studenti.polito.it');
  await page.type('#password', '200001');
  const buttonSelector = 'button.c320322a4.c480bc568.c20af198f.ce9190a97.cbb0cc1ad';
  await page.click(buttonSelector);


  //await page.click('#submit');

  //await browser.close();

  /* Type into search box
  

  // Wait and click on first result
  const searchResultSelector = '.search-box__link';
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  // Locate the full title with a unique string
  const textSelector = await page.waitForSelector(
    'text/Customize and automate'
  );
  const fullTitle = await textSelector?.evaluate(el => el.textContent);

  // Print the full title
  console.log('The title of this blog post is "%s".', fullTitle);
    */
  //await browser.close();
})();