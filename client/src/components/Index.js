import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import { Button, Typography, Divider, Modal } from "@mui/material";

export default function LoginForm() {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = React.useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const showAlert = (message, severity) => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }

      console.log("Successfully logged in!");
    } catch (err) {
      setError(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/users/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      handleClose();
      console.log("Registration successful");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
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
            name="email"
            required
            id="outlined-required"
            label="BU Email"
            margin="dense"
            fullWidth
            value={loginData.email}
            onChange={handleLoginChange}
          />
          <TextField
            name="password"
            required
            id="outlined-password"
            label="Password"
            margin="dense"
            type="password"
            fullWidth
            value={loginData.password}
            onChange={handleLoginChange}
          />
          <Button
            type="submit"
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
            onClick={handleOpen}
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

      {/* Sign Up Modal */}
      <Modal open={open} onClose={handleClose} aria-labelledby="sign-up-modal">
        <Box
          component="form"
          onSubmit={handleRegister}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography
            id="sign-up-modal"
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Sign Up
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            name="username"
            required
            label="Full Name"
            margin="dense"
            fullWidth
            value={registerData.username}
            onChange={handleRegisterChange}
          />
          <TextField
            name="email"
            required
            label="BU Email"
            margin="dense"
            fullWidth
            value={registerData.email}
            onChange={handleRegisterChange}
          />
          <TextField
            name="password"
            required
            label="Password"
            type="password"
            margin="dense"
            fullWidth
            value={registerData.password}
            onChange={handleRegisterChange}
          />
          <TextField
            name="confirmPassword"
            required
            label="Confirm Password"
            type="password"
            margin="dense"
            fullWidth
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
          />
          <Button
            type="submit"
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
          >
            Sign Up
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
