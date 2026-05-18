## Middlewares and Error Handlers in Express

# Route Handlers in Express

# Overview
In Express, route handlers are functions that handle requests to a specific endpoint. You can use multiple route handlers for a single route, control the flow with next, and even wrap handlers into arrays for better modularity.

## 1. Multiple Route Handlers
Express allows defining multiple route handlers for a single route. Each handler can execute different logic or perform different tasks before sending a response.

Example:
app.get('/example', (req, res, next) => {
  console.log('First handler');
  next(); // Pass control to the next handler
}, (req, res) => {
  res.send('Second handler');
});

In the above example:
The first handler logs a message and then calls next().
The second handler sends a response after the first one completes
Understanding next and next() in Express
Overview
In Express, next is a callback function that allows you to control the flow of middleware functions and route handlers. It helps in moving the request to the next middleware or route handler in the stack.

## 1. What is next?
next is a function provided by Express, used to pass control to the next middleware function or route handler.
It must be called within a middleware function for the request to proceed further.
If not called, the request will be left hanging, and the server won't send a response.

## 2. How to Use next()
Basic Usage:

app.get('/example', (req, res, next) => {
  console.log('First handler');
  next(); // Passes control to the next middleware function or route handler
}, (req, res) => {
  res.send('Second handler');
});
In the above example:

The first function logs a message and then calls next() to proceed to the next handler.

The second function sends a response after the first handler completes

## 3. Using next() to Skip Route Handlers in Express
In Express, you can use the next() function to pass control to the next middleware function or route handler. By passing the string 'route' as an argument to next(), you can skip the remaining route handlers for a particular route.

How to Use next('route') to Skip Handlers
When next('route') is called, Express will skip the remaining handlers for the current route and move on to the next matching route handler.

This is useful when certain conditions are met, and you want to bypass specific middleware or handlers.

Basic Usage:

app.get('/skip', (req, res, next) => {
  console.log('This handler will be skipped');
  next('route'); // Skips to the next matching route handler
}, (req, res) => {
  res.send('You will not see this response because the handler is skipped');
});

// Next matching route handler
app.get('/skip', (req, res) => {
  res.send('Skipped to this route handler');
});
Here, the second handler will be skipped, and the request will be passed directly to the third handler.