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
    undURLs(page) {
        let URLs = [];
        for(let i = 0; i <= page; i++) {
            let accurate_url = `https://udn.com/news/breaknews/1/${i}`;
            URLs.push({
                page:i,
                url:accurate_url})
        }
        return URLs
    }

    /**
     * Main Crawler Function
     * @param {list} URLs
     */
    async praseUdn() {
        try {
            let URLs = this.undURLs(1)
            
            let datas =[]
            for(let element of URLs) {
                let options = {
                    uri:element.url,
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