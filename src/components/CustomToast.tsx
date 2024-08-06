// CustomToast.tsx
import React from "react";

interface CustomToastProps {
  imageSrc: string;
}

const CustomToast: React.FC<CustomToastProps> = ({ imageSrc }) => {

  return (
    <div>
      <img
        src={`https://humbertocastro.github.io/gymAttendence/${imageSrc}`}
        alt="Custom"
        style={{ width: "250px", marginRight: "10px" }}
      />
    </div>
  );
};

export default CustomToast;
