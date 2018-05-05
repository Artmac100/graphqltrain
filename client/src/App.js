import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import BookList from './components/BookList';
import AddBook from './components/AddBook';
import BookDetails from './components/BookDetails';

// apollo client setting
const client = new ApolloClient({
  uri: '/graphql'
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
        <div className="main">
          <div className="header">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/addBook">Add book</Link></li>
            </ul>
          </div>
          <div className="routes">
            <Route exact path='/' component={BookList} />
            <Route path='/addBook' component={AddBook} />
            <Route path='/book/:id' component={BookDetails} />
          </div>

        </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
