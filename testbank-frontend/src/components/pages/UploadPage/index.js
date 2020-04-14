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

const FileInput = styled.input`
    font: 13px Arial, Helvetica, sans-serif;
    background: white;
`;

class UploadPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onChangeHandler(event) {
        console.log(event);
        this.setState({
            file: event.target.files[0]
        })
    }
    
    handleSubmit(event) {
        event.preventDefault();
        const { params } = this.props;
        const { chapterId, bookId } = params;
        var formData = new FormData();
        formData.append('file', this.state.file)
        fetch('http://127.0.0.1:5000/uploaded', {
            method: 'POST',
            enctype: "multipart/form-data",
            body: formData,
        }).then(response => {
            if (response.status === 200) {
                this.props.history.push(`/books/${bookId}/chapters/${chapterId}`);
            }
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
    }

    render() {
        const { params } = this.props;
        const { chapterId, bookId } = params;
        return (
            <Wrapper>
                <Header>Upload File</Header>
                <form>
                    <LabelWrapper>
                        <Label>File</Label>
                        <FileInput name="file" type="file" onChange={this.onChangeHandler}/>
                    </LabelWrapper>
                    <StyledButton type="submit" value="Submit" onClick={this.handleSubmit}>
                        <ButtonLabel>Submit</ButtonLabel>
                    </StyledButton>
                </form>
                <Link to={`/books/${bookId}/chapters/${chapterId}`}>
                    <StyledButton>
                        <ButtonLabel>Back</ButtonLabel>
                    </StyledButton>
                </Link>
            </Wrapper>
        );
    }
}

export default withRouter(UploadPage);