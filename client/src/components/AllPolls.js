import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import io from "socket.io-client";

const AllPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const fetchPolls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/polls`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPolls(response.data);
    } catch (err) {
      setError("Failed to fetch polls. Please try again.");
      console.error("Error fetching polls:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolls();

    socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ["websocket"],
      upgrade: false,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server for all polls");
    });

    socketRef.current.on("newPollCreated", (newPoll) => {
      console.log("New poll received:", newPoll);
      setPolls((prevPolls) => [newPoll, ...prevPolls]);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        All Polls
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={fetchPolls}
        disabled={loading}
      >
        Refresh Polls
      </Button>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {polls.map((poll) => (
          <ListItem
            key={poll._id}
            button
            component={Link}
            to={`/poll/${poll._id}`}
          >
            <ListItemText
              primary={poll.question}
              secondary={`Created by: ${poll.createdBy.username}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default AllPolls;