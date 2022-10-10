import styled from "styled-components";
import { theme } from "../../common/theme";

export const StyledTransactionHistory = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2%;

  .transactions-container {
    margin: 0 auto;
    width: 840px;
    ${theme.boxShadow}
    border-radius: ${theme.borderRadius};
    span {
      display: inline-block;
      width: 20%;
    }
  }
  .no-transaction-found {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-top: 10%;
    button {
      margin: 2%;
    }
  }
`;

export const TransactionsWrapper = styled.div`
  .transactions-buy {
    background-color: ${theme.color.green};
  }

  .transactions-sell {
    background-color: ${theme.color.red};
  }
`;