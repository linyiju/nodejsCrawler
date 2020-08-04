# GCP with Node.js Crawler
A crawler project which deploy on [Google Could Function](https://cloud.google.com/functions).

## Installation
```
$ npm install 
```

## Google Could Setting
- Create a google account and sign in [Goole Cloud](https://cloud.google.com/)
- In your project, making a file called `index.js` in your function's root directory 
```
.
|--index.js
```

[Reference](https://cloud.google.com/functions/docs/quickstart-nodejs)

- You invoke HTTP functions from standard HTTP requests. 
```node.js
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
```
[Reference](https://cloud.google.com/functions/docs/writing#http_functions)

- The other steps you can see the official document.
  - [Node.js](https://cloud.google.com/functions/docs/quickstart-nodejs)
  - [Python](https://cloud.google.com/functions/docs/quickstart-python)
