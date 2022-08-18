import React from "react";
import { ProgressBar } from "react-bootstrap";
import PropTypes from "prop-types";
const UserProgressBar = (props) => {
  const { now, label, width, height, max } = props;
  return (
    <div className="userBar_design  mt-2 ">
      <div className="progressBar">
        <ProgressBar
          animated
          now={now}
          label={label}
                  style={{ width: width, height: height }}
                  max={max}
        />
      </div>
    </div>
  );
};
// Specifies the default values for props:
UserProgressBar.defaultProps = {
  className: "progressBar",
  label: "",
  now: 0,
  width: "auto",
    height: "10px",
  max:""
};

// Typechecking With PropTypes
UserProgressBar.propTypes = {
  now: PropTypes.string,
  label: PropTypes.string,
  width: PropTypes.string,
    height: PropTypes.string,
  max:PropTypes.string
};
/* Exports ================================================================== */
export default UserProgressBar;
