exports.testCrawler = async (req, res) => {
    let udnCrawler = require(`${__dirname}/crawler/udnCrawler.js`)
    let udn = new udnCrawler()
    if(res.status(200)) {
        let infos = await udn.praseUdn()
        infos = JSON.stringify(infos)
        res.status(200).json(infos)
    } else {
        res.status(404).send("Fail")
    }
}