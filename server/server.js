const express = require('express');
const path = require('path');
const db = require('./config/connection');

// import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas')

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs, 
  resolvers,
    // make updated request object (with .user) available to the resolvers as the context.
    context: authMiddleware
});

// integrate our Apollo server with the Express application as middleware
server.applyMiddleware({ app })

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// wildcard route 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`));
});
