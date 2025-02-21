import { useEffect } from "react";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";

const MultiplayerBattle = () => {
    const { roomId } = useParams();
    const [searchParams] = useSearchParams();
    const exercise = searchParams.get("exercise"); // Extract exercise from URL
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        console.log("Joined room:", roomId, "Exercise:", exercise);
    }, [roomId, exercise]);

    const handleStartChallenge = () => {
        navigate(`/pose-detection/${exercise}`, { state: { exercise, userId } });
    };

    return (
        <div>
            <h2>Welcome to Battle Room: {roomId}</h2>
            <p>Exercise: {exercise}</p>
            <button onClick={handleStartChallenge}>Start {exercise}</button>
        </div>
    );
};

export default MultiplayerBattle;