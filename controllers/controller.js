import dotenv from "dotenv";
dotenv.config();

import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const index_get = (req, res) => {
    res.render('index');
}

const register_get = (req, res) => {
    res.render('register');
}

const register_post = async (req, res) => {
    console.log(req.body)
    const {username, password} = req.body;
    // Implement regex for better code
    if(!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'Invalid username'})
    } 
    if(!password || typeof password !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password'})
    } 
    if(password.length < 5) {
        return res.json({ status: 'error', error: 'Password too short'})
    }
    const encrypted = await bcrypt.hash(password,10);

    try{
        const response = await User.create({
            username,
            "password": encrypted
        })

        console.log(`User created successfully: ${response}`);
    } catch(error) {
        if(error.code === 11000) {
            return res.json({status:'error', error:'Username already in use'})
        }
        throw error;
    }
    res.json({status: 'ok'});
}

const login_get = (req, res) => {
    res.render('login');
}

const login_post = async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username}).lean()
    if(!user) {
        return res.json({status: 'error', error: 'Invalid username/password'})
    }
    if(await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({
            id:user._id, 
            username: user.username
        }, JWT_SECRET)
        return res.json({status: 'ok', data: token });
    }
    res.json({status: 'error', error: 'Invalid username/password'})
}   

const change_password_get = async (req, res) => {
    res.render('changePassword');
}

const change_password_post = async (req, res) => {
    const {token, newpassword: plainTextPassword} = req.body
    
    if(!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password'})
    } 
    if(plainTextPassword.length < 5) {
        return res.json({ status: 'error', error: 'Password too short'})
    }

    try{
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id;
        const password = await bcrypt.hash(plainTextPassword, 10)
        await User.updateOne(
            {_id},
            {$set:{password}})
        console.log('JWT decoded: ', user);

        return res.json({status: 'ok'});
    } catch(error) {
        console.log(error);
    }
}

export default {
    index_get,
    register_get,
    register_post,
    login_get,
    login_post,
    change_password_get,
    change_password_post
}