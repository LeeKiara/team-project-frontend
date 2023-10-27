import styled from "@emotion/styled";

export const CommnetListContainer = styled.div`
  .commentList {
    display: flex;
    flex-direction: column;
    margin: auto;
    margin-bottom: 50px;
  }
  .commentList > div {
    border-top: 1px solid black;
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 70%;
    height: 90px;
    background-color: #f8f8f8;
    margin: auto;
    padding: 20px;
  }
  .commentList > div > span:nth-of-type(1) {
    display: flex;
    justify-content: space-between;
  }
  .commentList > div > span:nth-of-type(1) > h5 > svg {
    color: black;
    font-size: 20px;
  }
  .commentList > div > span:nth-of-type(2) {
    display: flex;
    justify-content: space-between;
  }
  .commentList > div > span:nth-of-type(2) > div > p {
    /* border: 1px solid black; */
    display: flex;
    justify-content: space-between;
    padding-top: 5px;
    padding-left: 10px;
  }
  .commentList > div > span:nth-of-type(2) > input {
    /* height: 55px; */
    padding-left: 10px;
    width: 90%;
    margin: auto;
    line-height: 55px;
    vertical-align: top;
  }
  .commentList > div > span:nth-of-type(2) > div {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .modifyBtn {
    background-color: #fafafa;
    /* border-radius: 5px; */
    font-size: 16px;
    cursor: pointer;
  }
`;
