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

  &:disabled {
    opacity: 0.65; 
    cursor: not-allowed;
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

class AddChapter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
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
        console.log('Chapter added');
        event.preventDefault();
        fetch('http://127.0.0.1:5000/adding_chapter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
            body: "name="+this.state.name,
        }).then(response => {
            this.props.history.push(`/books/${params.bookId}`);
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
    }

    disableSubmit() {
        const { name } = this.state;
        return !name;
    }

    render() {
        const { params } = this.props;
        const url = this.props.match.url;
        console.log(url);
        return (
            <Wrapper>
                <Header>Add a Chapter</Header>
                <form>
                    <LabelWrapper>
                        <Label>Name:</Label>
                        <input name="name" type="text" value={this.state.name} onChange={this.handleInputChange} />
                    </LabelWrapper>
                    <StyledButton type="submit" value="Submit" disabled={this.disableSubmit()} onClick={this.handleSubmit}>
                        <ButtonLabel>Submit</ButtonLabel>
                    </StyledButton>
                </form>
                <Link to={`/books/${params.bookId}`}>
                    <StyledButton>
                        <ButtonLabel>Cancel</ButtonLabel>
                    </StyledButton>
                </Link>
            </Wrapper>
        );
    }
}

export default withRouter(AddChapter);