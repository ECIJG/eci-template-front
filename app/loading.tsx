"use client";

import ImageLogo from "@/src/components/ui/ImageLogo";
import { Spinner } from "@heroui/react";

const loading = () => {
  return (
    <main className="py-14 text-center select-none mb-9">
      <ImageLogo className="flex justify-center" />
      <section className="flex items-center justify-center flex-col mt-9">
        <Spinner size="lg" />
        <p className="my-3 font-medium text-2xl opacity-80 select-none animate-pulse">
          Cargando...
        </p>
      </section>
    </main>
  );
};

export default loading;
