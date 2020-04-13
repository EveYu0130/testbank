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

class UpsertQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            question: {context: ''},
            options: Array(5).fill({context: ''}),
            solution: {context: ''}
        };

        this.handleOptionsChange = this.handleOptionsChange.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleSolutionChange = this.handleSolutionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        console.log(this.props);
        const { params } = this.props;
        const { questionId } = params;
        if (!questionId) {
            this.setState({loading: false});
        } else {
            const { question, options, solution } = this.props.location.state;
            this.setState({
                loading: false,
                question,
                options,
                solution
            })

        }
    }

    handleOptionsChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let options = this.state.options;
        if (name === 'option1') {
            options[0] = {
                ...options[0],
                context: value
            };
        } else if (name === 'option2') {
            options[1] = {
                ...options[1],
                context: value
            };
        } else if (name === 'option3') {
            options[2] = {
                ...options[2],
                context: value
            };
        } else if (name === 'option4') {
            options[3] = {
                ...options[3],
                context: value
            };
        } else if (name === 'option5') {
            options[4] = {
                ...options[4],
                context: value
            };
        }
        console.log(options);
    
        this.setState({options});
    }

    handleQuestionChange(event) {
        const target = event.target;
        const value = target.value;
        const question = {
            ...this.state.question,
            context: value
        };
    
        this.setState({question});
    }

    handleSolutionChange(event) {
        console.log(this.state);
        const target = event.target;
        const value = target.value;
        let solution = {
            ...this.state.solution,
            context: value
        };

        this.state.options.forEach(option => {
            if (option.id && option.context === value) {
                solution = {
                    ...solution,
                    id: option.id
                }
            }
        })
        this.setState({solution});
    }
    
    handleSubmit(event) {
        event.preventDefault();
        const { params } = this.props;
        const { questionId, chapterId, bookId } = params;
        const { question, solution } = this.state;
        let options = [];
        this.state.options.forEach(option => {
            if (solution.context != option.context) {
                options.push(option);
            }
        })
        let href = 'http://127.0.0.1:5000/adding_question';
        if (questionId) {
            href = `http://127.0.0.1:5000/modify?qid=${question.id}&aid=${options[0].id}&bid=${options[1].id}&cid=${options[2].id}&did=${options[3].id}&sid=${solution.id}`;
        }
        fetch(href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
            body: "question="+question.context+"&a="+options[0].context+"&b="+options[1].context+"&c="+options[2].context+"&d="+options[3].context+"&solution="+solution.context,
        }).then(response => {
            if (questionId) {
                this.props.history.push(`/books/${bookId}/chapters/${chapterId}/questions/${questionId}`);
            } else {
                this.props.history.push(`/books/${bookId}/chapters/${chapterId}`);
            }
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        console.log(this.props);
        const { params } = this.props;
        const { bookId, chapterId } = params;
        return (
            <Wrapper>
                <Header>Add a Question</Header>
                <form onSubmit={this.handleSubmit}>
                    <LabelWrapper>
                        <Label>Question:</Label>
                        <input name="question" type="text" value={this.state.question.context} onChange={this.handleQuestionChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>Option 1:</Label>
                        <input name="option1" type="text" value={this.state.options[0].context} onChange={this.handleOptionsChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>Option 2:</Label>
                        <input name="option2" type="text" value={this.state.options[1].context} onChange={this.handleOptionsChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>Option 3:</Label>
                        <input name="option3" type="text" value={this.state.options[2].context} onChange={this.handleOptionsChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>Option 4:</Label>
                        <input name="option4" type="text" value={this.state.options[3].context} onChange={this.handleOptionsChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>Option 5:</Label>
                        <input name="option5" type="text" value={this.state.options[4].context} onChange={this.handleOptionsChange} />
                    </LabelWrapper>
                    <LabelWrapper>
                        <Label>Solution:</Label>
                        <input name="solution" type="text" value={this.state.solution.context} onChange={this.handleSolutionChange} />
                    </LabelWrapper>
                    <StyledButton type="submit" value="Submit">
                        <ButtonLabel>Submit</ButtonLabel>
                    </StyledButton>
                </form>
                <Link to={`/books/${bookId}/chapters/${chapterId}`}>
                    <StyledButton>
                        <ButtonLabel>Cancel</ButtonLabel>
                    </StyledButton>
                </Link>
            </Wrapper>
        );
    }
}

export default withRouter(UpsertQuestion);