import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";

export default function LoginForm() {
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
      noValidate
      autoComplete="off"
    >
      <Grid container spacing={8} justifyContent="center" maxWidth="md">
        {/* Left Section */}
        <Grid
          xs={12}
          md={6}
          sx={{
            textAlign: "left",
            paddingRight: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          size={6}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: "#1877f2" }}
          >
            Terrier Connect
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "#606770", marginTop: 2, lineHeight: 1.15 }}
          >
            Connect with friends and the BU community around you on Terrier
            Connect.
          </Typography>
        </Grid>

        {/* Right Section */}
        <Grid
          xs={12}
          md={4}
          sx={{
            backgroundColor: "#fff",
            padding: 4,
            borderRadius: 1,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          size={6}
        >
          <TextField
            required
            id="outlined-required"
            label="BU Email"
            margin="dense"
            fullWidth
          />
          <TextField
            required
            id="outlined-password"
            label="Password"
            margin="dense"
            type="password"
            fullWidth
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
              backgroundColor: "#d32f2f", // Red color for the button
              color: "#fff",
              padding: "10px 0",
              fontSize: "16px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#c62828", // Darker red on hover
              },
            }}
          >
            Log In
          </Button>
          <Button
            variant="text"
            sx={{
              color: "#1877f2",
              fontSize: "14px",
              marginTop: 1,
              textTransform: "none",
            }}
          >
            Forgot password?
          </Button>
          <Divider sx={{ width: "100%", margin: "16px 0" }} />
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#42b72a",
              color: "#fff",
              padding: "10px 0",
              fontSize: "16px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#36a420",
              },
            }}
          >
            Create new account
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
