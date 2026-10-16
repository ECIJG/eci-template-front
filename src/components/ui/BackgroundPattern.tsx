"use client";

import { useTheme } from "next-themes";
import useMounted from "@/src/hooks/UseMounted";
import { cn } from "@/src/libs/utils";

export type PatternVariant = "grid" | "dots" | "ambient" | "none";

interface BackgroundPatternProps {
	variant?: PatternVariant;
	className?: string;
	showGlow?: boolean;
}

export default function BackgroundPattern({
	variant = "grid",
	className,
	showGlow = true,
}: BackgroundPatternProps) {
	const mounted = useMounted();
	const { theme } = useTheme();

	if (!mounted) {
		return null;
	}

	const isDark = theme === "dark";

	return (
		<div
			aria-hidden="true"
			className={cn(
				"pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none transition-opacity duration-700",
				className,
			)}
		>
			{/* Resplandor ambiental superior con identidad primaria */}
			{showGlow && (
				<>
					{/* Foco primario central superior */}
					<div
						className="absolute -top-[180px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[100px] opacity-100 transition-all duration-700"
						style={{
							background: isDark
								? "radial-gradient(ellipse at center, rgba(225, 29, 72, 0.14), rgba(225, 29, 72, 0.04) 90%, transparent 95%)"
								: "radial-gradient(ellipse at center, rgba(153, 0, 0, 0.14), rgba(153, 0, 0, 0.02) 95%, transparent 90%)",
						}}
					/>

					{/* Sutil halo secundario en esquina para equilibrio visual */}
					<div
						className="absolute top-1/4 -right-[200px] w-[500px] h-[400px] rounded-full blur-[120px] opacity-70 transition-all duration-700"
						style={{
							background: isDark
								? "radial-gradient(circle, rgba(225, 29, 72, 0.06), transparent 70%)"
								: "radial-gradient(circle, rgba(153, 0, 0, 0.025), transparent 70%)",
						}}
					/>
				</>
			)}

			{/* Patrón geométrico técnico según variante seleccionada */}
			{variant === "grid" && (
				<div
					className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_95%_75%_at_50%_0%,black_35%,transparent_95%)] transition-opacity duration-500"
					style={{
						opacity: isDark ? 0.85 : 0.75,
					}}
				/>
			)}

			{variant === "dots" && (
				<div
					className="absolute inset-0 bg-dots-pattern [mask-image:radial-gradient(ellipse_95%_75%_at_50%_0%,black_40%,transparent_90%)] transition-opacity duration-500"
					style={{
						opacity: isDark ? 0.75 : 0.7,
					}}
				/>
			)}

			{/* Sutil línea de acento luminosa ultra-fina en el borde superior de la ventana */}
			<div
				className="absolute top-0 left-0 right-0 h-[1px] opacity-60"
				style={{
					background: isDark
						? "linear-gradient(90deg, transparent 0%, rgba(225, 29, 72, 0.35) 50%, transparent 100%)"
						: "linear-gradient(90deg, transparent 0%, rgba(153, 0, 0, 0.25) 50%, transparent 100%)",
				}}
			/>
		</div>
	);
}
