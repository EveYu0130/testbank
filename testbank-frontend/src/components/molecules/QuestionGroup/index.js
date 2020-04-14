import React from 'react';
import styled from 'styled-components';
import CheckBox from '../../atoms/CheckBox';
import Button from '../../atoms/Button';

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

const ListWrapper = styled.ul`
    list-style: none;
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

const Text = styled.label`
    font: 12px Arial, Helvetica, sans-serif;
	padding-top: 8px;
	padding-right: 25px;
`;

class QuestionGroup extends React.Component {
    constructor(props) {
        super(props);
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleToggleShowSolution = this.handleToggleShowSolution.bind(this);
    }

    handleChange(e) {
        this.props.handleQuestionAnswerChange(e);
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.props.answer || this.props.submitted) {
            return;
        }
        const { chapterId, questionId } = this.props;
        fetch('http://127.0.0.1:5000/answered_question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
            body: "check="+this.props.answer+"&solution="+this.props.solution+"&questionId="+questionId+"&chapterId="+chapterId,
        }).then(response => {
            if (response.status === 200) {
                this.props.handleQuestionSubmit();
            }
        }).catch(error => {
            console.log(error);
        });
    }

    handleToggleShowSolution() {
        this.props.handleQuestionToggleShowSolution();
    }

    render() {
        console.log(this.props);
        console.log(this.props.answer);
        const { question, options, solution } = this.props;
        return (
            <form>
                    <LabelWrapper>
                        <Label>{question}</Label>
                    </LabelWrapper>
                    <ListWrapper>
                        {
                            Array.from(options).map(option => (
                                <LabelWrapper>
                                    <Text>
                                        <CheckBox onChange={this.handleChange} checked={option === this.props.answer} value={option}/>
                                        {option}
                                    </Text>
                                </LabelWrapper>
                            ))
                        }
                    </ListWrapper>
                    <StyledButton type="submit" value="Submit" disabled={!this.props.answer || this.props.submitted} onClick={this.handleSubmit}>
                        <ButtonLabel>Submit</ButtonLabel>
                    </StyledButton>
                    {this.props.answer && this.props.submitted && (
                        <LabelWrapper>
                            <Label>{(this.props.answer === solution? "Correct!" : "Wrong!")}</Label>
                        </LabelWrapper>
                    )}
                    <div>
                        <StyledButton onClick={this.handleToggleShowSolution}>
                            {this.props.showSolution ? (
                                <ButtonLabel>Hide Solution</ButtonLabel>
                            ) : (
                                <ButtonLabel>Show Solution</ButtonLabel>
                            )}
                        </StyledButton>
                        {this.props.showSolution && (
                            <LabelWrapper>
                                <Label>{solution}</Label>
                            </LabelWrapper>
                        )}
                    </div>
            </form>
        );
    }
}

export default QuestionGroup;