import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import { Button, Typography, Divider, Modal } from "@mui/material";

export default function LoginForm() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
          <TextField required label="Full Name" margin="dense" fullWidth />
          <TextField required label="BU Email" margin="dense" fullWidth />
          <TextField
            required
            label="Password"
            type="password"
            margin="dense"
            fullWidth
          />
          <TextField
            required
            label="Confirm Password"
            type="password"
            margin="dense"
            fullWidth
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
            onClick={handleClose}
          >
            Sign Up
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
