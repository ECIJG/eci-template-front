"use client";

import { Button, Card, CardHeader, Chip, Disclosure } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "../libs/utils";
import { containers } from "./staticData";
import { CategoryParam, containerType, itemType, sectionType } from "./type";
import ComponentsModal from "./ComponentsModal";
import type { ModalRef } from "../components/ui/Modal";
import Icon from "../components/ui/Icon";
import Playground from "./Playground";

const packageJson = {
	dependencies: {
		"@heroui/react": "^3.0.4",
		"@heroui/styles": "^3.0.5",
		"@reduxjs/toolkit": "^2.11.2",
		motion: "^12.42.0",
		next: "16.2.6",
		"next-auth": "^4.24.14",
		"next-themes": "^0.4.6",
		react: "19.2.4",
		"react-dom": "19.2.4",
		"react-redux": "^9.2.0",
	},
	devDependencies: {
		"@tailwindcss/postcss": "^4",
		"@types/node": "^20",
		"@types/react": "^19",
		"@types/react-dom": "^19",
		eslint: "^9",
		"eslint-config-next": "16.2.6",
		tailwindcss: "^4",
		typescript: "^5",
	},
};

const COLOR_THEMES: Record<
	string,
	{
		iconBox: string;
		borderHover: string;
		badgeColor: "accent" | "success" | "warning" | "danger" | "default";
	}
> = {
	primary: {
		iconBox: "text-primary bg-primary-soft border border-primary-border",
		borderHover: "hover:border-primary/50 hover:shadow-primary/5",
		badgeColor: "accent",
	},
	purple: {
		iconBox:
			"text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20",
		borderHover: "hover:border-purple-500/40 hover:shadow-purple-500/5",
		badgeColor: "default",
	},
	emerald: {
		iconBox:
			"text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20",
		borderHover: "hover:border-green-500/40 hover:shadow-green-500/5",
		badgeColor: "success",
	},
	amber: {
		iconBox:
			"text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20",
		borderHover: "hover:border-amber-500/40 hover:shadow-amber-500/5",
		badgeColor: "warning",
	},
	rose: {
		iconBox:
			"text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20",
		borderHover: "hover:border-rose-500/40 hover:shadow-rose-500/5",
		badgeColor: "accent",
	},
	orange: {
		iconBox:
			"text-orange-600 dark:text-orange-400 bg-orange-500/10 border border-orange-500/20",
		borderHover: "hover:border-orange-500/40 hover:shadow-orange-500/5",
		badgeColor: "warning",
	},
};

const Main = () => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const [showPlayground, setShowPlayground] = useState<boolean>(false);

	const [selectedCategory, setSelectedCategory] =
		useState<CategoryParam>("components");
	const modalRef = useRef<ModalRef>(null);

	const handleOpenCategory = (param?: CategoryParam) => {
		if (param) {
			setSelectedCategory(param);
			modalRef.current?.open();
		}
	};

	useEffect(() => {
		if (showPlayground) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [showPlayground]);

	// Mostrar Playground con F2
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "F2") {
				setShowPlayground((prev) => !prev);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<>
			{/* PlayGround */}
			<AnimatePresence mode="wait">
				{showPlayground && <Playground />}
			</AnimatePresence>
			<ComponentsModal
				modalRef={modalRef}
				category={selectedCategory}
				onCategoryChange={setSelectedCategory}
			/>

			<div className="min-h-screen bg-background bg-grid-pattern text-foreground p-4 md:p-8 relative">
				<div className="max-w-6xl mx-auto">
					{/* Encabezado Principal Moderno con Estilo ECI */}
					<div className="text-center mb-10 pt-4">
						<div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-soft border border-primary-border text-primary text-xs font-semibold mb-3 tracking-wide">
							<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
							Escuela Colombiana de Ingeniería Julio Garavito
						</div>
						<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3">
							ECI Template
						</h1>
						<p className="text-sm md:text-base text-foreground-muted max-w-xl mx-auto leading-relaxed">
							Plantilla moderna de frontend con Next.js 16, React 19, Redux
							Toolkit, TypeScript, HeroUI y Docker
						</p>
					</div>

					{/* Grid de Secciones con Colores Coherentes y Modernos */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
						{containers.map((container: containerType, index: number) => {
							const themeCfg =
								COLOR_THEMES[container.color ?? "primary"] ??
								COLOR_THEMES.primary;

							return (
								<motion.section
									key={container.title}
									onClick={() => handleOpenCategory(container.param)}
									initial={{ opacity: 0, y: 16 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: index * 0.07 }}
									className={cn(
										"h-full rounded-3xl transition-all duration-300 select-none",
										{
											"col-span-1 md:col-span-2": container.principal,
											"hover:scale-[1.012] active:scale-[0.99] cursor-pointer group":
												container.param,
										},
									)}
								>
									<Card
										className={cn(
											"h-full rounded-3xl glass-card transition-all duration-300 border border-border shadow-xs hover:shadow-lg p-6",
											themeCfg.borderHover,
										)}
									>
										<CardHeader className="flex gap-3 pb-2">
											<div className="flex flex-col w-full">
												<div className="flex items-start justify-between gap-2 mb-1.5">
													<div className="flex items-center gap-3">
														{container.icon && (
															<span
																className={cn(
																	"p-2.5 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105",
																	themeCfg.iconBox,
																)}
															>
																<Icon
																	icon={container.icon}
																	className="text-xl"
																/>
															</span>
														)}
														<div>
															<h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
																{container.title}
															</h2>
															<p className="text-xs text-foreground-muted mt-0.5">
																{container.description}
															</p>
														</div>
													</div>

													<div className="flex items-end flex-col justify-center gap-1.5 shrink-0">
														{container.badge && (
															<Chip
																size="sm"
																color={themeCfg.badgeColor}
																variant="secondary"
																className="font-semibold text-[11px]"
															>
																{container.badge}
															</Chip>
														)}
														<span className="text-[11px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:inline">
															Ver detalles →
														</span>
													</div>
												</div>
											</div>
										</CardHeader>
										<hr className="border-border my-2" />
										<Card.Content>
											<div
												className={cn("space-y-4", {
													"md:flex": container.principal,
												})}
											>
												{container.sections.map(
													(section: sectionType, sIndex: number) => (
														<div key={sIndex}>
															{section.title && (
																<div className="inline-block px-2 py-0.5 rounded-md bg-default text-foreground text-[11px] font-semibold mb-2 border border-border">
																	{section.title}
																</div>
															)}
															<ul className="text-sm text-foreground space-y-1.5 ml-1">
																{section.items.map(
																	(item: itemType, iIndex: number) => (
																		<li
																			key={iIndex}
																			className="flex items-start gap-2"
																		>
																			<span className="text-primary font-bold mt-0.5">
																				•
																			</span>
																			<span className="text-xs leading-relaxed">
																				<strong className="text-foreground font-semibold">
																					{item.title}
																				</strong>{" "}
																				<span className="text-foreground-muted">
																					— {item.description}
																				</span>
																			</span>
																		</li>
																	),
																)}
															</ul>
														</div>
													),
												)}
											</div>
										</Card.Content>
									</Card>
								</motion.section>
							);
						})}
					</div>

					{/* Barra inferior flotante */}
					<div className="mt-8 fixed bottom-4 left-0 right-0 mx-auto flex items-center justify-center z-10 px-4">
						<Disclosure
							isExpanded={isExpanded}
							onExpandedChange={setIsExpanded}
						>
							<Disclosure.Heading>
								<Button
									slot="trigger"
									variant="tertiary"
									className="glass-panel rounded-full px-5 py-2 shadow-lg border border-border text-foreground hover:bg-surface-hover"
								>
									<p className="text-xs text-foreground-muted font-medium">
										Next.js 16 | React 19 | TypeScript | Redux Toolkit | HeroUI
										| TailwindCSS
									</p>
								</Button>
							</Disclosure.Heading>
							<Disclosure.Content>
								<Disclosure.Body className="glass-panel flex flex-col items-center rounded-3xl p-4 text-center border border-border mt-2 shadow-xl">
									<pre className="p-4 text-left text-xs max-h-60 overflow-auto font-mono text-foreground-muted">
										<code>{JSON.stringify(packageJson, null, 2)}</code>
									</pre>
								</Disclosure.Body>
							</Disclosure.Content>
						</Disclosure>
					</div>
				</div>
			</div>
		</>
	);
};

export default Main;
