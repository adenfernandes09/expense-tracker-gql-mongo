import User from "../models/user.model.js";
import bycrypt from 'bcryptjs'
const userResolver = {
    Mutation: {
        signUp: async(_,{input},context) => {
            try {
                const {username, name, password, gender} = input;
                if(!username || !name || !password || !gender){
                    throw new Error('All fields are required');
                }

                const existingUser = await User.findOne({username});
                if(existingUser){
                    throw new Error('User already exists');
                }

                const salt = await bycrypt.genSalt(10);
                const hashedPassword = await bycrypt.hash(password, salt);

                //https://avatar.iran.liara.run/public/boy?username=${username}
                const maleAvatar = `https://avatar.iran.liara.run/public/boy?username=${username}`;
                const femaleAvatar = `https://avatar.iran.liara.run/public/girl?username=${username}`;

                const newUser =  new User({
                    username, 
                    name, 
                    password: hashedPassword,
                    gender, 
                    profilePicture: gender === 'male' ? maleAvatar: femaleAvatar,
                })
                
                await newUser.save();
                await context.login(newUser);                 
                return newUser;

            } catch (error) {
                console.error(`Error in signup`, error);
                throw new Error(error.message || "Internal server error");
            }
        },

        login: async(_,{input},context) => {
            try {
                const {username, password} = input;
                const {user} = await context.authenticate('graphql-local', {username, password});
                console.log("Control is over here", user);
                await context.login(user);
                return user;   
            } catch (error) {
                console.error(`Error in login`, error);
                throw new Error(error.message || "Internal server error");
            }

        },

        logout: async(_,__,context) => {
            try {
                await context.logout();
                context.req.session.destroy((err) => {
                    if(err) throw err
                }),
                context.res.clearCookie('connect.sid');
                return {message: "Logged out succesfully"}
            } catch (error) {
                console.error(`Error in logout`, error);
                throw new Error(error.message || "Internal server error");
            }

        }
    },

    Query: {
        authUser: async(_,__,context) => {
            try {   
                const user = await context.getUser();
                return user;
                
            } catch (error) {
                console.error(`Error in Authenticating User`, error);
                throw new Error(error.message || "Internal server error");
            }
        },
        user:  async(_, {userId}) => {
            try {
                const user = await User.findById(userId);
                return user;
            } catch (error) {
                console.error(`Error in finding user`, error);
                throw new Error(error.message || "Internal server error");
            }
        }
    },
}

export default userResolver;