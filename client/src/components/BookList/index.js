import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';

const getBooksQuery = gql`
  {
    books {
      name
      id
    }
  }
`;

class BookList extends Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data) {
      console.log(this.props.data);
    }
  }

  displayBooks = () => {
    const { data } = this.props;
    if (data.loading) return <div>Loading books...</div>;

    return data.books.map(book => {
      return <li key={book.id}>{book.name}</li>
    })
  };
  render() {
   
    return (
      <div className="BookList">
        <ul id="book-list">
          {this.displayBooks()}
        </ul>
      </div>
    );
  }
}

export default graphql(getBooksQuery)(BookList);
