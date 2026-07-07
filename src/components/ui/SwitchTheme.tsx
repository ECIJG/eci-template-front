"use client";

import useMounted from "@/src/hooks/UseMounted";
import { cn } from "@/src/libs/utils";
import { Button, Tooltip } from "@heroui/react";
import { useTheme } from "next-themes";
import Icon from "./Icon";

const SwitchTheme = () => {
	const mounted = useMounted();
	const { theme, setTheme } = useTheme();

	if (!mounted) return null;

	return (
		<Tooltip>
			<Button
				isIconOnly
				className={cn("absolute bottom-3 right-3")}
				variant={theme === "light" ? "primary" : "secondary"}
				onPress={() => setTheme(theme === "light" ? "dark" : "light")}
			>
				<span
					key={theme}
					className="animate-[iconFlip_200ms_ease-out_1] mb-[-2px]"
				>
					<Icon
						className="text-lg"
						icon={theme === "light" ? "sun-fill" : "moon-fill"}
					/>
				</span>
			</Button>
			<Tooltip.Content>
				<Tooltip.Arrow />
				<p>Cambiar a modo {theme === "light" ? "oscuro" : "claro"}</p>
			</Tooltip.Content>
		</Tooltip>
	);
};

export default SwitchTheme;
