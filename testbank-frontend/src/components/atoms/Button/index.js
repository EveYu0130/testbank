import PropTypes from 'prop-types';
import styled from 'styled-components';

const Button = styled.button`
    // display: flex;
    // align-items: center;
    // font-size: 14px;
    // background-color: red;
    // border-radius: 8px;
    // border: none;
    // color: #333;
    // padding: 10px;
    // cursor: pointer;

    // &:hover {
    //     background-color: lighten(
    //         red,
    //         15%
    //     );
    // }

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