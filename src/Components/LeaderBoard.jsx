import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getDatabase, ref, onValue } from "firebase/database";
import { delay, motion } from "framer-motion";

const theme = createTheme();

const BackgroundVideo = styled("video")({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  zIndex: -1,
  opacity: 1,
});

const LeaderboardContainer = styled(Box)(({ theme }) => ({
  maxWidth: "1000px",
  margin: "20px auto",
  padding: "60px",
  backgroundColor: "#f0f7f0",
  borderRadius: "24px",
  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.25)",
  },
  [theme.breakpoints.down("sm")]: {
    margin: "10px",
    padding: "20px",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#f1f8e9",
  color: "black",
  fontSize: "1.2rem",
  fontWeight: 700,
  padding: "20px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "3px solid rgb(107, 141, 109)",
  fontFamily: "'Roboto Condensed', sans-serif",
  [theme.breakpoints.down("sm")]: {
    padding: "14px 10px",
    fontSize: "1rem",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#e8f5e9",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#c8e6c9",
    },
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#f1f8e9",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#dcedc8",
    },
  },
  "& td": {
    padding: "16px",
    [theme.breakpoints.down("sm")]: {
      padding: "12px 8px",
      fontSize: "0.875rem",
    },
  },
}));

const SearchField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    borderRadius: "12px",
    transition: "all 0.3s",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(46, 125, 50, 0.1)",
    },
    "&:hover fieldset": {
      borderColor: "#43a047",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2e7d32",
      borderWidth: "2px",
    },
  },
  "& input": {
    padding: "16px",
    fontSize: "1rem",
  },
});

const Leaderboard = () => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");

  const fadeProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  useEffect(() => {
    const db = getDatabase();
    const teamsRef = ref(db, "teams");

    const unsubscribe = onValue(
      teamsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const teamData = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          teamData.sort((a, b) => b.overall - a.overall);
          setTeams(teamData);
        } else {
          setTeams([]);
        }
      },
      (error) => {
        console.error("Error fetching teams:", error);
        setError(error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTeams = teams.filter((team) =>
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      {/* Background Video */}
      <BackgroundVideo autoPlay loop muted>
        <source src="istockphoto-129186377-640_adpp_is.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </BackgroundVideo>

      <LeaderboardContainer>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Typography
            variant={isMobile ? "h4" : "h3"}
            align="center"
            gutterBottom
            sx={{
              color: "#1b5e20",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "2rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "60px",
                height: "4px",
                backgroundColor: "#2e7d32",
                borderRadius: "2px",
              },
            }}
          >
            Leaderboard
          </Typography>

          <SearchField
            fullWidth
            placeholder="Search teams..."
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            sx={{ marginBottom: "2rem" }}
          />

          {error ? (
            <Typography variant="h6" color="error" align="center">
              {error}
            </Typography>
          ) : filteredTeams.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <CircularProgress
                  style={{ color: "#2e7d32" }}
                  size={60}
                  thickness={5}
                />
              </motion.div>
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      align="center"
                      sx={{ backgroundColor: "green", color: "white" }}
                    >
                      Rank
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{ backgroundColor: "green", color: "white" }}
                    >
                      Team Name
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{ backgroundColor: "green", color: "white" }}
                    >
                      Score
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTeams.map((team, index) => {
                    const originalIndex = teams.findIndex(
                      (t) => t.id === team.id
                    );
                    return (
                      <motion.tr
                        key={team.id}
                        initial={{ opacity: 0, x: -80 }}
                        animate={{ opacity: 1, x: 30 }}
                        whileHover={{ scale: 1.5 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <StyledTableCell
                          align="center"
                          sx={{
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            color: originalIndex < 3 ? "#1b5e20" : "inherit",
                          }}
                        >
                          {originalIndex + 1}
                          {originalIndex < 3 && " 🏆"}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          sx={{
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            fontFamily: "sans-serif",
                            color: "#2e7d32",
                          }}
                        >
                          {team.teamName}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          sx={{
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            color: "#2e7d32",
                          }}
                        >
                          {team.overall}
                        </StyledTableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </motion.div>
      </LeaderboardContainer>
    </ThemeProvider>
  );
};

export default Leaderboard;

// import React, { useEffect, useState } from 'react';
// import { getDatabase, ref, onValue } from 'firebase/database';
// import { motion } from 'framer-motion';
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   TextField,
//   CircularProgress,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { useMediaQuery } from '@mui/material';

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   backgroundColor: '#2e7d32',
//   color: 'white',
//   fontSize: '1rem',
//   fontWeight: 600,
//   textAlign: 'center',
//   padding: '16px',
//   [theme.breakpoints.down('sm')]: {
//     padding: '12px 8px',
//     fontSize: '0.875rem',
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: '#e8f5e9',
//     transition: 'background-color 0.3s',
//     '&:hover': {
//       backgroundColor: '#c8e6c9',
//     },
//   },
//   '&:nth-of-type(even)': {
//     backgroundColor: '#f1f8e9',
//     transition: 'background-color 0.3s',
//     '&:hover': {
//       backgroundColor: '#dcedc8',
//     },
//   },
//   '& td': {
//     padding: '16px',
//     [theme.breakpoints.down('sm')]: {
//       padding: '12px 8px',
//       fontSize: '0.875rem',
//     },
//   },
// }));

// const SearchField = styled(TextField)({
//   '& .MuiOutlinedInput-root': {
//     backgroundColor: 'white',
//     borderRadius: '8px',
//     '&:hover fieldset': {
//       borderColor: '#43a047',
//     },
//     '&.Mui-focused fieldset': {
//       borderColor: '#2e7d32',
//     },
//   },
//   '& input': {
//     padding: '14px',
//   },
// });

// const LeaderboardContainer = styled(Box)(({ theme }) => ({
//   maxWidth: '1000px',
//   margin: '20px auto',
//   padding: '24px',
//   backgroundColor: '#f9fbe7',
//   borderRadius: '16px',
//   boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
//   [theme.breakpoints.down('sm')]: {
//     margin: '10px',
//     padding: '16px',
//   },
// }));

// const RankCell = styled(TableCell)(({ rank }) => ({
//   fontWeight: 600,
//   textAlign: 'center',
//   color: rank <= 3 ? '#2e7d32' : 'inherit',
//   fontSize: rank <= 3 ? '1.1rem' : '1rem',
// }));

// const Leaderboard = () => {
//   const [teams, setTeams] = useState([]);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const isMobile = useMediaQuery('(max-width:600px)');

//   useEffect(() => {
//     const db = getDatabase();
//     const teamsRef = ref(db, 'teams');

//     const unsubscribe = onValue(
//       teamsRef,
//       (snapshot) => {
//         const data = snapshot.val();
//         if (data) {
//           const teamData = Object.keys(data).map((key) => ({
//             id: key,
//             ...data[key],
//           }));
//           teamData.sort((a, b) => b.overall - a.overall);
//           setTeams(teamData);
//         } else {
//           setTeams([]);
//         }
//       },
//       (error) => {
//         console.error('Error fetching teams:', error);
//         setError(error.message);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const filteredTeams = teams.filter((team) =>
//     team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <LeaderboardContainer>
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Typography
//           variant={isMobile ? 'h5' : 'h4'}
//           align="center"
//           gutterBottom
//           sx={{
//             color: '#1b5e20',
//             fontWeight: 700,
//             textTransform: 'uppercase',
//             letterSpacing: '0.1em',
//             marginBottom: '1.5rem',
//             textShadow: '0 2px 4px rgba(0,0,0,0.1)',
//           }}
//         >
//           Leaderboard
//         </Typography>

//         <SearchField
//           fullWidth
//           placeholder="Search teams..."
//           value={searchTerm}
//           onChange={handleSearchChange}
//           sx={{ marginBottom: 4 }}
//         />

//         {error ? (
//           <Typography variant="h6" color="error" align="center">
//             {error}
//           </Typography>
//         ) : filteredTeams.length === 0 ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//             <CircularProgress style={{ color: '#2e7d32' }} />
//           </Box>
//         ) : (
//           <TableContainer
//             component={Paper}
//             sx={{
//               borderRadius: '12px',
//               overflow: 'hidden',
//               boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//             }}
//           >
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <StyledTableCell>Rank</StyledTableCell>
//                   <StyledTableCell>Team Name</StyledTableCell>
//                   <StyledTableCell>Score</StyledTableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredTeams.map((team, index) => (
//                   <motion.tr
//                     key={team.id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                   >
//                     <StyledTableRow>
//                       <RankCell rank={index + 1}>
//                         {index + 1}
//                         {index < 3 && ' 🏆'}
//                       </RankCell>
//                       <TableCell align="center">{team.teamName}</TableCell>
//                       <TableCell align="center" sx={{ fontWeight: 600 }}>
//                         {team.overall}
//                       </TableCell>
//                     </StyledTableRow>
//                   </motion.tr>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </motion.div>
//     </LeaderboardContainer>
//   );
// };

// export default Leaderboard;
