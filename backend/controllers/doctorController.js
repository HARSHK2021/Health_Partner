// Get User Profile
import User from "../models/User.js";
import express from "express";
import mongoose from "mongoose";

export const getUserProfile = async (req, res) => {
    console.log("user from ",req.user)
        res.status(200).json(req.user)
}
