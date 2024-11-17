import * as React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import { Button, Typography, Divider, Modal } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const loginSytles = {
  textAlign: "left",
  paddingRight: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}
const gridStyles = {
  textAlign: "left",
  paddingRight: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}
const signupStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
}

export default function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [registerEmail, setRegisterEmail] = React.useState("");
  const [registerPassword, setRegisterPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/home'); // /home
  };

  const handleRegister = async () => {
    try {
      console.log("Attempting to register...");
      const response = await axios.post("http://localhost:8000/users/register", {
        email: registerEmail,
        password: registerPassword,
      });
      
      console.log("Registration successful:", response.data.message);
      alert("Registration successful: " + response.data.message);

      // Close the modal after successful registration
      handleClose();
    } catch (error) {
      console.error("Registration failed:", error.response || error);
      alert(
        "Registration failed. Please ensure your email and password are valid."
      );
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/users/login", {
        email,
        password,
      });

      // Save token to localStorage or state management (e.g., Redux)
      localStorage.setItem("token", response.data.token);
      console.log("Login successful:", response.data);

      // Navigate to another page upon successful login
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your email and password.");
    }
  };


  return (
    <Box
      component="form"
      sx={loginSytles}
      noValidate
      autoComplete="off"
    >
      <Grid container spacing={8} justifyContent="center" maxWidth="md">
        {/* Left Section */}
        <Grid
          xs={12}
          md={6}
          sx={gridStyles}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            required
            id="outlined-password"
            label="Password"
            margin="dense"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
              backgroundColor: "#d32f2f",
              color: "#fff",
              padding: "10px 0",
              fontSize: "16px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#c62828",
              },
            }}
            onClick={handleLogin}
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
            onClick={handleOpen}
          >
            Create new account
          </Button>

          <Button className="my-button" onClick={handleNavigate}>
            Skip
          </Button>

        </Grid>
      </Grid>

      {/* Sign Up Modal */}
      <Modal open={open} onClose={handleClose} aria-labelledby="sign-up-modal">
        <Box
          sx={signupStyles}
        >
          <Typography
            id="sign-up-modal"
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Sign Up
          </Typography>
          <TextField required label="Full Name" margin="dense" fullWidth />
          <TextField required label="BU Email" margin="dense" fullWidth
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}          
           />
          <TextField
            required
            label="Password"
            type="password"
            margin="dense"
            fullWidth
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <TextField
            required
            label="Confirm Password"
            type="password"
            margin="dense"
            fullWidth
            // value={confirmPassword}
            // onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
              backgroundColor: "#42b72a",
              color: "#fff",
              padding: "10px 0",
              fontSize: "16px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#36a420",
              },
            }}
            onClick={handleRegister}
          >
            Sign Up
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
