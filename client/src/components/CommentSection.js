import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import axios from "axios";
import io from "socket.io-client";

const CommentSection = ({ pollId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchComments();

    socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ["websocket"],
      upgrade: false,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server for comments");
      socketRef.current.emit("joinCommentRoom", pollId);
    });

    socketRef.current.on("newComment", handleNewComment);

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveCommentRoom", pollId);
        socketRef.current.off("newComment");
        socketRef.current.disconnect();
      }
    };
  }, [pollId]);

  const handleNewComment = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/comments/poll/${pollId}`
      );
      setComments(response.data);
    } catch (err) {
      setError("Failed to fetch comments");
      console.error("Error fetching comments:", err);
    }
  };

  const submitComment = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to post a comment");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/comments`,
        { text: newComment, pollId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewComment("");
      // The server will emit the new comment, so we don't need to add it manually
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Authentication failed. Please log in again.");
        // You might want to redirect the user to the login page here
      } else {
        setError(err.response?.data?.message || "Failed to submit comment");
      }
      console.error("Error submitting comment:", err);
    }
  };

  return (
    <div>
      <Typography variant="h6">Comments</Typography>
      <TextField
        fullWidth
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment"
        margin="normal"
      />
      <Button variant="contained" onClick={submitComment}>
        Submit Comment
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {comments.map((comment) => (
          <ListItem key={comment._id}>
            <ListItemText
              primary={comment.text}
              secondary={`By: ${comment.user.username}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CommentSection;
