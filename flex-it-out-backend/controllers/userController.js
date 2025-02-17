const User = require("../models/User");
const { uploadOnCloudinary } = require('../utils/cloudinary.js')

exports.getProfile = async (req, res) => {
  try {
    // Find user by ID (from the authenticated user)
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
    try {
        // Destructure body for profile data
        const { name, calories, phoneNumber, email } = req.body;

        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Upload profile image if provided
        if (req.file) {
            const uploadResponse = await uploadOnCloudinary(req.file.path);
            if (uploadResponse) {
                console.log(uploadResponse);
                user.avatar = uploadResponse.url;
            }
        }

        // Update name if provided
        if (name) {
            user.name = name;
        }

        // Update phone number and email if provided and valid
        if (phoneNumber && !isNaN(phoneNumber)) {
            user.phoneNumber = phoneNumber;
        }
        
        if (email && /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            user.email = email;
        }

        // Update calories only if it's a valid number
        if (calories !== undefined && !isNaN(calories)) {
            user.calories = Number(calories);
        }

        // Save updated user data
        await user.save();

        res.json({ message: "Profile updated", user });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server Error" });
    }
}
