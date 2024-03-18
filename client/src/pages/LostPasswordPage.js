import React, { useContext, useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import {useNavigate} from "react-router-dom"
import LostPasswordForm from "../components/LostPasswordForm";

const LostPassword = () => { 
  const [virheViesti, setVirheViesti] = useState("");
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

    return (
      <div>
        <h1>Palauta salasana</h1>
        <LostPasswordForm virheViesti={virheViesti}  isLoading={isLoading}></LostPasswordForm>
      </div>
    );
}

export default LostPassword;