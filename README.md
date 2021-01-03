## Teamfinder exam application with GraphQL

The client repo can be found [here](https://github.com/dublo144/fsjs-teamfinder-client-graphql)

---

**Main Idea:**
Teamfinder is an GeoTracking application that allows users to create an account and use geo location to find other players nearby, posts with assignments within game areas etc.

## Technologies used

### Typescript

The project is developed in Typescript. Typescript is a suberset of JavaScript that enables strong types in an otherwise dynamically typed language.
I did not like it to begin with, buuut I kind of grows on you.

### GraphQL

A regular REST-interface often leads to over- or underfetching. A part of the assignment was to implement GraphQL instead.
Besides taylored queries, GraphQL provides schemas, typesafety etc.

### Mongoose

Just like we used jpa on the previous semester, I introduced Mongoose to achive the same functionality with JS. Mongoose is an ODM and allows me to get even better typesafety with schemas and models.
Mongoose also allows me to create the connection to the database _once_ in [app.ts](https://github.com/dublo144/fsjs-teamfinder-backend-graphql/blob/master/src/app.ts). Getting Mongoose and Typescript to work together was quite a hassle, but its nicer to work with models than straight on the collections.

### MongoDB running in Atlas cluster

### Authentication driven by JWT and Middleware

The old way of authenticating by essentially signing in on every request was inefficient.
I refactored to use a JWT style approach. The token is issued when the user signs in, and contains all the user-information - except password of course.

On every request the [authMiddleware.ts](https://github.com/dublo144/fsjs-teamfinder-backend-graphql/blob/master/src/middlewares/authMiddleware.ts) will check for an 'Authentication'-header. If the header is present, the token will be decoded and the user object will be set on the request.

It does not throw an error if theres no token. In that case, no user object is set on the request, and it is the job of the functions that require authentication to check, and potentially throw an error.

### Testing with Mocha and Chai
