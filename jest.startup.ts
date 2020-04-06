import * as jestCli from 'jest-cli'
import { environment } from './common/environment';
import { Server } from './server/server';

import { User } from './users/users.model';
import { Review } from './reviews/reviews.model';
import { Restaurant } from './restaurants/restaurants.model';

import { reviewsRouter } from './reviews/reviews.router';
import { usersRouter } from './users/users.router';
import { restaurantsRouter } from './restaurants/restaurants.router';

let server: Server

const beforeAllTests = () => {
  environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test'
  environment.server.port = process.env.SERVER_PORT || 3001  
  server = new Server()
  return server
  .bootstrap([usersRouter, reviewsRouter, restaurantsRouter])
  .then(() => User.remove({}).exec())
  .then(() => {
    let admin = new User()
    admin.name = "admin"
    admin.email = "admin@email.com"
    admin.password = "admin"
    admin.profiles = ["admin", "user"]

    return admin.save()
  })
  .then(() => Review.remove({}).exec())
  .then(()=> Restaurant.remove({}).exec())
  .catch(console.error)
}

const afterAllTests = () => {
  return server.shutdown()
}

beforeAllTests()
.then(() => jestCli.run())
.then(() => afterAllTests())
.catch(console.error)