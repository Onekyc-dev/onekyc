"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const FAIL_MESSAGES = {
  face_mismatch: "We couldn't confirm it was you. Make sure your face is centered and well-lit.",
  system_error: "Something went wrong on our end, not yours. Please try again in a moment.",
  camera_denied: "Camera access is required to verify it's really you.",
  default: "We couldn't confirm it was you. Please try again.",
};

export default function LivenessPage() {
  const { status } = useSession();
  const router = useRouter();
  const { sessionId } = useParams();
  const [state, setState] = useState("starting");
  const [failReason, setFailReason] = useState(null);
  const [attempts, setAttempts] = useState(1);
  const [debugInfo, setDebugInfo] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function startCamera() {
    setState("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      setDebugInfo(`track: ${track?.label || "none"} | readyState: ${track?.readyState} | videoRef: ${videoRef.current ? "present" : "NULL"}`);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          setDebugInfo((d) => `${d} | play() error: ${playErr.message}`);
        }
      }
      setState("ready");
    } catch (err) {
      setDebugInfo(`getUserMedia error: ${err.name} — ${err.message}`);
      setFailReason("camera_denied");
      setState("failed");
    }
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.9);
  }

  async function handleCheck() {
    setState("checking");
    const imageBase64 = capturePhoto();

    const res = await fetch(`/api/verify/liveness/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64 }),
    });
    const data = await res.json();

    if (data.passed) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      router.push(`/verify/${sessionId}/result`);
    } else {
      setFailReason(data.reason ?? "default");
      setState("failed");
    }
  }

  if (status === "loading") return null;

  return (
    <main className="screen">
      <div className="panel">
        <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 10 }}>Liveness check</p>

        {/* Always mounted — never conditional — so videoRef is never null when the stream arrives. */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={(e) =>
            setDebugInfo((d) => `${d} | video: ${e.target.videoWidth}x${e.target.videoHeight}`)
          }
          style={{
            width: "100%",
            borderRadius: 12,
            marginBottom: 8,
            transform: "scaleX(-1)",
            background: "#000",
            display: state === "failed" ? "none" : "block",
          }}
        />
        {debugInfo && state !== "failed" && (
          <p style={{ fontSize: 10, color: "var(--muted)", marginBottom: 16, wordBreak: "break-word" }}>
            {debugInfo}
          </p>
        )}

        {(state === "starting" || state === "ready" || state === "checking") && (
          <>
            <p className="sub" style={{ marginBottom: 16 }}>
              Center your face in the frame, then tap below.
            </p>
            <button
              className="btn btn-gold"
              onClick={handleCheck}
              disabled={state !== "ready"}
            >
              {state === "checking" ? "Checking…" : state === "starting" ? "Starting camera…" : "Check my identity"}
            </button>
          </>
        )}

        {state === "failed" && (
          <>
            <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Verification failed</p>
            <p className="sub" style={{ marginBottom: 20 }}>
              {FAIL_MESSAGES[failReason] ?? FAIL_MESSAGES.default}
            </p>
            <button
              className="btn btn-gold"
              onClick={() => {
                setAttempts((a) => a + 1);
                startCamera();
              }}
            >
              Try again
            </button>
            <p className="muted" style={{ marginTop: 10 }}>Attempt {Math.min(attempts, 3)} of 3</p>
          </>
        )}
      </div>
    </main>
  );
}
