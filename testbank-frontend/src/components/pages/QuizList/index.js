import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Button from '../../atoms/Button';
import QuestionGroup from '../../molecules/QuestionGroup';
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

  &:disabled {
    opacity: 0.65; 
    cursor: not-allowed;
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

class QuizList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            questions: [],
            current_question_idx: 0,
            submitted: false,
            showSolution: false,
            current_answer: ''
        };

        this.handleClickNext = this.handleClickNext.bind(this);
        this.handleQuestionSubmit = this.handleQuestionSubmit.bind(this);
        this.handleQuestionToggleShowSolution = this.handleQuestionToggleShowSolution.bind(this);
        this.handleQuestionAnswerChange = this.handleQuestionAnswerChange.bind(this);
    }

    componentDidMount() {
        const { params } = this.props;
        var self = this;
        let showErrors = false;
        if (this.props.location.state && this.props.location.state.showErrors) {
            showErrors = this.props.location.state.showErrors;
        }
        const href = showErrors? `http://127.0.0.1:5000/errors?chapter_id=${params.chapterId}` : `http://127.0.0.1:5000/questions?chapter_id=${params.chapterId}`;
        return new Promise(function(resolve, reject) {
            fetch(href)
            .then(function(response) {
                if (response.status === 200) {
                    response.json().then(function(data) {
                        resolve(data);
                        console.log(data);
                        self.setState({
                            loading: false,
                            questions: Array.from(data),
                            current_question_idx: 0
                        });
                    });
                } else {
                    reject([]);
                }
            }).catch(error => {
                reject([]);
                // console.log(error);
            });
        })
    }

    handleClickNext() {
        const { current_question_idx } = this.state;
        this.setState({
            current_question_idx: current_question_idx+1
        });
        this.setState({
            submitted: false,
            showSolution: false,
            current_answer: ''
        });
    }

    handleQuestionSubmit() {
        console.log('hahahha');
        this.setState({submitted: true});
    }

    handleQuestionToggleShowSolution() {
        console.log('hhhhhhh');
        const { showSolution } = this.state;
        this.setState({showSolution: !showSolution});
    }

    handleQuestionAnswerChange(e) {
        const { options } = this.state.questions[this.state.current_question_idx];
        options.forEach(option => {
            if (option === e.target.value) {
                this.setState({current_answer: option});
            }
        });
    }


    render() {
        console.log(this.state);
        const { questions, current_question_idx  } = this.state;
        const { params } = this.props;
        const { bookId, chapterId } = params;
        let showErrors = false;
        if (this.props.location.state && this.props.location.state.showErrors) {
            showErrors = this.props.location.state.showErrors;
        }
        return (
            <Wrapper>
                <Header>Quiz</Header>
                <div>
                    {this.state.loading ? (
                        <Spinner/>
                    ) : (
                        <QuestionGroup 
                            chapterId={chapterId}
                            questionId={questions[current_question_idx].qid} 
                            question={questions[current_question_idx].question} 
                            options={questions[current_question_idx].options} 
                            solution={questions[current_question_idx].solution}
                            submitted={this.state.submitted}
                            showSolution={this.state.showSolution}
                            answer={this.state.current_answer}
                            handleQuestionSubmit={this.handleQuestionSubmit}
                            handleQuestionToggleShowSolution={this.handleQuestionToggleShowSolution}
                            handleQuestionAnswerChange={this.handleQuestionAnswerChange}/>
                    )}
                </div>
                <Link to={{pathname: `/books/${bookId}/chapters/${chapterId}`, state: {showErrors}}}>
                    <StyledButton>
                        <ButtonLabel>Back</ButtonLabel>
                    </StyledButton>
                </Link>
                {this.state.current_question_idx < this.state.questions.length-1 ? (
                    <StyledButton onClick={this.handleClickNext}>
                        <ButtonLabel>Next</ButtonLabel>
                    </StyledButton>
                ) : (
                    <Link to={{pathname: `/books/${bookId}/chapters/${chapterId}`, state: {showErrors}}}>
                        <StyledButton>
                            <ButtonLabel>End Quiz</ButtonLabel>
                        </StyledButton>
                    </Link>
                )}
            </Wrapper>
        );
    }
}

export default withRouter(QuizList);