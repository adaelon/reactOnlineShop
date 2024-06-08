import React from "react";

const IconRow = () => {
  const icons = [
    { label: "专题", color: "#FFA500", icon: "🍊" },
    { label: "话题", color: "#FF69B4", icon: "💄" },
    { label: "优选", color: "#DB7093", icon: "💖" },
    { label: "特惠", color: "#32CD32", icon: "🍴" },
  ];

  const iconStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-around",
    padding: "10px 0",
    background: "#fff",
  };

  const itemStyle: React.CSSProperties = {
    textAlign: "center" as const,
  };

  const circleStyle = (color: string): React.CSSProperties => ({
    backgroundColor: color,
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "5px",
  });

  return (
    <div style={iconStyle}>
      {icons.map((icon) => (
        <div style={itemStyle} key={icon.label}>
          <div style={circleStyle(icon.color)}>{icon.icon}</div>
          <div>{icon.label}</div>
        </div>
      ))}
    </div>
  );
};

export default IconRow;
