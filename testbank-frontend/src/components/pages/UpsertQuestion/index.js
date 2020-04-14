import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../atoms/Button';
import Select from 'react-select';


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

const SelectWrapper = styled.div`
    width: 50%;
    text-align: center;
    justify-content: center;
`;

const StyledSelect = styled(Select)`
    font: 13px Arial, Helvetica, sans-serif;
`;

const ContentWrapper = styled.div`
    display:block;
    margin-left: 29%;
    text-align: left;
`;

class UpsertQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            question: {context: ''},
            options: [{context: ''}],
            selectedOption: null
        };

        this.handleOptionsChange = this.handleOptionsChange.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleSolutionChange = this.handleSolutionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddOption = this.handleAddOption.bind(this);
    }

    componentDidMount() {
        console.log(this.props);
        const { params } = this.props;
        const { questionId } = params;
        if (!questionId) {
            this.setState({loading: false});
        } else {
            const { question, options, solution } = this.props.location.state;
            console.log(this.props.location.state);
            let selectedOption = null;
            options.forEach((option, index) => {
                if (solution.context === option.context) {
                    selectedOption = { value: solution.context, label: `Option ${index+1}` };
                }
            })
            this.setState({
                loading: false,
                question,
                options,
                selectedOption
            })

        }
    }

    handleOptionsChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let options = this.state.options;
        this.state.options.forEach((option, index) => {
            if (name === `option${index+1}`) {
                options[index] = {
                    ...options[index],
                    context: value
                };
            }
        });
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

    handleSolutionChange(selectedOption) {
        this.setState({selectedOption});
        console.log(this.state);
    }
    
    handleSubmit(event) {
        event.preventDefault();
        const { params } = this.props;
        const { questionId, chapterId, bookId } = params;
        const { question, selectedOption } = this.state;
        let options = [];
        let solution = {};
        this.state.options.forEach(option => {
            if (selectedOption.value !== option.context) {
                options.push(option);
            } else {
                solution = option;
            }
        })
        let href = 'http://127.0.0.1:5000/adding_question';
        if (questionId) {
            let hrefParams = `qid=${question.id}`;
            options.forEach((option, index) => {
                hrefParams = hrefParams + `&oid${index+1}=${option.id}`;
            })
            hrefParams = hrefParams + `&sid=${solution.id}`;
            href = `http://127.0.0.1:5000/modify?`+ hrefParams;
        }
        let bodyParams = `question=${question.context}`;
        options.forEach((option, index) => {
            bodyParams = bodyParams + `&option${index+1}=${option.context}`;
        })
        bodyParams = bodyParams + `&solution=${solution.context}`;
        console.log(bodyParams);
        fetch(href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
            body: bodyParams,
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

    handleAddOption() {
        let { options } = this.state;
        options.push({context: ''});
        this.setState({options});
    }

    render() {
        console.log(this.props);
        const { params } = this.props;
        const { questionId, bookId, chapterId } = params;
        console.log(this.state.options);
        return (
            <Wrapper>
                <Header>Add a Question</Header>
                <form onSubmit={this.handleSubmit}>
                    <ContentWrapper>
                        <LabelWrapper>
                            <Label>Question:</Label>
                            <input name="question" type="text" value={this.state.question.context} onChange={this.handleQuestionChange} />
                        </LabelWrapper>
                        {
                            Array.from(this.state.options).map((option, index) => (
                                <LabelWrapper>
                                    <Label>Option {index+1}:</Label>
                                    <input name={`option${index+1}`} type="text" value={option.context} onChange={this.handleOptionsChange} />
                                </LabelWrapper>
                            ))
                        }
                        <LabelWrapper>
                            <Label>Solution:</Label>
                            <SelectWrapper>
                                <StyledSelect options={Array.from(this.state.options).map(function(option, index) { return { value: option.context, label: `Option ${index+1}`}})} value={this.state.selectedOption} onChange={this.handleSolutionChange}/>
                            </SelectWrapper>
                        </LabelWrapper>
                        {!questionId && (
                            <StyledButton onClick={this.handleAddOption}>
                                <ButtonLabel>Add Option</ButtonLabel>
                            </StyledButton>
                        )}
                        <StyledButton type="submit" value="Submit" disabled={!this.state.selectedOption}>
                            <ButtonLabel>Submit</ButtonLabel>
                        </StyledButton>
                    </ContentWrapper>
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