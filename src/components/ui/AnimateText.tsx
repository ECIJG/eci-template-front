import { cn } from "@/src/libs/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
	text: string;
	className?: string;
	description?: {
		text: string;
		className?: string;
		delay?: number;
	};
	animate?: {
		mode: "letter" | "word";
		type?: "fade" | "slide";
		velocity?: number;
	};
}

const AnimateText = ({
	text,
	className,
	description,
	animate = { mode: "word", velocity: 0.5 },
}: Props) => {
	const delay = animate.velocity ?? 0.5;

	const initialConfig =
		animate.type === "fade"
			? { opacity: 0, filter: "blur(10px)" }
			: { opacity: 0, y: 30, filter: "blur(10px)" };

	const animateConfig =
		animate.type === "fade"
			? { opacity: 1, filter: "blur(0px)" }
			: { opacity: 1, y: 0, filter: "blur(0px)" };

	const items = text.split(animate.mode === "letter" ? "" : " ");

	return (
		<div>
			{text && (
				<motion.p
					className={cn(className)}
					initial="hidden"
					animate="visible"
					variants={{
						hidden: {},
						visible: {
							transition: {
								staggerChildren: delay,
							},
						},
					}}
				>
					{items.map((item, i) => (
						<motion.span
							key={`${item}-${i}`}
							style={{
								display: "inline-block",
								whiteSpace: "pre",
							}}
							variants={{
								hidden: initialConfig,
								visible: animateConfig,
							}}
							transition={{
								delay: i / delay,
							}}
						>
							{animate.mode === "letter"
								? item
								: item + (i < items.length - 1 ? " " : "")}
						</motion.span>
					))}
				</motion.p>
			)}

			{description && (
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ delay: description.delay ?? 0.5 }}
					className={cn("text-sm text-gray", description.className)}
				>
					{description.text}
				</motion.p>
			)}
		</div>
	);
};

export default AnimateText;
