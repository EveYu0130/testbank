import styled from 'styled-components';

const Button = styled.button`
    box-sizing: border-box;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	width: 20%;
	padding: 3%;
	background: #43D1AF;
	border-bottom: 2px solid #30C29E;
	border-top-style: none;
	border-right-style: none;
	border-left-style: none;	
    color: #fff;
    
    &:hover {
        background: #2EBC99;
    }
`;

export default Button;