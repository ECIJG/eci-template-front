"use client";

import { AnimatePresence, motion } from "framer-motion";
import AnimateText from "../components/ui/AnimateText";
import { useState } from "react";
import { Button, Spinner } from "@heroui/react";

const Playground = () => {
	const [isRecharging, setIsRecharging] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0 }}
			className="flex flex-col justify-between gap-4 p-4 fixed z-50 top-0 bottom-0 right-0 left-0 m-auto w-[95%] h-[95%] bg-red/10 backdrop-blur-xl rounded-2xl"
		>
			{/* Header */}
			<div className="border-b border-separator p-4">
				<p className="text-2xl font-bold">Playground</p>
				<p className="text-sm text-gray">Ventana de prueba</p>
			</div>

			{/* Componentes de prueba */}
			<div className="flex flex-col gap-4 items-center justify-center">
				{!isRecharging && (
					<AnimateText
						text="Prueba de animación"
						animate={{
							mode: "letter",
							type: "fade",
							velocity: 20,
						}}
						description={{ text: "Esto es una prueba de animación" }}
					/>
				)}
				{isRecharging && (
					<div className="flex gap-4 items-center justify-center">
						<Spinner className="animate-spin" />
						<p>Recargando...</p>
					</div>
				)}
			</div>
			<div className="flex gap-4 items-center justify-center border-t border-separator p-4">
				<Button
					onClick={() => {
						setIsRecharging(true);
						setTimeout(() => {
							setIsRecharging(false);
						}, 1000);
					}}
				>
					Recargar componentes
				</Button>
			</div>
		</motion.div>
	);
};

export default Playground;
