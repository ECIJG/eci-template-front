"use client";

import { Button, Card, CardHeader, Chip, Disclosure } from "@heroui/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "../libs/utils";
import { containers, randomColors } from "./staticData";
import { containerType, itemType, sectionType } from "./type";
import Modal, { ModalRef } from "../components/ui/Modal";

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

const Main = () => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const modalRef = useRef<ModalRef>(null);

	return (
		<>
			<Modal ref={modalRef}>
				<p>Components</p>
			</Modal>
			<div className="min-h-screen bg-linear-to-hr from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-8">
						<h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
							ECI Template
						</h1>
						<p className="text-lg text-gray-600 dark:text-gray-300">
							Plantilla Next.js con Redux, TypeScript y Docker
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
						{containers.map((container: containerType, index: number) => (
							<motion.section
								key={index}
								onClick={() => {
									if (container.param == "components") {
										modalRef.current?.open();
									}
								}}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								className={cn(
									`border-2 h-full rounded-4xl transition-all select-none`,
									{
										"col-span-2": container.principal,
										"hover:scale-102 active:scale-98 cursor-pointer group":
											container.param,
									},
								)}
							>
								<Card
									className={cn(`border-2 h-full`, {
										[randomColors[index % randomColors.length]]: true,
									})}
								>
									<CardHeader className="flex gap-3">
										<div className="flex flex-col">
											<div className="flex justify-between">
												<h2 className="text-2xl font-bold text-gray-800 dark:text-white">
													{container.title}
												</h2>
												<p className="text-gray font-medium text-sm opacity-0 group-hover:opacity-100 select-none transition-all">
													Clic para más información
												</p>
											</div>
											<p className="text-small text-gray-500 dark:text-gray-400">
												{container.description}
											</p>
										</div>
									</CardHeader>
									<hr />
									<Card.Content>
										<div className="space-y-3">
											{container.sections.map(
												(section: sectionType, index: number) => (
													<div key={index}>
														{section.title && (
															<Chip
																color="accent"
																variant="primary"
																size="sm"
																className="mb-2"
															>
																{section.title}
															</Chip>
														)}
														<ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 ml-2">
															{section.items.map(
																(item: itemType, index: number) => (
																	<li key={index}>
																		• <strong>{item.title}</strong> -{" "}
																		{item.description}
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
						))}
					</div>

					<div className="mt-8 fixed bottom-4 left-0 right-0 mx-auto flex items-center justify-center">
						<Disclosure
							isExpanded={isExpanded}
							onExpandedChange={setIsExpanded}
						>
							<Disclosure.Heading>
								<Button slot="trigger" variant="tertiary">
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Next.js 16 | React 19 | TypeScript | Redux Toolkit | HeroUI
										| TailwindCSS
									</p>
								</Button>
							</Disclosure.Heading>
							<Disclosure.Content>
								<Disclosure.Body className="shadow-panel flex flex-col items-center rounded-3xl bg-default p-4 text-center">
									<pre className="p-4 text-left text-sm">
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
