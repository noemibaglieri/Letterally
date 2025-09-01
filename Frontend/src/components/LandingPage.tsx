import { useEffect } from "react";
import { StorageService } from "../services/storage.service";
import { useNavigate } from "react-router";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = StorageService.getUser();

    if (user) {
      navigate("/homepage");
    } else {
      navigate("/login");
    }
  }, []);

  return <></>;
};

export default LandingPage;
