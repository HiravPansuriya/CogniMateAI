import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: "No account found with this email. Please register first." 
    });
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401).json({ success: false, message: "Invalid password. Please try again." });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ 
      success: false, 
      message: "An account already exists with this email. Please login instead." 
    });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400).json({ success: false, message: "Invalid user data. Please check your inputs." });
  }
};

// @desc    Google Auth
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if it doesn't exist
      // We generate a random password since they use Google Login
      const randomPassword = Math.random().toString(36).slice(-8);
      user = await User.create({
        name,
        email,
        avatar: picture,
        password: randomPassword,
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Google authentication failed" });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        createdAt: updatedUser.createdAt,
      },
    });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
};

export { authUser, registerUser, googleAuth, getUserProfile, updateUserProfile };

