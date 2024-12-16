import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import UserModel from './Models/Users.js';
import ServiceModel from './Models/Services.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

let app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
// MongoDB connection string (make sure to replace the password with your own for security)
const conStr = process.env.MONGODB_URI;

mongoose.connect(conStr, { useNewUrlParser: true, useUnifiedTopology: true })


// Register User
app.post("/insertUser", async (req, res) => {
  try {
    const { uname, email, password } = req.body;

    // Validate input
    if (!uname || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save the user
    const newUser = new UserModel({ uname, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration Error: ", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});


// Updating the Password in Profile component
// Updating the Password in Profile component
app.put('/updateUser', async (req, res) => {
  console.log('Request body:', req.body); // Check the data received by the server
  const { uname, email, currentPassword, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the current password matches the stored password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.uname = uname;  // Update name
    user.password = hashedPassword; // Update password

    await user.save(); // Save updated user data to DB
    res.status(200).json({ message: "User updated successfully." }); // Return success message
  } catch (error) {
    console.error("Update Error: ", error);
    res.status(500).json({ message: "Server error during update." });
  }
});


// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    return res.status(200).json({ user, message: "Login successful." });
  } catch (error) {
    console.error("Login Error: ", error);
    res.status(500).json({ message: "Server error during login." });
  }
});



// Logout
app.post("/logout", async (req, res) => {
  try {
    res.send({ message: 'Logged out successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

// Add Service
app.post("/addService", async (req, res) => {
  try {
    const { mobileNumber, stationName, lat, lng } = req.body;

    // Validate the input fields
    if (!mobileNumber || !stationName || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "All fields are required " });
    }

    const newService = new ServiceModel({
      mobileNumber,
      stationName,
      lat,
      lng,
    });

    await newService.save();
    res.status(200).json({ service: newService, message: "Service Added." });
  } catch (error) {
    console.error("Add Service Error: ", error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
});

// Get Services
app.get("/getService", async (req, res) => {
  try {
    const services = await ServiceModel.find();
    res.status(200).json(services);
  } catch (error) {
    console.error("Get Services Error: ", error);
    res.status(500).json({ message: "Failed to get services." });
  }
});

// Delete Service
app.delete("/deleteService/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await ServiceModel.findByIdAndDelete(id);
    if (!deletedService) {
      return res.status(404).json({ message: "Service not found." });
    }
    res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    console.error("Delete Service Error: ", error);
    res.status(500).json({ message: "Failed to delete service." });
  }
});

// Update Service
app.put("/updateService/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { mobileNumber, stationName, lat, lng } = req.body;

    // Validate the input fields
    if (!mobileNumber || !stationName || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "All fields are required " });
    }

    const updatedService = await ServiceModel.findByIdAndUpdate(
      id,
      { mobileNumber, stationName, lat, lng },
      { new: true } // Return the updated document
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json({ service: updatedService, message: "Service updated successfully." });
  } catch (error) {
    console.error("Update Service Error: ", error);
    res.status(500).json({ message: "Failed to update service." });
  }
});


app.listen(process.env.PORT || 8080, () => {
  console.log("Server is running...");
});
