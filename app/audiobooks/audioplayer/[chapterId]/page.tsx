// "use client";

// import AudioPlayer from "@/components/AudioPlayer";
// import axiosInstance from "@/lib/axiosInstance";
// import { Chapter } from "@/types/types";
// import { useSearchParams } from "next/navigation";
// import React from "react";

// const Page = ({ params }: { params: { chapterId: string } }) => {
//   const { chapterId } = params;
//   const searchParams = useSearchParams();
//   const audiobook = searchParams.get("audiobook");
//   const [chapters, setChapters] = React.useState<Chapter[]>([]);
//   const [currentChapter, setCurrentChapter] = React.useState<Chapter | null>(
//     null
//   );
//   const [currentIndex, setCurrentIndex] = React.useState<number>(0);

//   const parsedAudiobook = audiobook
//     ? JSON.parse(decodeURIComponent(audiobook)) || null
//     : null;

//   console.log("parsedAudiobook", parsedAudiobook);
//   console.log("id", chapterId);

//   // Fetch chapters using the chapterId
//   const fetchChapters = async () => {
//     try {
//       const response = await axiosInstance.get(
//         `/api/audiobooks/${parsedAudiobook.slug}/chapters`
//       );

//       if (response.status !== 200) {
//         throw new Error("Failed to fetch Audiobook details");
//       }

//       const data = await response.data;
//       console.log("data", data);

//       setChapters(data.chapters);
//       setCurrentChapter(data.chapters.find((ch: Chapter) => ch.order === 1));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   console.log("chapters", chapters);
//   console.log("currentChapter", currentChapter);

//   React.useEffect(() => {
//     fetchChapters();
//   }, [chapterId]);

//   const chapter = chapters.find((ch: Chapter) => ch.id === +chapterId);

//   return (
//     <div className="w-full h-screen flex justify-center items-center">
//       <AudioPlayer
//         currentChapter={currentChapter}
//         currentIndex={currentIndex}
//         setCurrentIndex={setCurrentIndex}
//         audiobook={parsedAudiobook}
//         chapters={chapters}
//       />
//     </div>
//   );
// };

// export default Page;
