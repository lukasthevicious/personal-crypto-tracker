import { StyledFooter } from "./styled";
import logoDogFooter from "../../assets/logoDogFooter.png";
import { FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";
import { IconButton } from "@mui/material";
import { useHistory } from "react-router-dom";
import { FC } from "react";

const Footer: FC = () => {
  const history = useHistory();

  return (
    <StyledFooter>
      <div className="container">
        <div className="row">
          <div className="col" onClick={() => history.push("/dashboard")}>
            <img alt="logo" src={logoDogFooter} height="60px" width="60px" />
            <h4>CryptoTracker</h4>
          </div>
          <div className="row-icons">
            <IconButton sx={{ color: "#e6fcfc" }}>
              <FiTwitter size={25} />
            </IconButton>
            <IconButton sx={{ color: "#e6fcfc" }}>
              <FiFacebook size={25} />
            </IconButton>
            <IconButton sx={{ color: "#e6fcfc" }}>
              <FiInstagram size={25} />
            </IconButton>
          </div>
        </div>
        <hr />
        <div className="row">
          <p className="text-left">
            &copy;{new Date().getFullYear()} CryptoTracker | All rights reserved
          </p>
          <p className="text-right">Made with ❤️ in Střížkov</p>
        </div>
      </div>
    </StyledFooter>
  );
};

export default Footer;
