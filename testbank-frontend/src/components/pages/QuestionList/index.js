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

const StyledButton = styled(Button)`
  color: #fff;
  flex-shrink: 0;
  padding: 8px 16px;
  justify-content: center;
  margin-bottom: 10px;
  width: 200px;
  margin: 2% 1%;

  @media (max-width: 375px) {
    height: 52px;
  }
`;

const ButtonLabel = styled.label`
  margin-left: 5px;
`;

class QuestionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            questions: []
        };
    }

    componentDidMount() {
        const { params } = this.props;
        var self = this;
        const data = new Promise(function(resolve, reject) {
            fetch(`http://127.0.0.1:5000/list_questions?chapter_id=${params.chapterId}`)
            .then(function(response) {
                if (response.status == 200) {
                    response.json().then(function(data) {
                        console.log("response");
                        console.log(data);
                        console.log(Array.from(data));
                        resolve(data);
                        self.setState({
                            loading: false,
                            questions: Array.from(data)
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
        this.state.questions.forEach(function(question) {
            data.push(question);
        });
        // const data = [
        //     {
        //         id: '1',
        //         name: 'Q1',
        //     },
        //     {
        //         id: '2',
        //         name: 'Q2',
        //     },
        //     {
        //         id: '3',
        //         name: 'Q3',
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
            }
        ]
        const { params, match } = this.props;
        return (
            <Wrapper>
                <Header>Chapter</Header>
                <Table columns={columns} data={data} />
                <Link to={`${match.url}/questions/add`}>
                    <StyledButton>
                        <ButtonLabel>Add a Question</ButtonLabel>
                    </StyledButton>
                </Link>
                <Link to={`/books/${params.bookId}`}>
                    <StyledButton>
                        <ButtonLabel>Back</ButtonLabel>
                    </StyledButton>
                </Link>
            </Wrapper>
        );
    }
}

export default withRouter(QuestionList);