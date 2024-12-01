import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";

const Index = () => {
  return (
    <Box
      sx={{
        bgcolor: "#F4F6F8",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography
          variant="h3"
          color="#cc0000"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Terrier Connect
        </Typography>
        <Typography variant="h6" sx={{ color: "gray", mb: 4 }}>
          Discover popular hashtags in the BU community!
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#CC0000",
            "&:hover": { backgroundColor: "#990000" },
          }}
        >
          Show Popular Tags
        </Button>
      </Container>
    </Box>
  );
};

export default Index;
