const graphql = require('graphql');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { secret } = require('../config');

const Book = require('../models/book');
const Author = require('../models/author');
const User = require('../models/user');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const BookType = new GraphQLObjectType({
  name: 'Book',
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
        // return _.find(authors, { id: parent.authorid });
        return Author.findById(parent.authorId);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
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
        // return _.filter(books, { authorid: parent.id })
        return Book.find({
          authorId: parent.id
        });
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'Users',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    username: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    password: {
      type: GraphQLString
    },
    token: {
      type: GraphQLString
    }
  })
});

// const AuthorType = new GraphQLObjectType

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
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
        // return _.find(books, { id: args.id });
        return Book.findById(args.id);
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
        // return _.find(authors, { id: args.id });
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books;
        return Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors;
        return Author.find({});
      }
    }
  }
});

const Mutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        },
        age: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        },
        genre: {
          type: new GraphQLNonNull(GraphQLString)
        },
        authorId: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(parent, args) {
        const book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    },
    registration: {
      type: UserType,
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString)
        },
        email: {
          type: new GraphQLNonNull(GraphQLString)
        },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, args) => {
        const { username, email, password } = args;
        const hashedPassword = await bcrypt.hash(password, 14);

        const user = new User({
          username,
          email,
          hashedPassword
        });

        return user.save();
      }
    },
    login: {
      type: new GraphQLObjectType({
        name: 'login',
        fields: {
          token: { type: GraphQLString },
          username: { type: GraphQLString },
        }
      }),
      args: {
        usernameOrEmail: {
          type: new GraphQLNonNull(GraphQLString)
        },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, args, ctx) => {
        const user = await User.findOne({
          $or: [{ username: args.usernameOrEmail }, { email: args.user }]
        });

        if (!user) {
          throw new Error('Not user with that email');
        }

        const valid = await bcrypt.compare(args.password, user.hashedPassword);

        if (!valid) {
          throw new Error('Invalid Password');
        }

        ctx.username = user.username;
        ctx.token = jwt.sign({ user: _.pick(user, ['id', 'username']) }, secret, { expiresIn: '1d' });

        return ctx;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations
});
