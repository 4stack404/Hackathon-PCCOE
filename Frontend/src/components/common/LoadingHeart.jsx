import React from 'react';
import { Box, Fade } from '@mui/material';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingHeart = ({ size = 200 }) => {
  return (
    <Fade in={true} timeout={150}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at center, #ffffff 0%, #fff5f8 30%, #fde2eb 60%, #fcadc7 100%)",
          backdropFilter: "blur(5px)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: size,
            height: size,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DotLottieReact
            src="https://lottie.host/2c0ebc0d-7900-4883-adf3-be76105b6d72/mY91E8TIAL.lottie"
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
            renderer="svg"
            renderSettings={{
              preserveAspectRatio: 'xMidYMid meet',
              progressiveLoad: false
            }}
          />
        </Box>
        
        <Box
          sx={{
            mt: 2,
            fontWeight: "bold",
            color: "#ff004c",
            textAlign: "center",
            textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            fontSize: "1.2rem",
            letterSpacing: "1px",
          }}
        >
          Loading...
        </Box>
      </Box>
    </Fade>
  );
};

export default LoadingHeart;
