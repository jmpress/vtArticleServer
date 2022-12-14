/*
X    An endpoint to retrieve all articles.
O    An endpoint to retrieve an article by ID (this should include the articles comments).
X    An endpoint to add comments to a specific article.
*/

const express = require('express');
const Router = require('express-promise-router');
const { ObjectId } = require('mongodb');
const articleRouter = new Router();
//const articleCache = require('../utils/cache');
const db = require('../db/db');
const { sanitizeInput, normalizeAPIResponse } = require('../utils/utils');



articleRouter.get('/', async (req, res, next) => {
    const dbConnect = await db.connectToCluster();
    const dbName = dbConnect.db('vt-blog');
    const colName = dbName.collection('articles');
    articles = await colName.find({}).sort({_id: -1}).toArray();
    await dbConnect.close()
    
    //convert array of documents into JSON:API standard
    normalizedArticles = normalizeAPIResponse(articles);
    
    res.status(200).send(normalizedArticles); 
});

articleRouter.get('/:id', async (req, res, next) => {  
    let target=req.params.id;
    //find article by ID
    const dbConnect = await db.connectToCluster();
    const dbName = dbConnect.db('vt-blog');
    const colName = dbName.collection('articles');
    targetArticle = await colName.findOne({_id: ObjectId(target)});
    await dbConnect.close();
    res.status(200).send(targetArticle);
});

/*
articleRouter.post('/comment/new', validatecomment, async (req, res, next) => {
    const { newCom, userID, articleID } = req.body;
    const usercomment = {
        commentContent: newCom,
        articleID,
        commenterID: userID,
        rating: 0
    }
    const newcomment = await db.comment.create(usercomment);
    req.url = `/${articleID}`;
    console.log(req.url);
    articleCache.clear(req, res, next);
    res.redirect(`/article/${articleID}`)
});
*/

/* further work
articleRouter.put('/comment/rate/:id', (req, res, next) => {
    //I need to reference both the comment ID and the new rating to add; what's the best way to pass this data in? probably ?id=x&?rating=y
    
    //find comment with id
    
    res.status(200).send();
});



articleRouter.delete('/delete', (req, res, next) => {
    //delete an article from the database, along with all its comments.
});

articleRouter.delete('/comment/delete', (req, res, next) => {
    //delete a single comment.
});

*/

function validateComment(req, res, next){
    const questionableComment = req.body.newCom;
    const cleanCom = sanitizeInput(questionableComment, 255);
    req.body.newCom = cleanCom;
    next();
}

module.exports = articleRouter;
