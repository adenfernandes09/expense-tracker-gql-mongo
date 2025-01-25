const userTypeDef = `#graphql
 type User {
    _id: ID!
    username: String!
    name: String!
    password: String!
    profilePicture: String
    gender: String!
 }

 type Query {
    users: [User!]
    authUser: User
    user(userId:ID): User
 }

 type Mutations {
    signUp(input: SignUpinput): User
    login(input: LogInInput): User
    logout: LogOutResponse
 }

 input SignUpinput {
    username: String!
    name: String!
    password: String!
    gender: String!
 }
 
 input LogInInput{
    username: String!
    password: String!
 }

 type LogOutResponse {
    message: String!
 }
`

export default userTypeDef