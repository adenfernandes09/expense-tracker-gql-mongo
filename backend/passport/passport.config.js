import passport from "passport";
import bycrypt from 'bcryptjs';

import User from "../models/user.model";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport = async() => {
    passport.serializeUser((user, done) => {
        console.log("Serializing the user");
        done(null, user.id);
    })

    passport.deserializeUser(async(id, done) => {
        try {
            const user = User.findBy(id);
            done(null, user);
        } catch (error) {
            done(err);
        }
    })

    passport.use(
        new GraphQLLocalStrategy(async(username, password, done) => {
            try {
                const user = await User.findOne({username});
                if(!user){
                    throw new Error("Invalid Username or Password");
                }
                const validPassword  = await bycrypt.compare(password, user.password);
                if(!validPassword){
                    throw new Error("Invalid username or Password")
                }
                return(done, null);
            } catch (err) {
                return done(err)
            }
        })
    )
}