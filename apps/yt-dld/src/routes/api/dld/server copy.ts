import { createReadStream, statSync } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

export const GET = async ({request}) => {
    const url = "https://www.youtube.com/watch?v=MlzEB5AYSjA";
    // const stream = yt(url)
    const filePath = "/media/tonni/win/src/USB/New folder/Knights_of_the_Zodiac_(2023)__.mp4"//path.join(import.meta.dirname, "file.json");
    try {

        console.log("Downloading", filePath);
    const fileStats = statSync(filePath)
    const fileName = filePath.split("/").pop()
    const fileSz = fileStats.size
    console.log("Size:", (fileSz / 1024).toFixed(2));
    // Extract the Range header from the request
    const range = request.headers.get('range');

    if (range) {
      // Parse the range header (e.g., "bytes=100-")
      console.log({range});
      const match = range.match(/bytes=(\d+)-(\d*)/);
      if (!match) {
        return new Response('Invalid range header', { status: 400 });
      }

      const start = parseInt(match[1], 10);
      const end = match[2] ? parseInt(match[2], 10) : fileSz - 1;

      // Ensure the range is valid
      if (start >= fileSz || end >= fileSz || start > end) {
        return new Response('Range not satisfiable', { status: 416, headers: { 'Content-Range': `bytes */${fileSz}` } });
      }

      const chunkSize = end - start + 1;

      // Create a readable stream for the requested range
      const fileStream = createReadStream(filePath, { start, end });

      return new Response(Readable.toWeb(fileStream) as BodyInit, {
        status: 206, // Partial content
        headers: {
          'Content-Type': 'text/plain', // Adjust MIME type as needed
          'Content-Length': chunkSize.toString(),
          'Content-Range': `bytes ${start}-${end}/${fileSz}`,
          'Accept-Ranges': 'bytes',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    } else {
      // If no Range header, send the entire file
      const fileStream = createReadStream(filePath);
      return new Response(Readable.toWeb(fileStream) as BodyInit, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': fileSz.toString(),
          'Accept-Ranges': 'bytes',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    }
    } catch (err) {
        console.log('Failed to stream file');
        console.log(err);
    }
    
};
