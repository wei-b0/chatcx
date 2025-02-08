import React, { useState, useEffect, useRef } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import axios from "axios";
import "./App.css";
import Preview from "./_components/LoginPreview/LoginPreview";

const App: React.FC = () => {
  const launchParams = useLaunchParams();
  const [error, setError] = useState<string | null>(null);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const isRegistered = useRef(false);

  useEffect(() => {
    if (!isRegistered.current && launchParams) {
      const rawData = launchParams.initDataRaw;
      const extractedUserId = launchParams.initData?.user?.id;

      console.log("Launch Params:", launchParams);

      if (rawData && extractedUserId) {
        isRegistered.current = true; // Mark as registered
        checkUserExists(extractedUserId, rawData);
      } else {
        setError("Failed to retrieve initialization data.");
        console.warn("Failed to retrieve initialization data:", {
          rawData,
          extractedUserId,
        });
      }
    }
  }, [launchParams]);

  const checkUserExists = async (userId: number, initRawData: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/user/${userId}`
      );

      if (response.data.exists) {
        setUserExists(true); // User exists, no need to register
      } else {
        setUserExists(false); // User does not exist, proceed with registration
        registerUser(initRawData, userId);
      }
    } catch (err: any) {
      console.error("Error checking user existence:", err);
      setError("Failed to check user existence.");
    }
  };

  const registerUser = async (initRawData: string, userId: number) => {
    if (!initRawData || !userId) {
      setError("Initialization data or User ID is missing.");
      console.error("Initialization data or User ID is missing:", {
        initRawData,
        userId,
      });
      return;
    }

    setError(null);
    console.log("Sending to /register:", { initRawData, userId });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/register`,
        {
          initRawData,
          userId,
        }
      );

      if (response.status === 200) {
        console.log("Registration successful:", response.data);
        window.Telegram.WebApp.close();
      } else {
        console.error("Unexpected response status:", response.status);
        throw new Error("Unexpected response status.");
      }
    } catch (err: any) {
      console.error("Error during registration:", err);

      if (err.response) {
        setError(err.response.data.error || "Registration failed.");
      } else if (err.request) {
        setError("Issue when posting to the server.");
      } else {
        setError("An unexpected error occurred.");
        console.error(err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Preview error={error} userExists={userExists} />
    </div>
  );
};

export default App;