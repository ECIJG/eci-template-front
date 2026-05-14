"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

const ImageLogoCut = ({
  target,
  reload = false,
  title,
  className,
}: {
  target?: string;
  reload?: boolean;
  title?: string;
  className?: string;
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className={className}>
      <Image
        src={`/images/ecijg-og-cut${theme === "dark" ? "-light" : ""}.png`}
        alt="Logo ECIJG"
        width={18}
        height={30}
        className={`select-none ${(target || reload) && "cursor-pointer"}`}
        onClick={() => {
          if (reload) window.location.reload();
          if (target) router.push("/");
        }}
        title={title}
      />
    </section>
  );
};

export default ImageLogoCut;
