const cheerio = require('cheerio');
const moment = require('moment');

function mainPrase(html) {
    let $ = cheerio.load(html)
    let infos = []
    $('section.cate-list div.story-list__news').each(function (index, element){
        let info={}
        info.titles = $(element).find('.story-list__text p').text().trim()
        info.content = $(element).find('div.story-list__text p').text().trim()
        info.url = `https://udn.com/${$(element).find('.story-list__text h2 a').attr('href')}`
        info.datetime_pub = moment($(element).find('.story-list__time').text().trim(), 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss')
        infos.push(info)
    })
    return infos;
}

module.exports = {mainPrase};