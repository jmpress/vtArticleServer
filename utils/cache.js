const NodeCache = require( "node-cache" );
const cache = new NodeCache({stdTTL: 300});

function getCacheKey(req) {
  const cacheKey = req.url;
  console.log(cacheKey);
  return cacheKey
}

function set(req, res, next){
    const cacheKey = getCacheKey(req);
    const value = res.locals.data;
    cache.set(cacheKey, value)
}

function get(req, res, next){
    const cacheKey = getCacheKey(req)
    const content = cache.get(cacheKey)
    if(content){
      return content;
    } else {
      return null;
    }
}

function clear(req, res, next){
  const cacheKey = getCacheKey(req);
  cache.set(cacheKey, null);
}

module.exports = { set, get, clear }