import React from "react";
import { Container, Typography, Button, Grid2 } from "@mui/material";
import { Link } from "react-router-dom";

const Home = ({ isLoggedIn }) => {
  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Poll App
      </Typography>
      <Grid2 container spacing={2}>
        {/* Conditionally render Login and Register buttons if the user is NOT logged in */}
        {!isLoggedIn && (
          <>
            <Grid2 item>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="secondary"
              >
                Login
              </Button>
            </Grid2>
            <Grid2 item>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                color="primary"
              >
                Register
              </Button>
            </Grid2>
          </>
        )}

        {/* Render Create Poll and Profile only when the user is logged in */}
        {isLoggedIn && (
          <>
            <Grid2 item>
              <Button
                component={Link}
                to="/polls"
                variant="outlined"
                color="primary"
              >
                View All Polls
              </Button>
            </Grid2>
            <Grid2 item>
              <Button
                component={Link}
                to="/create-poll"
                variant="contained"
                color="primary"
              >
                Create Poll
              </Button>
            </Grid2>
            <Grid2 item>
              <Button
                component={Link}
                to="/profile"
                variant="outlined"
                color="secondary"
              >
                User Profile
              </Button>
            </Grid2>
          </>
        )}
      </Grid2>
    </Container>
  );
};

export default Home;
