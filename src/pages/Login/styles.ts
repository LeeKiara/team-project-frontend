import styled from "@emotion/styled";

export const LoginCantailner = styled.div`
  a {
    text-decoration: none;
    color: black;
  }
  a:visited {
    color: black;
  }
  section {
    width: 50%;
    margin: auto;
    padding-top: 100px;
  }
  h1 {
    text-align: center;
  }
  form {
    width: 35%;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  form > label > svg {
    vertical-align: middle;
    color: lightgray;
  }
  form > label > input {
    border: none;
    height: 40px;
    width: 80%;
    margin-left: 5px;
  }
  form label {
    border: 1px solid #dddddd;
    border-radius: 5px;
    padding-left: 5px;
  }
  form > button {
    height: 40px;
    border-radius: 5px;
    cursor: pointer;
    color: #fff;
    background: #767676;
    border: 1px solid #767676;
    transition: background-color 0.2s ease-out, border-color 0.2s ease-out;
  }
  form > button:hover {
    background: #333; /* 배경 색상을 변경하는 예시 */
    border-color: #333; /* 테두리 색상을 변경하는 예시 */
  }
  span {
    color: black;
    width: fit-content;
    cursor: pointer;
    vertical-align: middle;
  }
  span > svg {
    color: #5055b1;
    vertical-align: middle;
  }
  div {
    width: 35%;
    margin: auto;
    margin-top: 40px;
  }
  div > button {
    width: 100%;
    height: 40px;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    color: #5055b1;
    background: #fff;
    border: 1px solid #5055b1;
    transition: background-color 0.2s ease-out, border-color 0.2s ease-out;
  }
  div > button:hover {
    background: #c4c4e3; /* 배경 색상을 변경하는 예시 */
    border-color: #5055b1; /* 테두리 색상을 변경하는 예시 */
  }
`;