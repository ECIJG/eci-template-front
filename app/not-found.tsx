"use client";

import type { NextPage } from "next";
import { Link } from "@heroui/react";
import ImageLogo from "@/src/components/ui/ImageLogo";

const NotFound: NextPage = () => {
  return (
    <main className="py-14 text-center select-none">
      <Link href="/" className="flex-center">
        <ImageLogo height={126} className="select-none" />
      </Link>

      <h1 className="my-8 font-bold text-9xl">404</h1>

      <p className="my-3 font-medium text-3xl">Página no encontrada</p>
    </main>
  );
};

export default NotFound;
