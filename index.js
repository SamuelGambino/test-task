import fs from "fs"; // Импортирую модуль файловой системы
import { chromium } from "playwright"; // Импортирую конкретно хромиум из библиотеки playwright

const subUrls = [ // Решил записать в массив все страницы товаров
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

const getDataFromPage = async (url, page) => { // Функция получения данных с одной страницы
    await page.goto(url, { waitUntil: 'domcontentloaded' });  // Открываю переданный url
    await page.waitForSelector('.production__item-content'); // Ожидаю пока появится на странице необходимый элемент с указанным классом 
    const locator = page.locator('.production__item-content'); // Записал в переменную класс необходимого элемента 
    
    const pageData = await locator.evaluateAll(items => // Получаю все необходимые элементы и перебираю
        items.map(item => ({
            name: item.querySelector('.production__item-title')?.textContent.trim(), // Получаю и записываю значение названия товара
            price: item.querySelector('.price-value')?.textContent.trim(), // Получаю и записываю значение цены товара
        }))
    );
    return pageData; // Возвращаю массив объектов, содержащий данные товаров со страницы
};

const getData = async () => { // Основная функция || Функция получения данных со всех страниц
    const browser = await chromium.launch({ headless: true }); // Запускаю хромиум без графического интерфейса
    const page = await browser.newPage(); // Открываю в нем новую страницу
    let dataAll = []; 

    for (let i =0; i < subUrls.length; i++) {
        const pageData = await getDataFromPage(`https://djari.ru/msk/${subUrls[i]}`, page); // Отправляю каждую страничку в getDataFromPage
        dataAll.push(...pageData); // Полученные данные добавляю в массив к остальным "выжатым" страницам
    }
    const data = dataAll.flat(); // "Раскрываю" хранящиеся массивы
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2)); // Создаю файл и записываю получившуюся строку, с красивым форматированием :)
    console.log('Данные получены, сохранены в файл data.json'); // Отчет в командную строку
    console.log('Выполнил Даниил Громыко :)'); // Авторство >:)

    await browser.close(); // Закрываю запущенный браузер
}

getData();