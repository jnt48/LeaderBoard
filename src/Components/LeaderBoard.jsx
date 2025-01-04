import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import SparkleBackground from "./SparkleBackground";

const Leaderboard = () => {
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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

    const getTrophyEmoji = (rank) => {
        if (rank === 1) return "🏆";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return "";
    };

    return (
        <div className="relative bg-black min-h-screen flex flex-col items-center justify-center text-white">
            <SparkleBackground />
            <div
                className="relative z-10 w-full max-w-4xl p-8 backdrop-blur-md rounded-lg shadow-xl mt-20"
                style={{
                    background: "rgba(0, 0, 0, 0.6)",  // Slightly darker background for transparency effect
                    border: "2px solid rgba(34, 197, 94, 1)",  // Green neon border
                    boxShadow: "0 0 15px rgba(34, 197, 94, 0.8)",  // Neon glow effect
                }}
            >
                <h1 className="text-4xl font-extrabold text-center mb-6 text-gradient">Leaderboard</h1>
                <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-4 mb-6 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : filteredTeams.length === 0 ? (
                    <p className="text-center text-gray-400">No teams found.</p>
                ) : (
                    <table className="table-auto w-full text-left text-sm text-white">
                        <thead className="bg-green-600 text-white">
                            <tr>
                                <th className="p-4">Rank</th>
                                <th className="p-4">Team Name</th>
                                <th className="p-4">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTeams.map((team, index) => (
                                <tr
                                    key={team.id}
                                    className={`border-b-2 border-green-600 ${
                                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                                    } hover:bg-green-500 transition duration-200 ease-in-out`}
                                >
                                    <td className="p-4">{index + 1} {getTrophyEmoji(index + 1)}</td>
                                    <td className="p-4">{team.teamName}</td>
                                    <td className="p-4">{team.overall}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
