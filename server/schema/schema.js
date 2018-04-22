const graphql = require("graphql");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;

const books = [
  { name: "Robinson Cruson", genre: "Adventure", id: "1", authorid: "1" },
  { name: "Game of Thrones", genre: "Fantasy", id: "2", authorid: "2" },
  { name: "Song of Ice and Flame", genre: "Fantasy", id: "2", authorid: "2" },
  { name: "Mermaid", genre: "Fantasy", id: "2", authorid: "3" },
  { name: "The Little Riding Hood", genre: "FairyTale", id: "3", authorid: "3" }
];

const authors = [
  { name: "Danile Defoe", age: 30, id: "1" },
  { name: "George Martin", age: 70, id: "2" },
  { name: "Sharle Peroe", age: 40, id: "3" }
];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    genre: {
      type: GraphQLString
    },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // console.log(parent)
        return _.find(authors, { id: parent.authorid });
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    age: {
      type: GraphQLInt
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { authorid: parent.id })
      }
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
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        // code to get data from db
        console.log(typeof args.id);
        return _.find(books, { id: args.id });
      }
    },
    author: {
      type: AuthorType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
