/*

X    An endpoint to retrieve all articles.
X    An endpoint to retrieve an article by ID (this should include the articles comments).
X    An endpoint to add comments to a specific article.

    
*/

const express = require('express');
const Router = require('express-promise-router');
const articleRouter = new Router();
//const articleCache = require('../utils/cache');
const db = require('../db/db');
const { sanitizeInput } = require('../utils/utils');



articleRouter.get('/all', async (req, res, next) => {
    const dbConnect = await db.connectToCluster();
    const dbName = dbConnect.db('vt-blog');
    const colName = dbName.collection('articles');
    articles = await colName.find({}).sort({_id: 1}).toArray();

    await dbConnect.close()
    res.render('articleBrowser', {article: articles}); 
});

articleRouter.route('/new')
    .get((req, res, next) => {
        res.render('newArticle') 
    })
    .post(async (req, res, next) => {
        const {title, sub_title, content} = req.body;
        const newArticle = {
            title,
            sub_title,
            date: new Date(),
            content
        }
        const dbConnect = await db.connectToCluster();
        const dbName = dbConnect.db('vt-blog');
        const colName = dbName.collection('articles');
        await colName.insertOne(newArticle);
        await dbConnect.close();

        res.redirect('/article/all');
    });

articleRouter.get('/:id', async (req, res, next) => {  
    let target=req.params.id;
    
    //find article by ID
        
    res.render('articleDetail', {article: targetArticle});
});

/*
articleRouter.post('/comment/new', validatecomment, async (req, res, next) => {
    const { newCap, userID, articleID } = req.body;
    const usercomment = {
        commentContent: newCap,
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

function validatecomment(req, res, next){
    const questionablecomment = req.body.newCap;
    const cleanCap = sanitizeInput(questionablecomment, 255);
    req.body.newCap = cleanCap;
    next();
}

module.exports = articleRouter;