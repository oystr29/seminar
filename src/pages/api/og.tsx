import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=<title>
    const hasTitle = searchParams.has("title");
    const title = hasTitle ? searchParams.get("title") : "Seminar IF";

    const name = searchParams.get("name") ?? "";
    const nim = searchParams.get("nim") ?? "";

    const date = searchParams.get("date") ?? "";
    const time = searchParams.get("time") ?? "";
    const place = searchParams.get("place") ?? "";

    const type = searchParams.get("type") ?? "";

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "#111827",
            backgroundSize: "150px 150px",
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              justifyItems: "center",
            }}
          >
            <svg
              width="70"
              height="70"
              fill="white"
              version="1.1"
              viewBox="0 0 1e3 1e3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g strokeWidth=".88961">
                <path d="m232.72 563.74v191.06l10.408 6.6721c2.5799 1.6903 65.298 41.189 159.95 61.295 35.407 7.4727 70.634 11.297 105.33 11.297 19.749 0 39.321-1.2451 58.626-3.647 66.721-8.4513 130.51-31.58 189.67-68.766l10.585-6.6721v-191.24h-24.998l0.089 168.64c-52.398 31.047-119.03 61.116-177.65 68.589-50.263 6.4052-102.48 4.0915-155.24-6.9397-62.451-13.077-125.26-47.149-151.77-61.917v-168.37z"></path>
                <path d="m440.91 190.04-435.91 206.91 435.91 207v-32.278l-376.22-174.72 376.22-174.72z"></path>
                <path d="m559.09 190.04 435.91 206.91-435.91 207v-32.278l376.22-174.72-376.22-174.72z"></path>
              </g>
              <g fillRule="evenodd" strokeWidth="0">
                <rect
                  transform="matrix(.95195 .30626 -.21781 .97599 0 0)"
                  x="565.06"
                  y="-7.2924"
                  width="23.562"
                  height="473.85"
                ></rect>
                <rect
                  x="547.64"
                  y="190.04"
                  width="11.452"
                  height="18.87"
                ></rect>
                <rect
                  transform="rotate(24.598)"
                  x="587.55"
                  y="-43.508"
                  width="26.986"
                  height="12.894"
                ></rect>
                <rect
                  transform="matrix(.93166 .36332 -.40599 .91388 0 0)"
                  x="580.77"
                  y="372.8"
                  width="84.103"
                  height="24.726"
                ></rect>
                <rect
                  x="440.91"
                  y="591.09"
                  width="6.8776"
                  height="12.868"
                ></rect>
                <rect
                  x="930.31"
                  y="411.56"
                  width="23.193"
                  height="280.28"
                ></rect>
              </g>
            </svg>
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "white",
              padding: "0 120px",
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              color: "white",
              fontSize: 20,
              marginTop: 8,
              fontWeight: "bold",
            }}
          >
            {name}
            {nim && (
              <>
                {" - "}
                {nim}
              </>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: 8,
              color: "white",
            }}
          >
            {date && (
              <div
                style={{
                  paddingRight: time ? "8px" : 0,
                  borderRightWidth: time ? 2 : 0,
                  borderRightColor: "white",
                }}
              >
                {date}
              </div>
            )}{" "}
            {time && (
              <div
                style={{
                  paddingRight: place ? "8px" : 0,
                  borderRightWidth: place ? 2 : 0,
                  borderRightColor: "white",
                }}
              >
                {time}
              </div>
            )}
            {place && (
              <div
                style={{
                  paddingRight: "8px",
                }}
              >
                {place}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              color: "white",
              fontSize: 20,
              marginTop: 8,
              fontWeight: "bold",
            }}
          >
            {type}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
