'use strict';

const axios = require('axios')
const log4js = require('log4js')
// const config = require('config')

// LOG-Config
log4js.configure({
    appenders: { file: { type: 'file', filename: 'logs.log' } },
    categories: { default: { appenders: ['file'], level: 'info' } }
});
const logger = log4js.getLogger()
logger.level = 'debug'

// Config
const { Client } = require('pg')
const client = new Client({
    connectionString: 'postgressql://recommender:pa_ws1920@127.0.0.1:5432/recommender_db'
})
client.connect()


/**
 * 
 * /POST servername/v1/login/
 * 
 **/
exports.loginPOST = function (body) {
    return new Promise(async function (resolve, reject) {
        try {
            const result = await client.query(`
                SELECT id
                FROM users
                WHERE email = ${body.email}
                AND password = ${body.pw}
            `)
            console.log(result.rows)

            if(result.rows.length > 0){
                resolve({ message: 'Successful', code: 204, result: result.rows })
            } else {
                resolve({ message: 'User does not exist', code: 400 })
            }
        } catch (err) {
            // Logging
            logger.error('loginPOST::: StatusCode:500, Error:', err); 
            reject({ message: err, code: 500 })
        }
    });
}

/**
 * 
 * /POST servername/v1/signin/
 * 
 **/
exports.signinPOST = function (body) {
    return new Promise(async function (resolve, reject) {
        try {
            const result = await client.query(`
                SELECT id
                FROM users
                WHERE email = '${body.email}'
            `)
            if(result.rows.length == 0){
                const resultSignin = await client.query(`
                    INSERT INTO users (email, firstname, surname, password)
                    VALUES ('${body.email}', '${body.name}', '${body.surname}', '${body.pw}')
                `)
                console.log('resultSignin:', resultSignin)
                resolve({ message: 'Successful Registration', code: 204, result: resultSignin })
            } else {
                resolve({ message: 'User already exist', code: 400 })
            }
        } catch (err) {
            // Logging
            logger.error('signinPOST::: StatusCode:500, Error:', err); 
            reject({ message: err, code: 500 })
        }
    });
}

/**
 * 
 * /GET servername/v1/article/
 * 
 **/
exports.articleGET = function (id, userId) {
    return new Promise(async function (resolve, reject) {
        try {
            const result = await client.query(`
                select articles.id, article, rating 
                from articles join ratings 
                on (articles.id = ratings.article_id) 
                and articles.id = ${id}
                and ratings.user_id = ${userId}
            `)
            resolve({ message: 'Successful Insertion', code: 204, result: result.rows[0] })
        } catch (err) {
            // Logging
            logger.error('articleGET::: StatusCode:500, Error:', err);
            reject({ message: err, code: 500 })
        }
    });
}

/**
 * 
 * /GET servername/v1/recommendations/
 * 
 **/
exports.recommendationsGET = function (userId) {
    return new Promise(async function (resolve, reject) {
        try {
            const result = await axios.get(`http://localhost:5001/v1/recommender/${userId}`)
            console.log(result)
            resolve({ message: 'Successful Insertion', code: 204 , result: result.data.result})
        } catch (err) {
            // Logging
            logger.error('recommendationsGET::: StatusCode:500, Error:', err);
            reject({ message: err, code: 500 })
        }
    });
}

/**
 * 
 * /GET servername/v1/search/
 * 
 **/
exports.searchGET = function (name, userId) {
    return new Promise(async function (resolve, reject) {
        try {
            const result = await axios.get(`http://localhost:5000/v1/search/${userId}/${name}`)
            resolve({ message: 'Successful Insertion', code: 204 , result: result.data.result})
        } catch (err) {
            // Logging
            logger.error('searchGET::: StatusCode:500, Error:', err);
            reject({ message: err, code: 500 })
        }
    });
}

/**
 * 
 * /PATCH servername/v1/rate/
 * 
 **/
exports.ratePATCH = function (body) {
    return new Promise(async function (resolve, reject) {
        try {
            const result = await client.query(`
                INSERT INTO ratings (user_id, article_id, rating) 
                VALUES (${body.userId}, ${body.id}, '${body.stars}') 
                ON CONFLICT (user_id, article_id) 
                DO UPDATE SET rating = '${body.stars}';
            `)
            resolve({ message: 'Successful Insertion/Update', code: 204 })
        } catch (err) {
            // Logging
            logger.error('ratePATCH::: StatusCode:500, Error:', err);
            reject({ message: err, code: 500 })
        }
    });
}
