import * as restify from 'restify';

const server = restify.createServer({
  name: "meat-api",
  version: "0.1.0"
});

server.get('/', (req, res, next) => {
  res.json({message: 'hello'});
  return next();
})

server.listen(3000, () => {
  console.log('API is running on http://localhost:3000');
});