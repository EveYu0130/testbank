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

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            rememberMe: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }
    
    handleSubmit(event) {
        // console.log('Login Successfully');
        event.preventDefault();
        // const form = new FormData();
        // form.append('username', this.state.username);
        // form.append('password', this.state.password);
        fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
            body: "username="+this.state.username+"&password="+this.state.password,
        }).then(response => {
            if (response.status === 200) {
                this.props.history.push('/books');
            } else {
                this.props.history.push('/');
            }
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        return (
            <Wrapper>
                <Header>Please Login First</Header>
                <form onSubmit={this.handleSubmit}>
                    <LabelWrapper>
                        <Label>Username:</Label>
                        <input name="username" type="text" value={this.state.username} onChange={this.handleInputChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>Password:</Label>
                        <input name="password" type="password" value={this.state.password} onChange={this.handleInputChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>Remember me</Label>
                        <input
                            name="rememberMe"
                            type="checkbox"
                            checked={this.state.rememberMe}
                            onChange={this.handleInputChange} />
                    </LabelWrapper>
                    <StyledButton type="submit" value="Submit">
                        <ButtonLabel>Submit</ButtonLabel>
                    </StyledButton>
                </form>
                <Link to="/signup">
                    <StyledButton>
                        <ButtonLabel>Create Account</ButtonLabel>
                    </StyledButton>
                </Link>
            </Wrapper>
        );
    }
}

export default withRouter(LoginPage);