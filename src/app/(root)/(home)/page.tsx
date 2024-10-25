import React from "react";
import { FilesUploader } from "./_components/FilesUploader";

export default function Home() {
  return (
    <main className="flex flex-col max-w-4xl mx-auto p-4">
      <h1 className="mt-14 text-3xl font-medium">Gen Roll Create</h1>
      <p className="mt-5 text-neutral-500 font-medium">
        Simply upload the pictures of the Guests of Honor and let Gen AI create
        a reel for you to play at the party. For example, you can let this roll
        play when kids are saying Are you one, Are you two synchronized -
      </p>
      <FilesUploader />
    </main>
  );
}
