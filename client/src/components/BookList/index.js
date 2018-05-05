import React, { Component } from 'react';
import { graphql } from 'react-apollo';


import { getBooksQuery } from '../../queries';

class BookList extends Component {
  state = {
    selected: null,
  }

  chooseBook = id => this.props.history.push(`/book/${id}`);

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data) {
      console.log(this.props);
    }
  }

  displayBooks = () => {
    const { data } = this.props;
    if (data.loading) return <div>Loading books...</div>;

    return data.books.map(book => {
      return <li key={book.id} onClick={e => this.chooseBook(book.id)}>{book.name}</li>
    })
  };
  render() {
   
    return (
      <div>
        <ul className="book-list">
          {this.displayBooks()}
        </ul>
      </div>
    );
  }
}

export default graphql(getBooksQuery)(BookList);
