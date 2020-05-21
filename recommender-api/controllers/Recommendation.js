'use strict';

const utils = require('../utils/writer.js');
const RecommendationService = require('../service/RecommendationService');


// /POST servername/v1/login
module.exports.loginPOST = (req, res) => {
    const body = req.swagger.params['body'].value;
    RecommendationService.loginPOST(body).then((response) => {
        utils.writeJson(res, response);
    }).catch((response) => {
        utils.writeJson(res, response.message, response.statusCode);
    });
};

// /POST servername/v1/signin
module.exports.signinPOST = (req, res) => {
    const body = req.swagger.params['body'].value;
    RecommendationService.signinPOST(body).then((response) => {
        utils.writeJson(res, response);
    }).catch((response) => {
        utils.writeJson(res, response.message, response.statusCode);
    });
};

// /GET servername/v1/recommendations
module.exports.recommendationsGET = (req, res) => {
    const userId = req.swagger.params['userId'].value;
    RecommendationService.recommendationsGET(userId).then((response) => {
        utils.writeJson(res, response);
    }).catch((response) => {
        utils.writeJson(res, response.message, response.statusCode);
    });
};

// /GET servername/v1/article
module.exports.articleGET = (req, res) => {
    const id = req.swagger.params['id'].value;
    const userId = req.swagger.params['userId'].value;
    RecommendationService.articleGET(id, userId).then((response) => {
        utils.writeJson(res, response);
    }).catch((response) => {
        utils.writeJson(res, response.message, response.statusCode);
    });
};

// /GET servername/v1/article
module.exports.searchGET = (req, res) => {
    const name = req.swagger.params['name'].value;
    const userId = req.swagger.params['userId'].value;
    RecommendationService.searchGET(name, userId).then((response) => {
        utils.writeJson(res, response);
    }).catch((response) => {
        utils.writeJson(res, response.message, response.statusCode);
    });
};

// /GET servername/v1/article
module.exports.ratePATCH = (req, res) => {
    const body = req.swagger.params['body'].value;
    RecommendationService.ratePATCH(body).then((response) => {
        utils.writeJson(res, response);
    }).catch((response) => {
        utils.writeJson(res, response.message, response.statusCode);
    });
};
