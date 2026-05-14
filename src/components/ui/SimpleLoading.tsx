"use client"

import { Spinner } from "@heroui/react";

export const SimpleLoading = () => {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 select-none my-8 min-h-[200px]">
            <div className="relative">
                <Spinner
                    size="xl"
                    color="current"
                    className="animate-pulse"
                />
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-transparent via-white/20 to-transparent animate-spin" />
            </div>
            <div className="space-y-2 text-center">
                <p className="font-medium text-foreground/80 animate-pulse text-2xl">
                    Cargando...
                </p>
                <div className="flex justify-center items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </section>
    );
};
