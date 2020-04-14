import React from 'react';
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

const Text = styled.label`
    font: 12px Arial, Helvetica, sans-serif;
	padding-top: 8px;
	padding-right: 25px;
`;

const ContentWrapper = styled.div`
    display:block;
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

const ListWrapper = styled.ul`
    list-style: none;
`;

class QuestionDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            question: '',
            options: [],
            solution: '',
        };

        this.handleClickDelete = this.handleClickDelete.bind(this);
    }

    componentDidMount() {
        const { params } = this.props;
        const { questionId } = params;
        var self = this;
        return new Promise(function(resolve, reject) {
            fetch(`http://127.0.0.1:5000/question?qid=${questionId}`)
            .then(function(response) {
                if (response.status === 200) {
                    response.json().then(function(data) {
                        resolve(data);
                        console.log(data);
                        self.setState({
                            loading: false,
                            question: data[0],
                            options: data.slice(1, data.length-1),
                            solution: data[data.length-1]
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

    handleClickDelete() {
        const { params } = this.props;
        const { questionId, chapterId, bookId } = params;
        this.setState({loading: true});
        var self = this;
        return new Promise(function(resolve, reject) {
            fetch(`http://127.0.0.1:5000/list_all_questions_after_delete?chapter_id=${chapterId}&question_id=${questionId}`)
            .then(function(response) {
                console.log(response);
                if (response.status === 200) {
                    self.setState({loading: false});
                    self.props.history.push(`/books/${bookId}/chapters/${chapterId}`);
                }
            }).catch(error => {
                console.log(error);
                // reject([]);
            });
        })
    }


    render() {
        const { question, options, solution } = this.state;
        const { params, match } = this.props;
        const { bookId, chapterId } = params;
        let showErrors = false;
        if (this.props.location.state && this.props.location.state.showErrors) {
            showErrors = this.props.location.state.showErrors;
        }
        return (
            <Wrapper>
                <Header>Question Detail</Header>
                {this.state.loading ? (
                    <Spinner/>
                ) : (
                    <ContentWrapper>
                        <LabelWrapper>
                            <Label>Question:</Label>
                            <Text>{question.context}</Text>
                        </LabelWrapper>
                        <ListWrapper>
                            {
                                Array.from(options).map((option, index) => (
                                    <LabelWrapper>
                                        <Label>Option {index+1}:</Label>
                                        <Text>{option.context}</Text>
                                    </LabelWrapper>
                                ))
                            }
                        </ListWrapper>
                        <LabelWrapper>
                            <Label>Solution:</Label>
                            <Text>{solution.context}</Text>
                        </LabelWrapper>
                    </ContentWrapper>
                )}
                {!showErrors && (
                    <Link to={{
                        pathname: `${match.url}/modify`,
                        state: {
                            question,
                            options,
                            solution
                        }
                    }}>
                        <StyledButton>
                            <ButtonLabel>Modify</ButtonLabel>
                        </StyledButton>
                    </Link>
                )}
                {!showErrors && (
                    <StyledButton onClick={this.handleClickDelete}>
                        <ButtonLabel>Delete</ButtonLabel>
                    </StyledButton>
                )}
                <Link to={{pathname: `/books/${bookId}/chapters/${chapterId}`, state: {showErrors}}}>
                    <StyledButton>
                        <ButtonLabel>Back</ButtonLabel>
                    </StyledButton>
                </Link>
            </Wrapper>
        );
    }
}

export default withRouter(QuestionDetail);