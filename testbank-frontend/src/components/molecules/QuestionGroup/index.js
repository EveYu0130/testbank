import React from 'react';
import styled from 'styled-components';
import CheckBox from '../../atoms/CheckBox';
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


class QuestionGroup extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            answer: '',
            showSolution: false
        }
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleToggleShowSolution = this.handleToggleShowSolution.bind(this);
    }

    handleChange(e) {
        const { options } = this.props;
        options.forEach(option => {
            if (option === e.target.value) {
                this.setState({answer: option});
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch('http://127.0.0.1:5000/answered_question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
            body: "check="+this.state.answer,
        }).catch(error => {
            console.log(error);
        });
    }

    handleToggleShowSolution() {
        const { showSolution } = this.state;
        this.setState({showSolution: !showSolution});
    }

    render() {
        console.log(this.props);
        const { question, options, solution } = this.props;
        return (
            <form onSubmit={this.handleSubmit}>
                    <LabelWrapper>
                        <Label>{question}</Label>
                    </LabelWrapper>
                    <ListWrapper>
                        {
                            Array.from(options).map(option => (
                                <LabelWrapper>
                                    <Label>
                                        <CheckBox onChange={this.handleChange} checked={option === this.state.answer} value={option}/>
                                        {option}
                                    </Label>
                                </LabelWrapper>
                            ))
                        }
                    </ListWrapper>
                    <StyledButton type="submit" value="Submit" disabled={!this.state.answer}>
                        <ButtonLabel>Submit</ButtonLabel>
                    </StyledButton>
                    <div>
                        <StyledButton onClick={this.handleToggleShowSolution}>
                            {this.state.showSolution ? (
                                <ButtonLabel>Hide Solution</ButtonLabel>
                            ) : (
                                <ButtonLabel>Show Solution</ButtonLabel>
                            )}
                        </StyledButton>
                        {this.state.showSolution && (
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