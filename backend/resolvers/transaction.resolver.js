import Transaction from "../models/transaction.model.js";

const transactionResolver = {
    Query: {
        transactions: async(_, __, context) => {
            try {
                if(!context.getUser()) throw new Error('Unauthorized');
                const userId = await context.getUser()._id;
                // console.log(userId);

                const transactions = await Transaction.find({userId});
                return transactions;
            } catch (error) {
                console.log("Error getting Transactions:", error);
                throw new Error("Error getting transactions");
            }
        },

        transaction: async(_, {transactionId}) => {
            try {
                // console.log("Get single Transaction",transactionId);
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            } catch (error) {
                console.log("Error finding transaction", error);
                throw new Error("Error finding transaction");
            }
        },

        categoryStatistics : async(_, __, context) => {
            if(!context.getUser()) throw new Error('Unauthorized');
            const userId = await context.getUser()._id;

            const transactions = await Transaction.find({userId});
            const categoryMap = {};

            transactions.forEach((transaction) => {
                if(!categoryMap[transaction.category]){
                    categoryMap[transaction.category] = 0;
                }
                categoryMap[transaction.category] += transaction.amount;
            })
            return Object.entries(categoryMap).map(([category, totalAmount]) => ({category, totalAmount}))
        }
    },
    Mutation: {
        createTransaction: async(_, {input}, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: await context.getUser()._id
                })

                await newTransaction.save();
                return newTransaction;
            } catch (error) {
                console.log("Error creating Transaction:", error);
                throw new Error("Error creating Transaction");            }
        },
        updateTransaction: async(_, {input}) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new: true});
                return updatedTransaction;
            } catch (error) {
                console.log("Error updating transaction:", error);
                throw new Error("Error updating transaction");
            }
        },
        deleteTransaction: async(_, {transactionId}) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch (error) {
                console.log("Error deleting transaction:", error);
                throw new Error("Error deleting transaction");
            }
        },
    }
}

export default transactionResolver;