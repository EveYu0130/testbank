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
            question: this.props.question,
            options: this.props.options.map(option => {
                return {
                    value: option,
                    checked: false
                }
            }),
            answer: ''
        }
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        let options = this.state.options;
        options.forEach(option => {
            if (option.value === e.target.value) {
                option.checked = e.target.checked;
                this.setState({answer: option.value});
            } else {
                option.checked = false;
            }
        });
        console.log(options);
        this.setState({options: options});
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

    render() {
        const { question, options } = this.state;
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
                                        <CheckBox onChange={this.handleChange} {...option}/>
                                        {option.value}
                                    </Label>
                                </LabelWrapper>
                            ))
                        }
                    </ListWrapper>
                    <StyledButton type="submit" value="Submit" disabled={!this.state.answer}>
                        <ButtonLabel>Submit</ButtonLabel>
                    </StyledButton>
            </form>
        );
    }
}

export default QuestionGroup;