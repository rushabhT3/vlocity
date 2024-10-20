import React, { useEffect, useState, useCallback, useRef } from "react";
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
// import io from "socket.io-client";
import CommentSection from "./CommentSection";

const PollDetails = () => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingError, setVotingError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchPoll();
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

  const handleVote = async (optionIndex) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/polls/vote`,
        { pollId: id, optionIndex },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh poll data after voting
      fetchPoll();
    } catch (err) {
      setVotingError("Failed to submit vote. Please try again.");
      console.error("Error voting:", err);
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