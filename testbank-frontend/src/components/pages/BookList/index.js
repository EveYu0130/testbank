import React from 'react';
import Table from '../../molecules/Table';
import { Link, withRouter } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import Button from '../../atoms/Button';

const Wrapper = styled.div`
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    border-radius: 8px;
    background: #f4f7f8;
    text-align: center;
    padding: 5% 0;
    height: 100%;
`;

const Header = styled.h1`
    // background: #43D1AF;
    padding: 20px 0;
    font-weight: 300 bold;
    text-align: center;
    color: #43D1AF;
    margin: -16px -16px 16px -16px;
    // width: 20%;
`;

const Text = styled.h3`
    // background: #43D1AF;
    padding: 20px 0;
    font-weight: 300;
    text-align: center;
    margin: -16px -16px 16px -16px;
    // width: 20%;
`;

const StyledButton = styled(Button)`
  color: #fff;
  flex-shrink: 0;
  padding: 8px 16px;
  justify-content: center;
  margin: 2% 1%;
  width: 200px;

  @media (max-width: 375px) {
    height: 52px;
  }
`;

const ButtonLabel = styled.label`
  margin-left: 5px;
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const spinAnimation = css`
  ${spin} 1s infinite linear
`;

const Spinner = styled.div`
  pointer-events: all;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  border: 5px solid
    rgba(255, 255, 255, 0.2);
  border-top-color: #43D1AF;
  border-right-color: #43D1AF;
  animation: ${spinAnimation};
  transition: border-top-color 0.5s linear, border-right-color 0.5s linear;
  margin-left: 48%;
`;

class BookList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            books: []
        };
    }

    componentDidMount() {
        var self = this;
        return new Promise(function(resolve, reject) {
            fetch('http://127.0.0.1:5000/list_books')
            .then(function(response) {
                if (response.status === 200) {
                    response.json().then(function(data) {
                        resolve(data);
                        self.setState({
                            loading: false,
                            books: Array.from(data)
                        });
                    });
                } else {
                    reject([]);
                }
            }).catch(error => {
                // console.log(error);
                reject([]);
            });
        })
    }


    render() {
        let data = [];
        const url = this.props.match.url;
        this.state.books.forEach(function(book) {
            data.push({
                ...book,
                link: <Link to={`${url}/${book.id}`}>Go</Link>
            });
        });
        const columns = [
            {
                Header: 'Category',
                accessor: 'category'
            },
            {
                Header: 'Number',
                accessor: 'number'
            },
            {
                Header: 'Name',
                accessor: 'name'
            },
            {
                Header: 'Link',
                accessor: 'link'
            }
        ]
        return (
            <Wrapper>
                <Header>My Test Banks</Header>
                <Text>Here is the list of books you have uploaded</Text>
                <div>
                    {this.state.loading ? (
                        <Spinner/>
                    ) : (
                        <Table columns={columns} data={data} />
                    )}
                </div>
                <Link to="/books/add">
                    <StyledButton>
                        <ButtonLabel>Add a Book</ButtonLabel>
                    </StyledButton>
                </Link>
            </Wrapper>
        );
    }
}

export default withRouter(BookList);