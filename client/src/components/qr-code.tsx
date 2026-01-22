import { useEffect, useState } from "react";

interface QRCodeProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  className?: string;
}

export function QRCode({ value, size = 128, level = "M", className }: QRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function generateQR() {
      try {
        const QRCodeLib = await import("qrcode");
        const url = await QRCodeLib.toDataURL(value, {
          width: size,
          margin: 1,
          errorCorrectionLevel: level,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });
        setQrDataUrl(url);
        setError("");
      } catch (err) {
        console.error("QR Code generation failed:", err);
        setError("Failed to generate QR code");
      }
    }

    if (value) {
      generateQR();
    }
  }, [value, size, level]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground text-xs ${className}`}
        style={{ width: size, height: size }}
      >
        {error}
      </div>
    );
  }

  if (!qrDataUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-muted animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img
      src={qrDataUrl}
      alt="QR Code"
      width={size}
      height={size}
      className={className}
    />
  );
}
