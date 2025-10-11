import { loginUser, registerUser, generateToken } from "src/services/authService.js";

const setJwtCookie = (res, token) => {
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, 
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        path: '/'
    });
};



export const signup = async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        if (!email || !password || !userType) {
            return res.status(400).json({
                message: "Email, password and userType are required"
            });
        }
        const newUser = await registerUser({ email, password, userType });
        const token = generateToken({
            userId: newUser._id,
            email: newUser.email,
            userType: newUser.userType
        });
      
        setJwtCookie(res, token);
        res.status(201).json({
            message: "Signup successful",
            user: {
                _id: newUser._id,
                email: newUser.email,
                userType: newUser.userType,
                onboardingCompleted: newUser.onboardingCompleted
            },
            token
        });
    } catch (error) {
      console.error("Signup Error:", error); 
      res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Call service to validate credentials and get user
        const user = await loginUser({ email, password });

        // 2. Call service to generate a token
        const token = generateToken({
            userId: user._id,
            email: user.email,
            userType: user.userType
        });

        setJwtCookie(res, token);
        
    
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                email: user.email,
                userType: user.userType,
                name: user.name,
                basicDetails: user,
                onboardingCompleted: user.onboardingCompleted
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Internal Server Error' });
    }
};

export const logout = async (req, res) => {
  // console.log("hero");
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    });
    //localStorage.removeItem() ;
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
