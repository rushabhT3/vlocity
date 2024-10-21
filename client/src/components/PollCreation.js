import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const PollCreation = () => {
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPoll = { question, options: [option1, option2] };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/polls/create`,
        newPoll,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Poll created:", response.data);

      // Emit the new poll to all clients
      const socket = io(process.env.REACT_APP_BACKEND_URL);
      socket.emit("newPollCreated", response.data);

      // Clear input fields
      setQuestion("");
      setOption1("");
      setOption2("");
      // Redirect to AllPolls page
      navigate("/polls");
    } catch (error) {
      console.error("Error creating poll", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Create Poll</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Poll Question"
          fullWidth
          margin="normal"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <TextField
          label="Option 1"
          fullWidth
          margin="normal"
          value={option1}
          onChange={(e) => setOption1(e.target.value)}
        />
        <TextField
          label="Option 2"
          fullWidth
          margin="normal"
          value={option2}
          onChange={(e) => setOption2(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Create Poll
        </Button>
      </form>
    </Container>
  );
};

export default PollCreation;
