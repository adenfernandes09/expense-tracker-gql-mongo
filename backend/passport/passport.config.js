import passport from "passport";
import bycrypt from 'bcryptjs';

import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport = async() => {
    passport.serializeUser((user, done) => {
		console.log("Serializing user");
		done(null, user._id);
	});

	passport.deserializeUser(async (_id, done) => {
		console.log("Deserializing user");
		try {
			const user = await User.findById(_id);
			done(null, user);
		} catch (err) {
			done(err);
		}
	});

    passport.use(
        new GraphQLLocalStrategy(async(username, password, done) => {
            try {
                const user = await User.findOne({username});
                if(!user){
                    throw new Error("Invalid Username or Password");
                }
                const validPassword =  await bycrypt.compare(password, user.password);
                if(!validPassword){
                    throw new Error("Invalid username or Password")
                }
                console.log("Valid username and password exist", )
                return done(null, user);
            } catch (err) {
                return done(err)
            }
        })
    )
}