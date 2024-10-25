import React from "react";
import { MovieForm } from "./_components/MovieForm";

export default async function Movie() {
  return (
    <main className="flex flex-col max-w-4xl mx-auto p-4">
      <h1 className="mt-14 text-3xl font-medium">Gen Charades</h1>
      <MovieForm />
    </main>
  );
}
