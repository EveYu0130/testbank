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

const LabelWrapper = styled.div`
    display:block;
    margin-bottom: 20px;
`;

const Label = styled.label`
    font: 13px Arial, Helvetica, sans-serif;
	font-weight: bold;
	padding-top: 8px;
	padding-right: 25px;
`;

class QuestionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            questions: [],
            errors: [],
            showErrors: false
        };

        this.handleToggleShowErrors = this.handleToggleShowErrors.bind(this);
    }

    componentDidMount() {
        const { params } = this.props;
        var self = this;
        Promise.all([
            fetch(`http://127.0.0.1:5000/list_all_questions?chapter_id=${params.chapterId}`),
            fetch(`http://127.0.0.1:5000/list_errors?chapter_id=${params.chapterId}`)
        ]).then(([questionsResponse, errorsResponse]) => {
            if (questionsResponse.status == 200 && errorsResponse.status == 200) {
                questionsResponse.json().then(function(data) {
                    self.setState({
                        questions: Array.from(data)
                    });
                });
                errorsResponse.json().then(function(data) {
                    self.setState({
                        loading: false,
                        errors: Array.from(data)
                    });
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    handleToggleShowErrors() {
        const { showErrors, errors } = this.state;
        const { params } = this.props;
        this.setState({showErrors: !showErrors});
    }


    render() {
        console.log(this.props);
        const { params, match } = this.props;
        let data = [];
        var self = this;
        const questions = this.state.showErrors? this.state.errors : this.state.questions;
        questions.forEach(function(question) {
            data.push({
                id: question.qid,
                question: question.question,
                solution: question.solution,
                detail: <Link to={`${match.url}/questions/${question.qid}`}>Go</Link>
            });
        });
        const columns = [
            {
                Header: 'ID',
                accessor: 'id'
            },
            {
                Header: 'Question',
                accessor: 'question'
            },
            {
                Header: 'Solution',
                accessor: 'solution'
            },
            {
                Header: 'Detail',
                accessor: 'detail'
            }
        ]
        return (
            <Wrapper>
                <Header>Questions</Header>
                <LabelWrapper>
                    <Label>Error Book</Label>
                    <input
                        name="errors"
                        type="checkbox"
                        checked={this.state.showErrors}
                        onChange={this.handleToggleShowErrors} />
                </LabelWrapper>
                <Table columns={columns} data={data} />
                {!this.state.showErrors && (
                    <Link to={`${match.url}/quiz`}>
                        <StyledButton>
                            <ButtonLabel>Start Quiz</ButtonLabel>
                        </StyledButton>
                    </Link>
                )}
                {!this.state.showErrors && (
                    <Link to={`${match.url}/questions/add`}>
                        <StyledButton>
                            <ButtonLabel>Add a Question</ButtonLabel>
                        </StyledButton>
                    </Link>
                )}
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