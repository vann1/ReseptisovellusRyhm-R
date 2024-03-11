import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
const ProfileButton = () => {
    const {user} = useAuthContext();
    const navigate = useNavigate();
    const handleProfilePage = async () => {
        navigate('/ProfilePage');
    }



    return(
        <button onClick={handleProfilePage}>{user.email}</button>
    )
}

export {ProfileButton}