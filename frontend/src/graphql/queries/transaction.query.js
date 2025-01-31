import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query getTransaction {
    transactions {
      _id
      description
      paymentType
      category
      amount
      location
      date
    }
  }
`;

export const GET_TRANSACTION_BY_ID = gql`
  query getTransactionById($id: ID!) {
    transaction(transactionId: $id) {
      _id
      description
      paymentType
      category
      amount
      location
      date
    }
  }
`;

export const GET_CATEGORY_STATISTICS = gql`
query getCategoryStatistics{
    categoryStatistics{
        category, 
        totalAmount
    }
}
`;
