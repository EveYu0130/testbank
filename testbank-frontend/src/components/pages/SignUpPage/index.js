import React from 'react';
import { Link } from 'react-router-dom';
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

class SignUpPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: ''
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
        alert('Account created');
        event.preventDefault();
    }

    render() {
        return (
            <Wrapper>
                <Header>Sign Up</Header>
                <form onSubmit={this.handleSubmit}>
                    <LabelWrapper>
                        <Label>Username:</Label>
                        <input name="username" type="text" value={this.state.username} onChange={this.handleInputChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>Password:</Label>
                        <input name="password" type="text" value={this.state.password} onChange={this.handleInputChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>Email:</Label>
                        <input name="email" type="text" value={this.state.email} onChange={this.handleInputChange} />
                    </LabelWrapper>
                    <StyledButton type="submit" value="Submit">
                        <ButtonLabel>Submit</ButtonLabel>
                    </StyledButton>
                </form>
                <Link to="/">
                    <StyledButton>
                        <ButtonLabel>Cancel</ButtonLabel>
                    </StyledButton>
                </Link>
            </Wrapper>
        );
    }
}

export default SignUpPage;