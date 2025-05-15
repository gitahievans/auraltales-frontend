// app/[bookSlug]/page.jsx
import { Suspense } from "react";
import AudioPlayerClient from "@/components/AudioPlayer/AudioPlayerClient";

export const runtime = "edge";

export default function Page({ params }: { params: { bookSlug: string } }) {
  const { bookSlug } = params;

  return (
    <Suspense fallback={<div>Loading audiobook...</div>}>
      <AudioPlayerClient bookSlug={bookSlug} />
    </Suspense>
  );
}
