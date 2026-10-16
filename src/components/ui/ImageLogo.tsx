"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

const ImageLogo = ({
    height = 126,
    target,
    reload = false,
    title,
    className,
}: {
    height?: 66 | 81 | 126 | 250;
    target?: string;
    reload?: boolean;
    title?: string;
    className?: string;
}) => {
    const [mounted, setMounted] = useState<boolean>(false);
    const { theme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        setMounted(true)
    }, []);

    if (!mounted) return null;

    // Construct image path
    const imagePath = `/images/ecijg${height}${theme === "dark" ? "-light" : ""}.png`;

    return (
        <section className={className}>
            <img
                src={imagePath}
                alt="Logo ECIJG"
                className={`block select-none ${(target || reload) && "cursor-pointer"}`}
                style={{ height, width: 'auto' }}
                onError={(e) => {
                    // Si la versión -light no existe, cae a la versión estándar del mismo tamaño
                    const imgEl = e.target as HTMLImageElement;
                    imgEl.onerror = null; // evita loop infinito
                    imgEl.src = `/images/ecijg${height}.png`;
                }}
                onClick={() => {
                    if (reload) window.location.reload();
                    if (target) router.push("/");
                }}
                title={title}
                loading="lazy"
            />
        </section>
    );
};

export default ImageLogo;
