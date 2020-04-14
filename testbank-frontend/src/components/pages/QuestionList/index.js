import React from 'react';
import Table from '../../molecules/Table';
import { Link, withRouter } from 'react-router-dom';
import Button from '../../atoms/Button';
import styled, { keyframes, css } from 'styled-components';

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

class QuestionList extends React.Component {
    constructor(props) {
        super(props);
        let showErrors = false;
        if (this.props.location.state && this.props.location.state.showErrors) {
            showErrors = this.props.location.state.showErrors;
        }
        this.state = {
            loading: true,
            questions: [],
            errors: [],
            showErrors
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
            if (questionsResponse.status === 200 && errorsResponse.status === 200) {
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
        const { showErrors } = this.state;
        this.setState({showErrors: !showErrors});
    }


    render() {
        console.log(this.props);
        const { params, match } = this.props;
        let data = [];
        const questions = this.state.showErrors? this.state.errors : this.state.questions;
        const self = this;
        questions.forEach((question, index) => {
            data.push({
                id: index+1,
                question: question.question,
                solution: question.solution,
                detail: <Link to={{pathname: `${match.url}/questions/${question.qid}`, state: {showErrors: self.state.showErrors}}}>Go</Link>
            });
        });
        const columns = [
            {
                Header: '#',
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
                <div>
                    {this.state.loading ? (
                        <Spinner/>
                    ) : (
                        <Table columns={columns} data={data} />
                    )}
                </div>
                <Link to={{pathname: `${match.url}/quiz`, state: {showErrors: this.state.showErrors}}}>
                    <StyledButton>
                        <ButtonLabel>Start Quiz</ButtonLabel>
                    </StyledButton>
                </Link>
                {!this.state.showErrors && (
                    <Link to={`${match.url}/questions/add`}>
                        <StyledButton>
                            <ButtonLabel>Add a Question</ButtonLabel>
                        </StyledButton>
                    </Link>
                )}
                {!this.state.showErrors && (
                    <Link to={`${match.url}/upload`}>
                        <StyledButton>
                            <ButtonLabel>Upload File</ButtonLabel>
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