import puppeteer from "puppeteer";

export async function getTopYappers(): Promise<string[]> {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto("https://yaps.kaito.ai", {
    waitUntil: "networkidle2",
    timeout: 180000,
  });

  const clickableSelector =
    "body > div:nth-of-type(3) > div:nth-of-type(1) > div > div:nth-of-type(5) > div:nth-of-type(1) > div:nth-of-type(2) > div > div:nth-of-type(1)";
  await page.waitForSelector(clickableSelector, {
    visible: true,
    timeout: 180000,
  });
  await page.click(clickableSelector);

  await page.waitForNetworkIdle({ timeout: 180000 });

  const tableSelector =
    "body > div:nth-of-type(3) > div:nth-of-type(1) > div > div:nth-of-type(5) > div:nth-of-type(2) > div > div:nth-of-type(1) > table";

  await page.waitForSelector(tableSelector, { visible: true, timeout: 180000 });
  const tableEl = await page.$(tableSelector);
  if (!tableEl) throw new Error("Table not found");

  const allUsernames = await page.evaluate((table: HTMLTableElement) => {
    const rows = table.querySelectorAll("tr");
    const results: string[] = [];

    rows.forEach((row, rowIndex) => {
      if (rowIndex === 0) return;

      const cells = row.querySelectorAll("td");
      if (cells.length > 0) {
        const text = cells[1]?.textContent?.trim() || "";
        const splitted = text.split("@")[1];
        if (splitted) {
          results.push(splitted);
        }
      }
    });

    return results;
  }, tableEl);

  await browser.close();

  return allUsernames;
}
