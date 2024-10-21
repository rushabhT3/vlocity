import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

import CommentSection from "./CommentSection";

const PollDetails = () => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingError, setVotingError] = useState(null);
  const { id } = useParams();
  const socketRef = useRef(null);

  useEffect(() => {
    fetchPoll();

    socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ["websocket"],
      upgrade: false,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server for polls");
      socketRef.current.emit("joinPollRoom", id);
    });

    socketRef.current.on("pollUpdated", handlePollUpdate);

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leavePollRoom", id);
        socketRef.current.off("pollUpdated");
        socketRef.current.disconnect();
      }
    };
  }, [id]);

  const fetchPoll = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/polls/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPoll(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch poll details. Please try again.");
      setLoading(false);
      console.error("Error fetching poll details:", err);
    }
  };

  const handlePollUpdate = (updatedPoll) => {
    console.log("Received updated poll:", updatedPoll);
    setPoll((prevPoll) => ({ ...prevPoll, ...updatedPoll }));
  };

  const handleVote = async (optionIndex) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/polls/vote`,
        { pollId: id, optionIndex },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // We don't update the state here. We'll wait for the socket to send us the updated poll.
      setVotingError(null);
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.message === "You have already voted in this poll"
      ) {
        setVotingError("You have already voted in this poll.");
      } else {
        setVotingError("Failed to submit vote. Please try again.");
        console.error("Error voting:", err);
      }
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!poll) return <Typography>No poll found</Typography>;

  return (
    <Container>
      <Typography variant="h4">{poll.question}</Typography>
      <Box my={2}>
        {poll.options.map((option, index) => (
          <Button
            key={index}
            variant="contained"
            style={{ margin: "10px" }}
            onClick={() => handleVote(index)}
          >
            {option} -{" "}
            {poll.votes.filter((vote) => vote.option === index).length} votes
          </Button>
        ))}
      </Box>
      <Typography variant="subtitle1">
        Created by: {poll.createdBy ? poll.createdBy.username : "Unknown"}
      </Typography>
      <Snackbar
        open={!!votingError}
        autoHideDuration={6000}
        onClose={() => setVotingError(null)}
        message={votingError}
      />
      <Box mt={4}>
        <CommentSection pollId={id} />
      </Box>
    </Container>
  );
};

export default PollDetails;
