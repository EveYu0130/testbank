import React from 'react';
import Table from '../../molecules/Table';
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
`;

class Quiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            question: '',
            options: [],
            solution: '',
            showSolution: false
        };

        this.handleClickNext = this.handleClickNext.bind(this);
        this.handleClickShowSolution = this.handleClickShowSolution.bind(this);
    }

    componentDidMount() {
        var self = this;
        const data = new Promise(function(resolve, reject) {
            fetch(`http://127.0.0.1:5000/at_question?restart=1`)
            .then(function(response) {
                if (response.status == 200) {
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

    handleClickNext() {
        console.log();
        this.setState({loading: true});
        var self = this;
        const data = new Promise(function(resolve, reject) {
            fetch(`http://127.0.0.1:5000/at_question?restart=0`)
            .then(function(response) {
                if (response.status == 200) {
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

    handleClickShowSolution() {
        this.setState({showSolution: true});
    }


    render() {
        const { question, options, solution } = this.state;
        const { params } = this.props;
        const { url } = params;
        return (
            <Wrapper>
                <Header>Quiz</Header>
                <div>
                    {this.state.loading ? (
                        <Spinner/>
                    ) : (
                        <QuestionGroup question={question} options={options}/>
                    )}
                </div>
                <div>
                    <StyledButton onClick={this.handleClickShowSolution}>
                        <ButtonLabel>Show Solution</ButtonLabel>
                    </StyledButton>
                    {this.state.showSolution && (
                        <LabelWrapper>
                            <Label>{solution}</Label>
                        </LabelWrapper>
                    )}
                </div>
                <Link to={`${url}`}>
                    <StyledButton>
                        <ButtonLabel>Back</ButtonLabel>
                    </StyledButton>
                </Link>
                <StyledButton onClick={this.handleClickNext}>
                    <ButtonLabel>Next</ButtonLabel>
                </StyledButton>
            </Wrapper>
        );
    }
}

export default withRouter(Quiz);