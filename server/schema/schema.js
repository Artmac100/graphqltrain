const graphql = require("graphql");
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

const books = [
  { name: "Robinson Cruson", genre: "Adventure", id: "1" },
  { name: "Game of Thrones", genre: "Fantasy", id: "2" },
  { name: "The Little Riding Hood", genre: "FairyTale", id: "3" }
];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    genre: {
      type: GraphQLString
    }
  })
});

// const AuthorType = new GraphQLObjectType

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parent, args) {
        // code to get data from db
        return _.find(books, {id: args.id})
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
