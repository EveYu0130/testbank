import React from 'react';
import Table from '../../molecules/Table';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
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
  width: 10%;

  @media (max-width: 375px) {
    height: 52px;
  }
`;

const ButtonLabel = styled.label`
  margin-left: 5px;
`;

class ChapterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            chapters: []
        };
    }

    componentDidMount() {
        const { params } = this.props;
        var self = this;
        const data = new Promise(function(resolve, reject) {
            fetch(`http://127.0.0.1:5000/list_chapters?book_id=${params.bookId}`)
            .then(function(response) {
                if (response.status == 200) {
                    response.json().then(function(data) {
                        resolve(data);
                        self.setState({
                            loading: false,
                            chapters: Array.from(data)
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
        console.log(url);
        this.state.chapters.forEach(function(chapter) {
            data.push({
                ...chapter,
                link: <Link to={`${url}/chapters/${chapter.id}`}>Go</Link>
            });
        });
        // const data = [
        //     {
        //         id: '1',
        //         name: 'Chapter1',
        //         link: <Link to="/list_questions?chapter_id=1">Go</Link>
        //     },
        //     {
        //         id: '2',
        //         name: 'Chapter2',
        //         link: <Link to="/list_questions?chapter_id=2">Go</Link>
        //     },
        //     {
        //         id: '3',
        //         name: 'Chapter3',
        //         link: <Link to="/list_questions?chapter_id=3">Go</Link>
        //     }
        // ]
        const columns = [
            {
                Header: 'ID',
                accessor: 'id'
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
                <Header>My Chapters</Header>
                <Text>Here is the chapters for the book</Text>
                <Table columns={columns} data={data} />
                <Link to={`${url}/chapters/add`}>
                    <StyledButton>
                        <ButtonLabel>Add a Chapter</ButtonLabel>
                    </StyledButton>
                </Link>
                <Link to="/books">
                    <StyledButton>
                        <ButtonLabel>Back to My Books</ButtonLabel>
                    </StyledButton>
                </Link>
            </Wrapper>
        );
    }
}

export default withRouter(ChapterList);