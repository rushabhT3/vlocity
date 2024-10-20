import React, { useState, useEffect } from "react";
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

const AllPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPolls = async () => {
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
  };

  useEffect(() => {
    fetchPolls();
  }, []);

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
