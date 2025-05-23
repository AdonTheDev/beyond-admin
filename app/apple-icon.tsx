import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

// Image generation
export default function Icon() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 120,
        background: "#6B3DF4",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        borderRadius: "22%",
      }}
    >
      B
    </div>,
    // ImageResponse options
    {
      // For convenience, we can re-use the exported size config
      // with our ImageResponse
      ...size,
    },
  )
}
