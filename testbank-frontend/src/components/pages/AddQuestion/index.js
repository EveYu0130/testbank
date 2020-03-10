import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../atoms/Button';


const Wrapper = styled.div`
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    border-radius: 8px;
    background: #f4f7f8;
    margin: 10% 35%;
    text-align: center;
    width: 30%;
    padding: 5% 0;
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

const Header = styled.h1`
    // background: #43D1AF;
    padding: 20px 0;
    font-weight: 300 bold;
    text-align: center;
    color: #43D1AF;
    margin: -16px -16px 16px -16px;
    // width: 20%;
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

class AddQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            solution: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }
    
    handleSubmit(event) {
        const { params } = this.props;
        console.log('Question added');
        event.preventDefault();
        fetch('http://127.0.0.1:5000/adding_question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
            body: "question="+this.state.question+"&a="+this.state.optionA+"&b="+this.state.optionB+"&c="+this.state.optionC+"&d="+this.state.optionD+"&solution="+this.state.solution,
        }).then(response => {
            this.props.history.push(`${params.url}`);
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        const { params } = this.props;
        return (
            <Wrapper>
                <Header>Add a Question</Header>
                <form onSubmit={this.handleSubmit}>
                    <LabelWrapper>
                        <Label>Question:</Label>
                        <input name="question" type="text" value={this.state.question} onChange={this.handleInputChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>A:</Label>
                        <input name="optionA" type="text" value={this.state.optionA} onChange={this.handleInputChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>B:</Label>
                        <input name="optionB" type="text" value={this.state.optionB} onChange={this.handleInputChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>C:</Label>
                        <input name="optionC" type="text" value={this.state.optionC} onChange={this.handleInputChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>D:</Label>
                        <input name="optionD" type="text" value={this.state.optionD} onChange={this.handleInputChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>Solution:</Label>
                        <input name="solution" type="text" value={this.state.solution} onChange={this.handleInputChange} />
                    </LabelWrapper>
                    <StyledButton type="submit" value="Submit">
                        <ButtonLabel>Submit</ButtonLabel>
                    </StyledButton>
                </form>
                <Link to={`${params.url}`}>
                    <StyledButton>
                        <ButtonLabel>Cancel</ButtonLabel>
                    </StyledButton>
                </Link>
            </Wrapper>
        );
    }
}

export default withRouter(AddQuestion);