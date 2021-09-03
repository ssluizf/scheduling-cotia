require("dotenv").config();
const puppeteer = require("puppeteer");

async function checkVaccination(page) {
  let hasVaccin = false;

  try {
    await page.click('[id="inputUnchecked"]');
    await page.click("button");
    await page.waitForNavigation();
    await page.type('[name="input_login"]', process.env.HEALTH_LOGIN);
    await page.type('[name="input_birthday"]', process.env.HEALTH_BIRTHDAY);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    await page.waitForSelector('div[class="media"]');
    await page.click('div[class="media"]');
    await page.waitForFunction(
      "document.getElementsByClassName('media').length === 2"
    );
    await page.evaluate(() => {
      let elements = document.getElementsByClassName("media");
      elements.item(1).click();
    });
    await page.waitForSelector('div[class="placeholder_vagas mx-auto mt-4"]');
    console.log("\x1b[31m%s\x1b[0m", "\nDoses esgotadas neste momento, aguardar abertura de nova agenda.");
  } catch {
    console.log("\x1b[32m%s\x1b[0m", "\nPossivelmente tem dose!");
    hasVaccin = true;
  } finally {
    await page.screenshot({
      path: "./screenshot.png",
      fullPage: true,
    });
    console.log("Confirma aí! Dá uma olhada na screenshot do site dentro dessa pasta.\n");
  }

  return hasVaccin
}

function waitFor(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let hasVaccin = false;

  await page.goto("https://agendamentocotia.saudesimples.net/");

  hasVaccin = await checkVaccination(page);

  while (!hasVaccin) {
    await waitFor(900000);
    await page.goto("https://agendamentocotia.saudesimples.net/");
    hasVaccin = await checkVaccination(page);
  }

  browser.close();
})();
