const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, age } = req.body;

        // Validate input fields (simplified)
        if (!name || !email || !password || !age) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if the user already exists by email
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Optionally check if phone number exists
        if (phone) {
            let existingUserWithPhone = await User.findOne({ phone });
            if (existingUserWithPhone) return res.status(400).json({ message: "Phone number already in use" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        user = new User({ name, email, password: hashedPassword, phone, age });
        await user.save();

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, age: user.age } });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

const loginUser = async (req, res) => {
    try {
      const { emailOrPhone, password, isPhone } = req.body;
  
      // Check if the user exists by email or phone number
      let user;
      if (isPhone) {
        user = await User.findOne({ phone: emailOrPhone }); // Searching by phone number
      } else {
        user = await User.findOne({ email: emailOrPhone }); // Searching by email
      }
  
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT Token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
      console.log("User logged in:", { id: user._id, username: user.name, email: user.email });
  
      res.json({
        token,
        user: {
          id: user._id,
          username: user.name,
          email: user.email,
          phone: user.phone,  // You can also send phone if required
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  };
  

module.exports = { registerUser, loginUser };
