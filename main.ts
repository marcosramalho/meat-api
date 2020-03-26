import * as restify from 'restify';

const server = restify.createServer({
  name: "meat-api",
  version: "0.1.0"
});

server.use(restify.plugins.queryParser());

server.get('/info', [
(req, res, next) => {
  if (req.userAgent() && req.userAgent().includes('MSIE 7.0')) {    
    let error: any = new Error();
    error.statusCode = 400;
    error.message = "Please, update your browser";

    return next(error);
  }
  
  return next();
}, (req, res, next) => {
  res.json({ 
    browser: req.userAgent(),
    method: req.method,
    url: req.href(),
    path: req.path(),
    query: req.query
  });
  return next();
}])

server.listen(3000, () => {
  console.log('API is running on http://localhost:3000');
});