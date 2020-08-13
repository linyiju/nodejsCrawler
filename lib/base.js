const Promise = require('bluebird')
const mysql = require('mysql')
const fs = require('fs')
const config_temp = JSON.parse(fs.readFileSync(`${__dirname}/../config.json`))

/**
 * Read config.json
 */
function config() {
    return config_temp
}

/**
 * Connect MySQL
 * @param {config} 
 */
function mysqlPool(mysqlConfig) {
    try {
        let db = Promise.promisifyAll(mysql.createPool(mysqlConfig))
        return db
    } catch (e){
        throw new Error(e)
    }
}

/**
 * Save UserInfo into MySQL
 * @param {*} name 
 * @param {*} password 
 */
async function saveUser(name, password) {
    let db = mysqlPool(config().mysql.database)
    try {
        let userInfo = {
            user_name: name,
            user_password: password
        }
        await db.queryAsync("INSERT INTO userinfo SET ?", userInfo)
    } catch (e) {
        throw new Error(e)
    }
    await db.end()
}

/**
 * Identify Account
 * @param {*} name 
 */
async function getUserNumByName(name) {
    let db = mysqlPool(config().mysql.database)
    try {
        let existed = await db.queryAsync("SELECT * FROM userinfo WHERE user_name = ?", name)
        await db.end()
        return existed
    } catch (e) {
        throw new Error(e)
    }
}

module.exports = {
    config,
    mysqlPool,
    saveUser,
    getUserNumByName
}