const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Create nodemailer transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            role: user.role,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            role: user.role,
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Forgot password — send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide an email address' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No account found with that email' });
        }

        // Generate reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        // Build reset URL — use the Origin header or Referer, fallback to request host
        const origin = req.headers.origin || req.headers.referer || `${req.protocol}://${req.get('host')}`;
        const resetUrl = `${origin.replace(/\/$/, '')}/reset-password/${resetToken}`;

        // Email content
        const mailOptions = {
            from: `"PlacePrep" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'PlacePrep — Password Reset Request',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0a0a0a; border-radius: 16px; overflow: hidden; border: 1px solid #1a1a2e;">
                    <div style="padding: 32px 28px; text-align: center; background: linear-gradient(135deg, #0a0a0a 0%, #111827 100%);">
                        <div style="display: inline-block; background: #a3e635; padding: 10px 16px; border-radius: 12px; margin-bottom: 16px;">
                            <span style="font-size: 20px; font-weight: 800; color: #000;">🚀 PlacePrep</span>
                        </div>
                        <h1 style="color: #ffffff; font-size: 22px; margin: 12px 0 4px;">Password Reset</h1>
                        <p style="color: #9ca3af; font-size: 14px; margin: 0;">You requested a password reset for your account.</p>
                    </div>
                    <div style="padding: 24px 28px;">
                        <p style="color: #d1d5db; font-size: 14px; line-height: 1.6;">
                            Hi <strong style="color: #ffffff;">${user.name}</strong>, click the button below to reset your password. This link expires in <strong style="color: #a3e635;">10 minutes</strong>.
                        </p>
                        <div style="text-align: center; margin: 24px 0;">
                            <a href="${resetUrl}" style="display: inline-block; background: #a3e635; color: #000000; padding: 12px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">
                                Reset Password
                            </a>
                        </div>
                        <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
                            If you didn't request this, ignore this email. Your password will remain unchanged.
                        </p>
                        <hr style="border: 0; border-top: 1px solid #1f2937; margin: 20px 0;" />
                        <p style="color: #4b5563; font-size: 11px; word-break: break-all;">
                            If the button doesn't work, copy this link:<br/>
                            <a href="${resetUrl}" style="color: #a3e635;">${resetUrl}</a>
                        </p>
                    </div>
                </div>
            `,
        };

        const transporter = createTransporter();
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Password reset email sent! Check your inbox.' });
    } catch (error) {
        console.error('Forgot password error:', error.message);

        // Clear the token if email failed
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }

        res.status(500).json({ message: 'Email could not be sent. Please try again later.' });
    }
};

// @desc    Reset password using token
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Hash the URL token to compare with the stored hash
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({
            message: 'Password reset successful',
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Reset password error:', error.message);
        res.status(500).json({ message: 'Failed to reset password. Please try again.' });
    }
};

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: 'Google credential is required' });
        }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Check if user exists with this Google ID or email
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            // Link Google ID if user exists by email but not yet linked
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save({ validateBeforeSave: false });
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            role: user.role,
        });
    } catch (error) {
        console.error('Google login error:', error.message);
        res.status(401).json({ message: 'Google authentication failed' });
    }
};

// @desc    GitHub OAuth login/register
// @route   POST /api/auth/github
// @access  Public
const githubLogin = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ message: 'GitHub authorization code is required' });
        }

        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return res.status(401).json({ message: 'GitHub authentication failed: ' + tokenData.error_description });
        }

        // Fetch user profile
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'Accept': 'application/json',
            },
        });
        const githubUser = await userResponse.json();

        // Fetch email (may be private)
        let email = githubUser.email;
        if (!email) {
            const emailResponse = await fetch('https://api.github.com/user/emails', {
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`,
                    'Accept': 'application/json',
                },
            });
            const emails = await emailResponse.json();
            const primary = emails.find(e => e.primary) || emails[0];
            email = primary?.email;
        }

        if (!email) {
            return res.status(400).json({ message: 'Could not retrieve email from GitHub. Please make your email public in GitHub settings.' });
        }

        const githubId = String(githubUser.id);
        const name = githubUser.name || githubUser.login;

        // Check if user exists
        let user = await User.findOne({ $or: [{ githubId }, { email }] });

        if (user) {
            if (!user.githubId) {
                user.githubId = githubId;
                await user.save({ validateBeforeSave: false });
            }
        } else {
            user = await User.create({
                name,
                email,
                githubId,
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            role: user.role,
        });
    } catch (error) {
        console.error('GitHub login error:', error.message);
        res.status(500).json({ message: 'GitHub authentication failed' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword,
    googleLogin,
    githubLogin,
};
