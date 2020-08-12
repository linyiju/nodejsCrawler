const rp = require('request-promise')
const parser = require(`${__dirname}/../parser/udn.js`)

class undCrawler {
    constructor(debug = false) {
        this.debug = debug
        this.crawler = 'udn'
    }

    /**
     * Generate udn URLs
     * @param {string} page
     */
    udnURLs(page) {
        let URLs = [];
        for(let i = 0; i <= page; i++) {
            let accurate_url = `https://udn.com/news/breaknews/${i}`;
            URLs.push(accurate_url)
        }
        return URLs
    }

    /**
     * Main Crawler Function
     * @page {string} page
     */
    async praseUdn(page) {
        let URLs
        try {
            if(undefined == page) {
                URLs = this.udnURLs(12)
            } else {
                URLs = [`https://udn.com/news/breaknews/${page}`]
            }
            let datas =[]
            for(let url of URLs) {
                let options = {
                    uri:url,
                    headers:{
                        'Accept':'text/html',
                        'Accept-charset':'utf8',
                        'Catch-Control' : 'max-page=0',
                        'Connection':'keep-alive',
                        'Accept-Language':'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
                        'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
                    }
                }
                let body = await rp(options)
                let infos = parser.mainPrase(body)
                
                for(let i = 0; i < infos.length; i++) {
                    let data = infos[i]
                    datas.push(data)
                }
            }
            return datas
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = undCrawler;