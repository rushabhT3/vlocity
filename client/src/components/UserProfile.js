import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(response.data);
      setUsername(response.data.username);
      setEmail(response.data.email);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Avatar
        src={
          user.profilePicture
            ? `${process.env.REACT_APP_BACKEND_URL}${user.profilePicture}`
            : undefined
        }
        alt={user.username}
        sx={{ width: 100, height: 100, mb: 2 }}
      />
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span">
            Upload Profile Picture
          </Button>
        </label>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Update Profile
        </Button>
      </form>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Created Polls: {user.createdPolls.length}
      </Typography>
      <Typography variant="h6">
        Voted Polls: {user.votedPolls.length}
      </Typography>
    </Container>
  );
};

export default UserProfile;
