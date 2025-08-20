import fs from "fs";
import { chromium } from "playwright";

const subUrls = [
    'hachapuri', 
    'vygodnoe-kombo', 
    'sezonnoe-predlozhenie', 
    'na-uglyah', 
    'mini-hinkali', 
    'hinkali-otvarnye', 
    'hinkali-zharenye', 
    'klassika-gruzii', 
    'salaty', 
    'goryachie-blyuda', 
    'garniry', 
    'supy', 
    'deserty', 
    'sousy', 
    'sousy-k-mini-hinkali', 
    'dlya-detey', 
    'napitki', 
    'dlya-samyh-blizkih', 
    'polufabrikat'
];

const getDataFromPage = async (url, page) => {
    await page.goto(url, { waitUntil: 'domcontentloaded' }); 
    await page.waitForSelector('.production__item-content');

    const pageData = await page.$$eval(".production__item-content", items =>
        items.map(item => ({
            name: item.querySelector('.production__item-title')?.textContent.trim(),
            price: item.querySelector('.price-value')?.textContent.trim(),
        }))
    );
    return pageData;
};

const getData = async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    let dataAll = [];

    for (let i =0; i < subUrls.length; i++) {
        const pageData = await getDataFromPage(`https://djari.ru/msk/${subUrls[i]}`, page);
        dataAll.push(...pageData);
    }
    const data = dataAll.flat();
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    console.log('Данные получены, сохранены в файл data.json');

    await browser.close(); 
}

getData();