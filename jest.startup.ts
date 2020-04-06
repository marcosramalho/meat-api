
import * as jestCli from 'jest-cli'
import { environment } from './common/environment';
import { Server } from './server/server';
import { User } from './users/users.model';
import { reviewsRouter } from './reviews/reviews.router';
import { usersRouter } from './users/users.router';
import { Review } from './reviews/reviews.model';

let server: Server

const beforeAllTests = () => {
  environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test'
  environment.server.port = process.env.SERVER_PORT || 3001  
  server = new Server()
  return server
  .bootstrap([usersRouter, reviewsRouter])
  .then(() => User.remove({}).exec())
  .then(() => Review.remove({}).exec())
  .catch(console.error)
}

const afterAllTests = () => {
  return server.shutdown()
}

beforeAllTests()
.then(() => jestCli.run())
.then(() => afterAllTests())
.catch(console.error)