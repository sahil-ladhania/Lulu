import React from "react";

type LogoVariant = "mark" | "icon";
type LogoColor = "marigold" | "dark" | "light" | "cream";
type LogoFormat = "svg" | "png";

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: LogoVariant;
  color?: LogoColor;
  format?: LogoFormat;
  size?: number;
}

/**
 * Official Lulu Logo component.
 * Uses the assets located in /branding/ in the public folder.
 */
export const Logo = ({
  variant = "mark",
  color = "marigold",
  format = "svg",
  size,
  className = "",
  style,
  ...props
}: LogoProps) => {
  // Construct the filename based on brand guidelines
  // e.g., lulu-mark-marigold.svg
  const filename = `lulu-${variant}-${color}${format === "png" && variant === "mark" && color === "marigold" ? "-1024" : ""}.${format}`;
  const path = `/branding/${format}/${filename}`;

  return (
    <img
      src={path}
      alt={`Lulu ${variant}`}
      className={className}
      style={{
        width: size ? `${size}px` : "auto",
        height: size ? `${size}px` : "auto",
        objectFit: "contain",
        ...style,
      }}
      {...props}
    />
  );
};
