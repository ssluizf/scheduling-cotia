require('dotenv').config();
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://agendamentocotia.saudesimples.net/");
  page.setDefaultNavigationTimeout(60000);

  try {
    await page.click('[id="inputUnchecked"]');
    await page.click('button');
    await page.waitForNavigation();
    await page.type('[name="input_login"]', process.env.HEALTH_LOGIN);
    await page.type('[name="input_birthday"]', process.env.HEALTH_BIRTHDAY);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    await page.waitForSelector('div[class="media"]');
    await page.click('div[class="media"]');
    await page.waitForFunction("document.getElementsByClassName('media').length === 2");
    await page.evaluate(() => {
      let elements = document.getElementsByClassName('media');
      elements.item(1).click();
    });
    await page.waitForSelector('div[class="placeholder_vagas mx-auto mt-4"]');
    console.log("Doses esgotadas neste momento, aguardar abertura de nova agenda.");

  } catch {
    console.log("Possivelmente tem dose! Confirma lá no site.");
  } finally {
    browser.close()
  }
  
})()