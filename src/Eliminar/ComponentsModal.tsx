"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Tabs, Chip } from "@heroui/react";
import { useTheme } from "next-themes";
import Modal, { ModalRef } from "@/src/components/ui/Modal";
import Icon from "@/src/components/ui/Icon";
import AnimateText from "@/src/components/ui/AnimateText";
import { SimpleLoading } from "@/src/components/ui/SimpleLoading";
import ImageLogo from "@/src/components/ui/ImageLogo";
import ImageLogoCut from "@/src/components/ui/ImageCutLogo";
import SwitchTheme from "@/src/components/ui/SwitchTheme";
import useForm from "@/src/hooks/useForm";
import InputForm from "@/src/components/form/InputForm";
import SelectForm from "@/src/components/form/SelectForm";
import ComboBoxForm from "@/src/components/form/ComboBoxForm";
import TextAreaForm from "@/src/components/form/TextareaForm";
import {
	cn,
	validateString,
	emptyValue,
	validateEmail,
	verifyNumbers,
} from "@/src/libs/utils";
import {
	formatDate,
	formatTime,
	convertToCurrency,
	passwordSecurity,
	encriptarCorreo,
	deleteAccents,
	stringToUpperCase,
} from "@/src/libs/functionsStrings";
import { optionsCards } from "@/src/libs/staticData";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setCycles } from "@/src/redux/slices/generalSlice";
import { CategoryParam } from "./type";

// ═══════════════════════════════════════════════════════════════════════════════
// UI HELPERS & COMPONENT BLOCK
// ═══════════════════════════════════════════════════════════════════════════════

const Code = ({ children }: { children: string }) => (
	<code className="bg-default-200 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-[11px] font-mono">
		{children}
	</code>
);

const CodeBlock = ({ code }: { code: string }) => (
	<pre className="overflow-x-auto rounded-xl bg-gray-950 p-3.5 text-[11px] text-green-300 leading-relaxed whitespace-pre-wrap font-mono border border-gray-800">
		<code>{code.trim()}</code>
	</pre>
);

export type PropRow = {
	name: string;
	type: string;
	default?: string;
	required?: boolean;
	description: string;
};

const PropsTable = ({ props }: { props: PropRow[] }) => (
	<div className="overflow-x-auto rounded-xl border border-default-200 text-xs">
		<table className="w-full">
			<thead className="bg-default-100 text-foreground/70">
				<tr>
					{["Propiedad", "Tipo", "Default", "Estado", "Descripción"].map(
						(h, i) => (
							<th
								key={i}
								className="px-3 py-2 text-left font-semibold whitespace-nowrap"
							>
								{h}
							</th>
						),
					)}
				</tr>
			</thead>
			<tbody className="divide-y divide-default-100">
				{props.map((p, i) => (
					<tr
						key={p.name}
						className={i % 2 === 0 ? "bg-default-50/50" : "bg-default"}
					>
						<td className="px-3 py-2 font-mono font-bold text-primary whitespace-nowrap">
							{p.name}
						</td>
						<td className="px-3 py-2 font-mono text-foreground/60 whitespace-nowrap">
							{p.type}
						</td>
						<td className="px-3 py-2 font-mono text-foreground/40 whitespace-nowrap">
							{p.default ?? "—"}
						</td>
						<td className="px-3 py-2 whitespace-nowrap">
							{p.required ? (
								<span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/40 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-900/40">
									Requerido
								</span>
							) : (
								<span className="text-[10px] text-foreground/50 bg-default-200 px-1.5 py-0.5 rounded">
									Opcional
								</span>
							)}
						</td>
						<td className="px-3 py-2 text-foreground/80 leading-normal">
							{p.description}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

const FnTable = ({
	fns,
}: {
	fns: { name: string; signature: string; description: string }[];
}) => (
	<div className="overflow-x-auto rounded-xl border border-default-200 text-xs">
		<table className="w-full">
			<thead className="bg-default-100 text-foreground/70">
				<tr>
					{["Elemento / Método", "Firma", "Descripción"].map((h, i) => (
						<th key={i} className="px-3 py-2 text-left font-semibold">
							{h}
						</th>
					))}
				</tr>
			</thead>
			<tbody className="divide-y divide-default-100">
				{fns.map((f, i) => (
					<tr
						key={f.name}
						className={i % 2 === 0 ? "bg-default-50/50" : "bg-default"}
					>
						<td className="px-3 py-2 font-mono font-bold text-primary whitespace-nowrap">
							{f.name}
						</td>
						<td className="px-3 py-2 font-mono text-foreground/60 whitespace-nowrap text-[11px]">
							{f.signature}
						</td>
						<td className="px-3 py-2 text-foreground/80 leading-normal">
							{f.description}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

/**
 * Bloque individual totalmente separado para cada componente / archivo / función.
 */
function ComponentItemCard({
	id,
	title,
	file,
	badge,
	badgeColor = "accent",
	description,
	propsTable,
	fnTable,
	playground,
	usage,
}: {
	id?: string;
	title: string;
	file: string;
	badge: string;
	badgeColor?: "accent" | "success" | "warning" | "danger" | "default";
	description: string;
	propsTable?: PropRow[];
	fnTable?: { name: string; signature: string; description: string }[];
	playground?: React.ReactNode;
	usage: string;
}) {
	return (
		<section
			id={id}
			className="flex flex-col gap-3.5 p-4 md:p-5 rounded-3xl bg-card border border-border shadow-xs hover:border-border/90 transition-all"
		>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2.5 border-b border-border">
				<div className="flex items-center gap-2.5 flex-wrap">
					<h3 className="font-bold text-base text-foreground tracking-tight">
						{title}
					</h3>
					<Chip
						size="sm"
						variant="secondary"
						color={badgeColor}
						className="font-semibold text-[10px]"
					>
						{badge}
					</Chip>
				</div>
				<span className="text-[11px] text-foreground-muted font-mono bg-default px-2.5 py-1 rounded-lg border border-border w-fit">
					📁 {file}
				</span>
			</div>

			<p className="text-xs text-foreground-muted leading-relaxed">
				{description}
			</p>

			<div className="w-full">
				<Tabs>
					<Tabs.List className="bg-default p-1 rounded-xl border border-border w-fit">
						{(propsTable || fnTable) && (
							<Tabs.Tab id="api">📋 Props / API</Tabs.Tab>
						)}
						{playground && <Tabs.Tab id="play">🎮 Prueba en vivo</Tabs.Tab>}
						<Tabs.Tab id="uso">💻 Código</Tabs.Tab>
					</Tabs.List>

					{(propsTable || fnTable) && (
						<Tabs.Panel id="api" className="pt-3 flex flex-col gap-3">
							{propsTable && propsTable.length > 0 && (
								<PropsTable props={propsTable} />
							)}
							{fnTable && fnTable.length > 0 && <FnTable fns={fnTable} />}
						</Tabs.Panel>
					)}

					{playground && (
						<Tabs.Panel id="play" className="pt-3">
							<div className="p-4 bg-default/50 rounded-2xl border border-border">
								{playground}
							</div>
						</Tabs.Panel>
					)}

					<Tabs.Panel id="uso" className="pt-3">
						<CodeBlock code={usage} />
					</Tabs.Panel>
				</Tabs>
			</div>
		</section>
	);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 1: COMPONENTES (UI & FORMS - TOTALMENTE SEPARADOS)
// ═══════════════════════════════════════════════════════════════════════════════

function ModalPlayground() {
	const ref = useRef<ModalRef>(null);
	const [cfg, setCfg] = useState({
		title: "Confirmar acción",
		size: "md" as "xs" | "sm" | "md" | "lg" | "full",
		placement: "center" as "center" | "top" | "bottom" | "auto",
		animate: "Fluid Slide" as "Fluid Slide" | "Kinematic Scale",
		backdropVariant: "opaque" as "opaque" | "blur" | "transparent",
		closeDisabled: false,
		variant: "danger" as "none" | "danger" | "warning" | "success" | "info",
		showFooter: true,
		primaryText: "Aceptar",
		secondaryText: "Cancelar",
	});

	return (
		<div className="flex flex-col gap-3">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
				<div className="flex flex-col gap-1">
					<span className="text-[11px] font-semibold text-foreground/60">
						size:
					</span>
					<select
						value={cfg.size}
						onChange={(e) => setCfg({ ...cfg, size: e.target.value as any })}
						className="text-xs p-1.5 rounded-lg border border-default-300 bg-default text-foreground"
					>
						{["xs", "sm", "md", "lg", "full"].map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col gap-1">
					<span className="text-[11px] font-semibold text-foreground/60">
						animate:
					</span>
					<select
						value={cfg.animate}
						onChange={(e) => setCfg({ ...cfg, animate: e.target.value as any })}
						className="text-xs p-1.5 rounded-lg border border-default-300 bg-default text-foreground"
					>
						{["Fluid Slide", "Kinematic Scale"].map((a) => (
							<option key={a} value={a}>
								{a}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col gap-1">
					<span className="text-[11px] font-semibold text-foreground/60">
						template.variant:
					</span>
					<select
						value={cfg.variant}
						onChange={(e) => setCfg({ ...cfg, variant: e.target.value as any })}
						className="text-xs p-1.5 rounded-lg border border-default-300 bg-default text-foreground"
					>
						{["none", "danger", "warning", "success", "info"].map((v) => (
							<option key={v} value={v}>
								{v}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col justify-end">
					<Button
						size="sm"
						variant="primary"
						onPress={() => ref.current?.open()}
						className="w-full"
					>
						🚀 Probar Modal ({cfg.size})
					</Button>
				</div>
			</div>

			<div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
				<label className="flex items-center gap-1.5 cursor-pointer">
					<input
						type="checkbox"
						checked={cfg.showFooter}
						onChange={(e) => setCfg({ ...cfg, showFooter: e.target.checked })}
					/>
					<span>showFooter ({String(cfg.showFooter)})</span>
				</label>
				<label className="flex items-center gap-1.5 cursor-pointer">
					<input
						type="checkbox"
						checked={cfg.closeDisabled}
						onChange={(e) =>
							setCfg({ ...cfg, closeDisabled: e.target.checked })
						}
					/>
					<span>closeDisabled ({String(cfg.closeDisabled)})</span>
				</label>
			</div>

			<Modal
				ref={ref}
				title={cfg.title}
				size={cfg.size}
				placement={cfg.placement}
				animate={cfg.animate}
				backdropVariant={cfg.backdropVariant}
				closeDisabled={cfg.closeDisabled}
				template={
					cfg.variant !== "none"
						? {
								variant: cfg.variant as any,
								showFooter: cfg.showFooter,
								primaryText: cfg.primaryText,
								secondaryText: cfg.secondaryText,
								onClick: () => ref.current?.close(),
							}
						: undefined
				}
			>
				<p className="text-sm">
					Contenido de prueba inyectado en el cuerpo del Modal.
				</p>
			</Modal>
		</div>
	);
}

function IconPlayground() {
	const [selectedIcon, setSelectedIcon] = useState("bell-fill");
	const [sizeClass, setSizeClass] = useState("text-2xl");
	const [colorClass, setColorClass] = useState("text-primary");

	const icons = [
		"house-fill",
		"bell-fill",
		"gear-fill",
		"check-circle-fill",
		"exclamation-triangle-fill",
		"shield-check",
		"person-fill",
		"search",
		"trash",
		"star-fill",
	];

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-2 flex-wrap">
				<span className="text-xs text-foreground/60">Selecciona icono:</span>
				{icons.map((ic) => (
					<button
						key={ic}
						onClick={() => setSelectedIcon(ic)}
						className={`px-2 py-1 rounded text-xs border ${
							selectedIcon === ic
								? "bg-primary text-white border-primary"
								: "bg-default border-default-300"
						}`}
					>
						{ic}
					</button>
				))}
			</div>

			<div className="flex items-center gap-4 pt-2">
				<div className="flex items-center gap-2">
					<span className="text-xs text-foreground/60">Tamaño:</span>
					<select
						value={sizeClass}
						onChange={(e) => setSizeClass(e.target.value)}
						className="text-xs p-1 rounded border border-default-300 bg-default"
					>
						{[
							"text-sm",
							"text-base",
							"text-xl",
							"text-2xl",
							"text-4xl",
							"text-5xl",
						].map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-xs text-foreground/60">Color:</span>
					<select
						value={colorClass}
						onChange={(e) => setColorClass(e.target.value)}
						className="text-xs p-1 rounded border border-default-300 bg-default"
					>
						{[
							"text-primary",
							"text-green-500",
							"text-red-500",
							"text-amber-500",
							"text-purple-500",
						].map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="p-4 bg-default-50 rounded-xl border border-dashed border-default-300 flex items-center justify-center gap-3">
				<Icon
					icon={selectedIcon}
					className={`${sizeClass} ${colorClass}`}
					title={selectedIcon}
				/>
				<span className="text-xs font-mono text-foreground/60">
					&lt;Icon icon="{selectedIcon}" className="{sizeClass} {colorClass}"
					/&gt;
				</span>
			</div>
		</div>
	);
}


function AnimateTextPlayground() {
	const [text, setText] = useState("Escuela Colombiana de Ingeniería");
	const [mode, setMode] = useState<"word" | "letter">("word");
	const [type, setType] = useState<"slide" | "fade">("slide");
	const [velocity, setVelocity] = useState<number>(2);
	const [hasDescription, setHasDescription] = useState(true);
	const [descText, setDescText] = useState("Julio Garavito - Innovación y Excelencia");
	const [descDelay, setDescDelay] = useState<number>(0.8);
	const [replayKey, setReplayKey] = useState(0);

	const replay = () => setReplayKey((k) => k + 1);

	return (
		<div className="flex flex-col gap-4">
			{/* Panel de Controles Interactivos */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 bg-surface-secondary/70 rounded-xl border border-border">
				{/* 1. Prop 'text' */}
				<div className="flex flex-col gap-1 md:col-span-2">
					<div className="flex items-center justify-between">
						<label className="text-[11px] font-semibold text-foreground/80">
							Prop <span className="font-mono text-primary font-bold">text</span> (requerido):
						</label>
						<span className="text-[10px] text-foreground-muted">
							Texto principal que será fragmentado y animado
						</span>
					</div>
					<div className="flex gap-2">
						<input
							type="text"
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder="Escribe el texto a animar..."
							className="w-full text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-primary transition-colors"
						/>
						<Button
							size="sm"
							variant="primary"
							onPress={replay}
							className="whitespace-nowrap px-3 text-xs shrink-0 flex items-center gap-1.5"
						>
							<Icon icon="arrow-clockwise" className="text-xs" />
							<span>Reanimar</span>
						</Button>
					</div>
				</div>

				{/* 2. Prop 'animate.mode' */}
				<div className="flex flex-col gap-1">
					<label className="text-[11px] font-semibold text-foreground/80">
						Prop <span className="font-mono text-primary font-bold">animate.mode</span> (Segmentación):
					</label>
					<div className="flex gap-1.5">
						{(["word", "letter"] as const).map((m) => (
							<button
								key={m}
								onClick={() => {
									setMode(m);
									if (m === "letter" && velocity < 10) setVelocity(20);
									if (m === "word" && velocity > 10) setVelocity(2);
									replay();
								}}
								className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
									mode === m
										? "bg-primary text-primary-foreground border-primary shadow-xs"
										: "bg-card border-border text-foreground-muted hover:bg-surface-hover hover:text-foreground"
								}`}
							>
								{m === "word" ? "Palabra ('word')" : "Letra ('letter')"}
							</button>
						))}
					</div>
					<span className="text-[10px] text-foreground-muted mt-0.5">
						{mode === "word"
							? "Divide por palabras (text.split(' ')) manteniendo espacios legibles."
							: "Divide por carácter (text.split('')) estilo mecanografía o texto fluido."}
					</span>
				</div>

				{/* 3. Prop 'animate.type' */}
				<div className="flex flex-col gap-1">
					<label className="text-[11px] font-semibold text-foreground/80">
						Prop <span className="font-mono text-primary font-bold">animate.type</span> (Efecto):
					</label>
					<div className="flex gap-1.5">
						{(["slide", "fade"] as const).map((t) => (
							<button
								key={t}
								onClick={() => {
									setType(t);
									replay();
								}}
								className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
									type === t
										? "bg-primary text-primary-foreground border-primary shadow-xs"
										: "bg-card border-border text-foreground-muted hover:bg-surface-hover hover:text-foreground"
								}`}
							>
								{t === "slide" ? "Desplazamiento ('slide')" : "Desvanecimiento ('fade')"}
							</button>
						))}
					</div>
					<span className="text-[10px] text-foreground-muted mt-0.5">
						{type === "slide"
							? "Inicia desde y: 30 con desenfoque blur(10px) hacia y: 0."
							: "Inicia en su posición con blur(10px) y opacidad progresiva pura."}
					</span>
				</div>

				{/* 4. Prop 'animate.velocity' */}
				<div className="flex flex-col gap-1">
					<div className="flex items-center justify-between">
						<label className="text-[11px] font-semibold text-foreground/80">
							Prop <span className="font-mono text-primary font-bold">animate.velocity</span>:
						</label>
						<span className="font-mono text-xs text-primary font-bold">
							{velocity}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<input
							type="range"
							min="0.2"
							max={mode === "letter" ? "40" : "10"}
							step="0.5"
							value={velocity}
							onChange={(e) => {
								setVelocity(Number(e.target.value));
								replay();
							}}
							className="w-full accent-primary cursor-pointer"
						/>
						<span className="text-[10px] text-foreground-muted whitespace-nowrap">
							{velocity >= 10 ? "Cadencia Rápida" : "Cadencia Pausada"}
						</span>
					</div>
					<span className="text-[10px] text-foreground-muted mt-0.5">
						Controla el retardo escalonado de Framer Motion (stagger y delay: i / velocity).
					</span>
				</div>

				{/* 5. Prop 'description' */}
				<div className="flex flex-col gap-1">
					<div className="flex items-center justify-between">
						<label className="text-[11px] font-semibold text-foreground/80 cursor-pointer flex items-center gap-1.5">
							<input
								type="checkbox"
								checked={hasDescription}
								onChange={(e) => {
									setHasDescription(e.target.checked);
									replay();
								}}
								className="accent-primary rounded cursor-pointer"
							/>
							<span>Prop <span className="font-mono text-primary font-bold">description</span></span>
						</label>
						{hasDescription && (
							<span className="text-[10px] text-foreground-muted font-mono">
								delay: {descDelay}s
							</span>
						)}
					</div>
					{hasDescription && (
						<div className="flex gap-2">
							<input
								type="text"
								value={descText}
								onChange={(e) => setDescText(e.target.value)}
								placeholder="Subtítulo o texto secundario..."
								className="w-full text-xs px-2.5 py-1 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-primary"
							/>
							<input
								type="number"
								min="0.1"
								max="5"
								step="0.1"
								value={descDelay}
								onChange={(e) => {
									setDescDelay(Number(e.target.value));
									replay();
								}}
								className="w-16 text-xs px-2 py-1 rounded-lg border border-border bg-card text-foreground font-mono text-center"
								title="delay en segundos"
							/>
						</div>
					)}
					<span className="text-[10px] text-foreground-muted mt-0.5">
						{hasDescription
							? "Renderiza un párrafo secundario animado con fade in tras el retardo indicado."
							: "Subtítulo secundario desactivado."}
					</span>
				</div>
			</div>

			{/* Vista Previa en Vivo */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">
						Vista previa interactiva:
					</span>
					<span className="text-[10px] text-foreground-muted font-mono">
						animate.mode="{mode}" | animate.type="{type}" | velocity={velocity}
					</span>
				</div>
				<div className="p-6 md:p-8 rounded-2xl bg-surface-secondary/70 border border-border min-h-[120px] flex flex-col justify-center items-center text-center overflow-hidden">
					<AnimateText
						key={`${replayKey}-${mode}-${type}-${velocity}-${hasDescription}-${descDelay}`}
						text={text}
						className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight"
						animate={{
							mode,
							type,
							velocity,
						}}
						description={
							hasDescription && descText
								? {
										text: descText,
										className: "text-xs md:text-sm text-foreground-muted mt-2",
										delay: descDelay,
								  }
								: undefined
						}
					/>
				</div>
			</div>
		</div>
	);
}

function SimpleLoadingPlayground() {
	const [active, setActive] = useState(true);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<span className="text-xs text-foreground/70">
					Estado del componente:
				</span>
				<Button
					size="sm"
					variant="secondary"
					onPress={() => setActive(!active)}
				>
					{active ? "Ocultar spinner" : "Mostrar spinner"}
				</Button>
			</div>
			<div className="p-4 bg-default-50 rounded-xl border border-default-200">
				{active ? (
					<SimpleLoading />
				) : (
					<p className="text-xs text-center text-foreground/40 italic">
						Spinner inactivo
					</p>
				)}
			</div>
		</div>
	);
}

function SwitchThemePlayground() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between p-3 bg-default-50 rounded-xl border border-default-200">
				<div className="flex items-center gap-2 text-xs">
					<span className="font-semibold text-foreground">Tema actual:</span>
					<Chip
						size="sm"
						color={theme === "dark" ? "warning" : "accent"}
						variant="secondary"
					>
						{theme === "dark" ? "🌙 Oscuro (dark)" : "☀️ Claro (light)"}
					</Chip>
				</div>
				<Button
					size="sm"
					variant="primary"
					onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
				>
					Alternar Tema
				</Button>
			</div>
			<p className="text-[11px] text-foreground/50">
				💡 `SwitchTheme` se encuentra fijo en la esquina inferior derecha de la
				pantalla y persiste la preferencia del usuario en el navegador.
			</p>
		</div>
	);
}

function ImageLogoPlayground() {
	const [height, setHeight] = useState<66 | 81 | 126 | 250>(81);
	const [reload, setReload] = useState(false);

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-4 flex-wrap">
				<div className="flex items-center gap-2 text-xs">
					<span>height prop:</span>
					<div className="flex gap-1">
						{([66, 81, 126, 250] as const).map((h) => (
							<button
								key={h}
								onClick={() => setHeight(h)}
								className={`px-2 py-1 rounded text-xs border ${
									height === h
										? "bg-primary text-white border-primary"
										: "bg-default border-default-300"
								}`}
							>
								{h}px
							</button>
						))}
					</div>
				</div>

				<label className="flex items-center gap-1.5 text-xs cursor-pointer">
					<input
						type="checkbox"
						checked={reload}
						onChange={(e) => setReload(e.target.checked)}
					/>
					<span>reload ({String(reload)})</span>
				</label>
			</div>

			<div className="p-4 bg-default-50 rounded-xl border border-default-200 flex items-center justify-center">
				<ImageLogo
					height={height}
					reload={reload}
					title={`Logo ECIJG altura ${height}px`}
				/>
			</div>
		</div>
	);
}

function ImageCutLogoPlayground() {
	return (
		<div className="flex flex-col gap-2">
			<div className="p-4 bg-default-50 rounded-xl border border-default-200 flex items-center justify-center gap-4">
				<ImageLogoCut title="Logo ECIJG Recortado" />
				<span className="text-xs text-foreground/60 font-mono">
					Dimensiones fijas optimizadas para barras laterales y navegación (18px
					× 30px)
				</span>
			</div>
		</div>
	);
}

function InputFormPlayground() {
	type F = { texto: string };
	const [type, setType] = useState("text");
	const [isRequired, setIsRequired] = useState(true);
	const [isDisabled, setIsDisabled] = useState(false);
	const [label, setLabel] = useState("Nombre de Usuario");
	const [description, setDescription] = useState(
		"Escribe tu identificador institucional",
	);

	const form = useForm<F>({
		initialValues: { texto: "" },
		schema: isRequired
			? {
					texto: {
						required: "El campo es requerido",
						minLength: { value: 4, message: "Mín. 4 caracteres" },
					},
				}
			: {},
	});

	return (
		<div className="flex flex-col gap-3">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
				<div className="flex flex-col gap-1">
					<span className="text-foreground/60">type:</span>
					<select
						value={type}
						onChange={(e) => setType(e.target.value)}
						className="p-1 rounded border border-default-300 bg-default text-xs"
					>
						{["text", "email", "password", "number", "date"].map((t) => (
							<option key={t} value={t}>
								{t}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col gap-1">
					<span className="text-foreground/60">label:</span>
					<input
						type="text"
						value={label}
						onChange={(e) => setLabel(e.target.value)}
						className="p-1 rounded border border-default-300 bg-default text-xs"
					/>
				</div>

				<div className="flex items-center gap-1.5 pt-4">
					<input
						type="checkbox"
						checked={isRequired}
						onChange={(e) => setIsRequired(e.target.checked)}
					/>
					<span>isRequired ({String(isRequired)})</span>
				</div>

				<div className="flex items-center gap-1.5 pt-4">
					<input
						type="checkbox"
						checked={isDisabled}
						onChange={(e) => setIsDisabled(e.target.checked)}
					/>
					<span>isDisabled ({String(isDisabled)})</span>
				</div>
			</div>

			<div className="p-3.5 bg-default-50 rounded-xl border border-default-200">
				<InputForm<F>
					form={form}
					name="texto"
					type={type}
					label={label}
					isRequired={isRequired}
					isDisabled={isDisabled}
					description={description}
				/>
			</div>

			<div className="p-2.5 bg-gray-900 rounded-lg text-xs font-mono text-green-300 flex justify-between">
				<span>form.values.texto: "{form.values.texto}"</span>
				<span
					className={
						form.errors.texto ? "text-red-400 font-bold" : "text-green-400"
					}
				>
					error: {form.errors.texto ?? "null (válido)"}
				</span>
			</div>
		</div>
	);
}

function SelectFormPlayground() {
	type F = { rol: string | null };
	const [isRequired, setIsRequired] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const [icon, setIcon] = useState("person-badge");

	const form = useForm<F>({
		initialValues: { rol: null },
	});

	const options = [
		{
			label: "Administrador de Sistema",
			value: "admin",
			description: "Acceso y control total",
		},
		{
			label: "Docente Titular",
			value: "docente",
			description: "Gestión de notas y cursos",
		},
		{
			label: "Estudiante de Pregrado",
			value: "estudiante",
			description: "Consulta de materias",
		},
	];

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-4 text-xs">
				<label className="flex items-center gap-1.5 cursor-pointer">
					<input
						type="checkbox"
						checked={isRequired}
						onChange={(e) => setIsRequired(e.target.checked)}
					/>
					<span>isRequired ({String(isRequired)})</span>
				</label>
				<label className="flex items-center gap-1.5 cursor-pointer">
					<input
						type="checkbox"
						checked={isDisabled}
						onChange={(e) => setIsDisabled(e.target.checked)}
					/>
					<span>isDisabled ({String(isDisabled)})</span>
				</label>
				<div className="flex items-center gap-1.5">
					<span className="text-foreground/60">icon:</span>
					<input
						type="text"
						value={icon}
						onChange={(e) => setIcon(e.target.value)}
						className="p-1 rounded border border-default-300 bg-default text-xs w-28"
					/>
				</div>
			</div>

			<div className="p-3.5 bg-default-50 rounded-xl border border-default-200">
				<SelectForm<F>
					form={form}
					name="rol"
					label="Seleccione un Rol Institucional"
					icon={icon}
					options={options}
					isRequired={isRequired}
					isDisabled={isDisabled}
					description="Escribe en el buscador para filtrar en tiempo real"
				/>
			</div>

			<div className="p-2.5 bg-gray-900 rounded-lg text-xs font-mono text-green-300">
				<span>
					form.values.rol seleccionado: {JSON.stringify(form.values.rol)}
				</span>
			</div>
		</div>
	);
}

function ComboBoxFormPlayground() {
	type F = { asignatura: string | null };
	const [isRequired, setIsRequired] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);

	const form = useForm<F>({
		initialValues: { asignatura: null },
	});

	const options = [
		{ label: "Cálculo Diferencial", value: "calc1", description: "Semestre 1" },
		{ label: "Estructuras de Datos", value: "edat", description: "Semestre 3" },
		{
			label: "Ingeniería de Software",
			value: "isof",
			description: "Semestre 5",
		},
	];

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-4 text-xs">
				<label className="flex items-center gap-1.5 cursor-pointer">
					<input
						type="checkbox"
						checked={isRequired}
						onChange={(e) => setIsRequired(e.target.checked)}
					/>
					<span>isRequired ({String(isRequired)})</span>
				</label>
				<label className="flex items-center gap-1.5 cursor-pointer">
					<input
						type="checkbox"
						checked={isDisabled}
						onChange={(e) => setIsDisabled(e.target.checked)}
					/>
					<span>isDisabled ({String(isDisabled)})</span>
				</label>
			</div>

			<div className="p-3.5 bg-default-50 rounded-xl border border-default-200">
				<ComboBoxForm<F>
					form={form}
					name="asignatura"
					label="Asignatura (Lista o texto libre)"
					options={options}
					isRequired={isRequired}
					isDisabled={isDisabled}
					placeholder="Selecciona o escribe cualquier otra materia..."
				/>
			</div>

			<div className="p-2.5 bg-gray-900 rounded-lg text-xs font-mono text-green-300">
				<span>
					form.values.asignatura: {JSON.stringify(form.values.asignatura)}
				</span>
			</div>
		</div>
	);
}

function TextareaFormPlayground() {
	type F = { observaciones: string };
	const [rows, setRows] = useState(3);
	const [isRequired, setIsRequired] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);

	const form = useForm<F>({
		initialValues: { observaciones: "" },
	});

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-4 text-xs">
				<div className="flex items-center gap-1.5">
					<span className="text-foreground/60">rows:</span>
					<input
						type="number"
						min={1}
						max={8}
						value={rows}
						onChange={(e) => setRows(Number(e.target.value))}
						className="w-16 p-1 rounded border border-default-300 bg-default text-xs"
					/>
				</div>
				<label className="flex items-center gap-1.5 cursor-pointer">
					<input
						type="checkbox"
						checked={isRequired}
						onChange={(e) => setIsRequired(e.target.checked)}
					/>
					<span>isRequired ({String(isRequired)})</span>
				</label>
				<label className="flex items-center gap-1.5 cursor-pointer">
					<input
						type="checkbox"
						checked={isDisabled}
						onChange={(e) => setIsDisabled(e.target.checked)}
					/>
					<span>isDisabled ({String(isDisabled)})</span>
				</label>
			</div>

			<div className="p-3.5 bg-default-50 rounded-xl border border-default-200">
				<TextAreaForm<F>
					form={form}
					name="observaciones"
					label="Observaciones o Detalles"
					rows={rows}
					isRequired={isRequired}
					isDisabled={isDisabled}
					description="Sin redimensión manual para mantener coherencia visual"
				/>
			</div>

			<div className="p-2.5 bg-gray-900 rounded-lg text-xs font-mono text-green-300 flex justify-between">
				<span>Longitud de caracteres: {form.values.observaciones.length}</span>
			</div>
		</div>
	);
}

const ComponentsSection = () => {
	const [filter, setFilter] = useState<string>("all");

	const items = [
		{ id: "modal", label: "Modal.tsx" },
		{ id: "icon", label: "Icon.tsx" },
		{ id: "animatetext", label: "AnimateText.tsx" },
		{ id: "simpleloading", label: "SimpleLoading.tsx" },
		{ id: "switchtheme", label: "SwitchTheme.tsx" },
		{ id: "imagelogo", label: "ImageLogo.tsx" },
		{ id: "imagecutlogo", label: "ImageCutLogo.tsx" },
		{ id: "inputform", label: "InputForm.tsx" },
		{ id: "selectform", label: "SelectForm.tsx" },
		{ id: "comboboxform", label: "ComboBoxForm.tsx" },
		{ id: "textareaform", label: "TextareaForm.tsx" },
	];

	return (
		<div className="flex flex-col gap-6">
			{/* Sub-navegación por píldoras para saltar o filtrar componentes */}
			<div className="flex items-center gap-1.5 p-1.5 bg-surface-secondary rounded-xl overflow-x-auto border border-border">
				<button
					onClick={() => setFilter("all")}
					className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
						filter === "all"
							? "bg-primary text-primary-foreground shadow-xs"
							: "text-foreground-muted hover:bg-surface-hover hover:text-foreground"
					}`}
				>
					Todos ({items.length})
				</button>
				{items.map((it) => (
					<button
						key={it.id}
						onClick={() => setFilter(it.id)}
						className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
							filter === it.id
								? "bg-primary text-primary-foreground shadow-xs"
								: "text-foreground-muted hover:bg-surface-hover hover:text-foreground"
						}`}
					>
						{it.label}
					</button>
				))}
			</div>

			{/* 1. Modal */}
			{(filter === "all" || filter === "modal") && (
				<ComponentItemCard
					id="modal"
					title="Modal.tsx (Componente de Ventana Modal)"
					file="src/components/ui/Modal.tsx"
					badge="UI Modal"
					badgeColor="accent"
					description="Modal imperativo controlado por useRef (ModalRef) con métodos .open(), .close() y .toggle(). Dispone de plantillas con iconos semánticos y botones preconfigurados."
					propsTable={[
						{
							name: "ref",
							type: "React.RefObject<ModalRef>",
							required: true,
							description:
								"Referencia para manipular el modal desde el padre sin estados booleanos",
						},
						{
							name: "title",
							type: "string",
							description: "Encabezado o título del diálogo",
						},
						{
							name: "size",
							type: '"xs" | "sm" | "md" | "lg" | "full"',
							default: '"md"',
							description: "Ancho del contenedor",
						},
						{
							name: "animate",
							type: '"Fluid Slide" | "Kinematic Scale"',
							default: '"Fluid Slide"',
							description: "Física de animación al entrar y salir",
						},
						{
							name: "backdropVariant",
							type: '"blur" | "opaque" | "transparent"',
							default: '"opaque"',
							description: "Efecto de desenfoque u opacidad del fondo",
						},
						{
							name: "closeDisabled",
							type: "boolean",
							default: "false",
							description: "Bloquea el cierre con Escape o clic afuera",
						},
						{
							name: "template",
							type: "object",
							description:
								"Objeto { variant: 'danger'|'warning'|'success'|'info', showFooter, primaryText, secondaryText, onClick }",
						},
						{
							name: "children",
							type: "React.ReactNode",
							description: "Cuerpo o JSX interno renderizado en el modal",
						},
					]}
					playground={<ModalPlayground />}
					usage={`import { useRef } from "react";
import Modal, { ModalRef } from "@/src/components/ui/Modal";
import { Button } from "@heroui/react";

export default function EjemploModal() {
  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <Modal
        ref={modalRef}
        title="Eliminar Estudiante"
        size="sm"
        template={{
          variant: "danger",
          showFooter: true,
          primaryText: "Eliminar",
          secondaryText: "Cancelar",
          onClick: () => console.log("Confirmado"),
        }}
      >
        <p>¿Estás seguro de eliminar este registro permanentemente?</p>
      </Modal>

      <Button onPress={() => modalRef.current?.open()}>Abrir Diálogo</Button>
    </>
  );
}`}
				/>
			)}

			{/* 2. Icon */}
			{(filter === "all" || filter === "icon") && (
				<ComponentItemCard
					id="icon"
					title="Icon.tsx (Bootstrap Icons Wrapper)"
					file="src/components/ui/Icon.tsx"
					badge="UI Icon"
					badgeColor="accent"
					description="Componente liviano para renderizar iconos de Bootstrap Icons mediante el nombre sin el prefijo 'bi-'. Compatible con TailwindCSS."
					propsTable={[
						{
							name: "icon",
							type: "string",
							required: true,
							description:
								"Nombre del icono de Bootstrap (ej: 'house-fill', 'gear', 'trash')",
						},
						{
							name: "className",
							type: "string",
							default: '""',
							description:
								"Clases de tamaño (text-2xl), color (text-primary) o espaciado",
						},
						{
							name: "onClick",
							type: "(e: React.MouseEvent) => void",
							description: "Función ejecutada al presionar el icono",
						},
						{
							name: "title",
							type: "string",
							description: "Tooltip emergente nativo del navegador",
						},
					]}
					playground={<IconPlayground />}
					usage={`import Icon from "@/src/components/ui/Icon";

<Icon icon="bell-fill" className="text-xl text-primary" title="Notificaciones" />
<Icon icon="trash" className="text-red-500 cursor-pointer" onClick={() => borrar()} />`}
				/>
			)}

			{/* 3. AnimateText */}
			{(filter === "all" || filter === "animatetext") && (
				<ComponentItemCard
					id="animatetext"
					title="AnimateText.tsx (Texto con Animación Escalonada)"
					file="src/components/ui/AnimateText.tsx"
					badge="UI Animation"
					badgeColor="accent"
					description="Componente de texto dinámico basado en Framer Motion. Divide el texto en letras o palabras animadas con efectos combinados de desenfoque progresivo (blur), opacidad y desplazamiento vertical (slide), con soporte para subtítulo o descripción secundaria sincronizada."
					propsTable={[
						{
							name: "text",
							type: "string",
							required: true,
							description:
								"Texto principal que se fragmenta y anima secuencialmente según el modo seleccionado (por letra o por palabra).",
						},
						{
							name: "className",
							type: "string",
							description:
								"Clases de Tailwind/CSS aplicadas al contenedor <motion.p> del texto principal (tamaño, color, peso tipográfico, alineación, tracking, etc.).",
						},
						{
							name: "animate",
							type: "{ mode: 'letter' | 'word'; type?: 'fade' | 'slide'; velocity?: number }",
							default: "{ mode: 'word', velocity: 0.5 }",
							description:
								"Objeto de configuración de la física y segmentación de la animación del texto.",
						},
						{
							name: "animate.mode",
							type: "'letter' | 'word'",
							default: "'word'",
							description:
								"Estrategia de fragmentación: 'word' separa por espacios completos manteniendo palabras legibles; 'letter' separa carácter por carácter estilo mecanografía o texto fluido.",
						},
						{
							name: "animate.type",
							type: "'fade' | 'slide'",
							default: "'slide'",
							description:
								"Efecto visual de aparición: 'slide' entra desde y: 30 con blur(10px) y opacidad gradual; 'fade' entra en su posición original con blur(10px) y opacidad sin desplazamiento.",
						},
						{
							name: "animate.velocity",
							type: "number",
							default: "0.5",
							description:
								"Cadencia de velocidad. Controla el retardo escalonado de Framer Motion (staggerChildren y delay: i / velocity). Valores mayores aceleran la animación entre fragmentos consecutivos (ej. 2-5 para palabras, 15-30 para letras).",
						},
						{
							name: "description",
							type: "{ text: string; className?: string; delay?: number }",
							description:
								"Configuración opcional para renderizar un párrafo secundario o subtítulo explicativo con animación de fade in.",
						},
						{
							name: "description.text",
							type: "string",
							required: true,
							description:
								"Cadena de texto para la descripción secundaria.",
						},
						{
							name: "description.className",
							type: "string",
							default: "'text-sm text-gray'",
							description:
								"Clases Tailwind/CSS adicionales para estilizar el texto descriptivo.",
						},
						{
							name: "description.delay",
							type: "number",
							default: "0.5",
							description:
								"Tiempo de espera (en segundos) antes de que la descripción inicie su animación de aparición gradual.",
						},
					]}
					playground={<AnimateTextPlayground />}
					usage={`import AnimateText from "@/src/components/ui/AnimateText";

// Caso 1: Título animado por palabras con desplazamiento suave y subtítulo
<AnimateText
  text="Escuela Colombiana de Ingeniería Julio Garavito"
  className="text-3xl font-extrabold text-foreground tracking-tight"
  animate={{
    mode: "word",
    type: "slide",
    velocity: 2,
  }}
  description={{
    text: "Innovación, tecnología y formación académica de excelencia.",
    className: "text-foreground-muted mt-2",
    delay: 0.8,
  }}
/>

// Caso 2: Efecto fluido letra por letra con desenfoque suave (fade)
<AnimateText
  text="Plantilla de Desarrollo Frontend ECI"
  className="text-xl font-bold text-primary font-mono"
  animate={{
    mode: "letter",
    type: "fade",
    velocity: 25,
  }}
/>`}
				/>
			)}

			{/* 4. SimpleLoading */}
			{(filter === "all" || filter === "simpleloading") && (
				<ComponentItemCard
					id="simpleloading"
					title="SimpleLoading.tsx (Indicador de Carga)"
					file="src/components/ui/SimpleLoading.tsx"
					badge="UI Loading"
					badgeColor="accent"
					description="Spinner animado acompañado de esferas rebotantes para indicar estados de espera en peticiones asíncronas."
					propsTable={[]}
					playground={<SimpleLoadingPlayground />}
					usage={`import { SimpleLoading } from "@/src/components/ui/SimpleLoading";

export default function Vista() {
  const [loading, setLoading] = useState(true);

  if (loading) return <SimpleLoading />;
  return <div>Contenido cargado</div>;
}`}
				/>
			)}

			{/* 4. SwitchTheme */}
			{(filter === "all" || filter === "switchtheme") && (
				<ComponentItemCard
					id="switchtheme"
					title="SwitchTheme.tsx (Alternador de Tema)"
					file="src/components/ui/SwitchTheme.tsx"
					badge="UI Theme"
					badgeColor="warning"
					description="Botón flotante en la esquina de la pantalla que conmuta suavemente entre tema claro y tema oscuro usando next-themes."
					propsTable={[]}
					playground={<SwitchThemePlayground />}
					usage={`import SwitchTheme from "@/src/components/ui/SwitchTheme";

// Ubicado globalmente en app/layout.tsx dentro del Providers
<Providers>
  {children}
  <SwitchTheme />
</Providers>`}
				/>
			)}

			{/* 5. ImageLogo */}
			{(filter === "all" || filter === "imagelogo") && (
				<ComponentItemCard
					id="imagelogo"
					title="ImageLogo.tsx (Logo Institucional Completo)"
					file="src/components/ui/ImageLogo.tsx"
					badge="UI Logo"
					badgeColor="accent"
					description="Logo institucional ECIJG con soporte automático para modo claro/oscuro, varias alturas predeterminadas y fallback inteligente."
					propsTable={[
						{
							name: "height",
							type: "66 | 81 | 126 | 250",
							default: "126",
							description: "Altura en píxeles del logo",
						},
						{
							name: "target",
							type: "string",
							description: "Si se define, navegará a la ruta '/' al hacer clic",
						},
						{
							name: "reload",
							type: "boolean",
							default: "false",
							description: "Si es true, recargará la ventana al hacer clic",
						},
						{
							name: "title",
							type: "string",
							description: "Texto flotante descriptivo",
						},
						{
							name: "className",
							type: "string",
							description: "Clases adicionales en el contenedor <section>",
						},
					]}
					playground={<ImageLogoPlayground />}
					usage={`import ImageLogo from "@/src/components/ui/ImageLogo";

<ImageLogo height={81} target="/" title="Ir al Inicio" />`}
				/>
			)}

			{/* 6. ImageCutLogo */}
			{(filter === "all" || filter === "imagecutlogo") && (
				<ComponentItemCard
					id="imagecutlogo"
					title="ImageCutLogo.tsx (Isotipo Recortado ECIJG)"
					file="src/components/ui/ImageCutLogo.tsx"
					badge="UI Logo"
					badgeColor="accent"
					description="Isotipo recortado de 18px × 30px ideal para barras superiores compactas o menús laterales."
					propsTable={[
						{
							name: "target",
							type: "string",
							description: "Ruta de redirección al presionar",
						},
						{
							name: "reload",
							type: "boolean",
							default: "false",
							description: "Recarga el navegador",
						},
						{ name: "title", type: "string", description: "Texto alternativo" },
					]}
					playground={<ImageCutLogoPlayground />}
					usage={`import ImageLogoCut from "@/src/components/ui/ImageCutLogo";

<ImageLogoCut target="/" title="Logo ECIJG" />`}
				/>
			)}

			{/* 7. InputForm */}
			{(filter === "all" || filter === "inputform") && (
				<ComponentItemCard
					id="inputform"
					title="InputForm.tsx (Input de Formulario con Validación)"
					file="src/components/form/InputForm.tsx"
					badge="Form Control"
					badgeColor="accent"
					description="Campo de entrada de texto, correo, contraseña, fecha o número sincronizado con useForm con reporte automático de errores."
					propsTable={[
						{
							name: "form",
							type: "ReturnType<useForm<T>>",
							required: true,
							description: "Instancia retornada por el hook useForm",
						},
						{
							name: "name",
							type: "keyof T",
							required: true,
							description: "Nombre de la clave en los valores del formulario",
						},
						{
							name: "label",
							type: "string",
							description: "Etiqueta superior del input",
						},
						{
							name: "type",
							type: "string",
							default: '"text"',
							description: '"text" | "email" | "password" | "number" | "date"',
						},
						{
							name: "placeholder",
							type: "string",
							description: "Texto guía del campo",
						},
						{
							name: "description",
							type: "string",
							description: "Mensaje explicativo bajo el input",
						},
						{
							name: "isRequired",
							type: "boolean",
							default: "false",
							description: "Indica obligatoriedad visual",
						},
						{
							name: "isDisabled",
							type: "boolean",
							default: "false",
							description: "Deshabilita la edición",
						},
					]}
					playground={<InputFormPlayground />}
					usage={`type MiFormulario = { correo: string };
const form = useForm<MiFormulario>({
  initialValues: { correo: "" },
  schema: { correo: { required: "El correo es obligatorio", email: true } },
});

<InputForm<MiFormulario>
  form={form}
  name="correo"
  label="Correo Electrónico"
  type="email"
  isRequired
/>`}
				/>
			)}

			{/* 8. SelectForm */}
			{(filter === "all" || filter === "selectform") && (
				<ComponentItemCard
					id="selectform"
					title="SelectForm.tsx (Autocomplete con Búsqueda)"
					file="src/components/form/SelectForm.tsx"
					badge="Form Control"
					badgeColor="accent"
					description="Selector con caja de búsqueda interactiva basado en HeroUI Autocomplete. Permite iconos de Bootstrap y descripciones por opción."
					propsTable={[
						{
							name: "form",
							type: "ReturnType<useForm<T>>",
							required: true,
							description: "Instancia de useForm",
						},
						{
							name: "name",
							type: "keyof T",
							required: true,
							description: "Clave del campo en el formulario",
						},
						{
							name: "options",
							type: "Option[]",
							required: true,
							description:
								"Arreglo de { label, value, description?, startContent?, endContent? }",
						},
						{ name: "label", type: "string", description: "Etiqueta superior" },
						{
							name: "icon",
							type: "string",
							description: "Nombre de icono Bootstrap al lado del campo",
						},
						{
							name: "isRequired",
							type: "boolean",
							default: "false",
							description:
								"Oculta el botón para limpiar la selección si es true",
						},
						{
							name: "isDisabled",
							type: "boolean",
							default: "false",
							description: "Deshabilita la selección",
						},
					]}
					playground={<SelectFormPlayground />}
					usage={`const roles = [
  { label: "Administrador", value: "admin", description: "Acceso total" },
  { label: "Docente", value: "docente", description: "Gestión académica" },
];

<SelectForm<MiFormulario>
  form={form}
  name="rol"
  label="Rol Institucional"
  options={roles}
  icon="person-badge"
/>`}
				/>
			)}

			{/* 9. ComboBoxForm */}
			{(filter === "all" || filter === "comboboxform") && (
				<ComponentItemCard
					id="comboboxform"
					title="ComboBoxForm.tsx (Selector Híbrido Libre)"
					file="src/components/form/ComboBoxForm.tsx"
					badge="Form Control"
					badgeColor="accent"
					description="ComboBox híbrido que permite seleccionar de una lista o escribir un valor libre arbitrario si no existe en la lista."
					propsTable={[
						{
							name: "form",
							type: "ReturnType<useForm<T>>",
							required: true,
							description: "Instancia de useForm",
						},
						{
							name: "name",
							type: "keyof T",
							required: true,
							description: "Identificador del campo",
						},
						{
							name: "options",
							type: "Option[]",
							required: true,
							description: "Opciones { label, value, description? }",
						},
						{ name: "label", type: "string", description: "Etiqueta" },
						{
							name: "placeholder",
							type: "string",
							description: "Placeholder de entrada",
						},
						{
							name: "isRequired",
							type: "boolean",
							default: "false",
							description: "Obligatoriedad",
						},
						{
							name: "isDisabled",
							type: "boolean",
							default: "false",
							description: "Deshabilita",
						},
					]}
					playground={<ComboBoxFormPlayground />}
					usage={`<ComboBoxForm<MiFormulario>
  form={form}
  name="ciudad"
  label="Ciudad"
  options={[{ label: "Bogotá", value: "bog" }]}
  placeholder="Selecciona o escribe..."
/>`}
				/>
			)}

			{/* 10. TextareaForm */}
			{(filter === "all" || filter === "textareaform") && (
				<ComponentItemCard
					id="textareaform"
					title="TextareaForm.tsx (Campo de Texto Multilínea)"
					file="src/components/form/TextareaForm.tsx"
					badge="Form Control"
					badgeColor="accent"
					description="Área de texto de altura configurable (rows) sin resize manual para mantener una maquetación uniforme y con validación reactiva."
					propsTable={[
						{
							name: "form",
							type: "ReturnType<useForm<T>>",
							required: true,
							description: "Instancia de useForm",
						},
						{
							name: "name",
							type: "keyof T",
							required: true,
							description: "Clave del campo",
						},
						{ name: "label", type: "string", description: "Etiqueta" },
						{
							name: "rows",
							type: "number",
							default: "4",
							description: "Cantidad de filas visibles",
						},
						{
							name: "description",
							type: "string",
							description: "Ayuda descriptiva",
						},
						{
							name: "isRequired",
							type: "boolean",
							default: "false",
							description: "Obligatoriedad",
						},
						{
							name: "isDisabled",
							type: "boolean",
							default: "false",
							description: "Deshabilita el área",
						},
					]}
					playground={<TextareaFormPlayground />}
					usage={`<TextAreaForm<MiFormulario>
  form={form}
  name="comentarios"
  label="Comentarios"
  rows={3}
  description="Máx. 300 caracteres"
/>`}
				/>
			)}
		</div>
	);
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 2: HOOKS (TOTALMENTE SEPARADOS)
// ═══════════════════════════════════════════════════════════════════════════════

function UseFormPlayground() {
	type F = { nombre: string; correo: string; edad: number | null };
	const form = useForm<F>({
		initialValues: { nombre: "", correo: "", edad: null },
		schema: {
			nombre: {
				required: "El nombre es obligatorio",
				minLength: { value: 3, message: "Mínimo 3 caracteres" },
			},
			correo: { required: "El correo es obligatorio", email: true },
			edad: { number: true },
		},
	});

	return (
		<div className="flex flex-col gap-3">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
				<InputForm<F> form={form} name="nombre" label="Nombre" isRequired />
				<InputForm<F>
					form={form}
					name="correo"
					label="Correo"
					type="email"
					isRequired
				/>
				<InputForm<F> form={form} name="edad" label="Edad" type="number" />
			</div>

			<div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
				<div className="flex gap-2">
					<Button size="sm" variant="ghost" onPress={() => form.reset()}>
						form.reset()
					</Button>
					<Button size="sm" variant="secondary" onPress={() => form.validate()}>
						form.validate()
					</Button>
				</div>
				<span
					className={`text-xs font-semibold ${form.isValid ? "text-green-500" : "text-amber-500"}`}
				>
					isValid: {String(form.isValid)}
				</span>
			</div>

			<div className="p-3 bg-gray-900 rounded-lg text-xs font-mono text-green-300">
				<div>values: {JSON.stringify(form.values)}</div>
				<div>errors: {JSON.stringify(form.errors)}</div>
			</div>
		</div>
	);
}

function UseMountedPlayground() {
	const [mounted, setMounted] = useState(false);

	const simulate = () => {
		setMounted(false);
		setTimeout(() => setMounted(true), 800);
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<span className="text-xs text-foreground/70">
					Estado de montaje en cliente:
				</span>
				<Button size="sm" variant="secondary" onPress={simulate}>
					Re-ejecutar simulación
				</Button>
			</div>
			<div className="p-3 rounded-xl bg-default-50 border border-default-200 flex items-center gap-2 text-xs font-mono">
				<span
					className={`w-3 h-3 rounded-full ${mounted ? "bg-green-500" : "bg-amber-500 animate-pulse"}`}
				/>
				<span>
					mounted: <strong>{String(mounted)}</strong>
				</span>
			</div>
		</div>
	);
}

function UseQueryParamsPlayground() {
	const [rawQuery, setRawQuery] = useState(
		"categoria=programacion&nivel=avanzado&semestre=5",
	);

	const parseQuery = (query: string, keys?: string[]) => {
		const params = new URLSearchParams(query);
		const result: Record<string, string> = {};
		params.forEach((value, key) => {
			if (!keys || keys.includes(key)) {
				result[key] = value;
			}
		});
		return result;
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1 text-xs">
				<span className="text-foreground/60">
					Simular URL Query (?searchParams):
				</span>
				<input
					type="text"
					value={rawQuery}
					onChange={(e) => setRawQuery(e.target.value)}
					className="p-1.5 rounded border border-default-300 bg-default font-mono text-xs"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
				<div className="p-2.5 bg-gray-900 text-green-300 rounded-lg">
					<span className="text-gray-400">useQueryParams() sin filtro:</span>
					<pre className="mt-1">
						{JSON.stringify(parseQuery(rawQuery), null, 2)}
					</pre>
				</div>
				<div className="p-2.5 bg-gray-900 text-green-300 rounded-lg">
					<span className="text-gray-400">useQueryParams(["categoria"]):</span>
					<pre className="mt-1">
						{JSON.stringify(parseQuery(rawQuery, ["categoria"]), null, 2)}
					</pre>
				</div>
			</div>
		</div>
	);
}

function UseFormDataPlayground() {
	const [minFiles, setMinFiles] = useState(1);
	const [maxFiles, setMaxFiles] = useState(3);
	const [filesCount, setFilesCount] = useState(1);

	const isValid = filesCount >= minFiles && filesCount <= maxFiles;

	return (
		<div className="flex flex-col gap-3">
			<div className="grid grid-cols-3 gap-2 text-xs">
				<div>
					<span>minFiles:</span>
					<input
						type="number"
						value={minFiles}
						onChange={(e) => setMinFiles(Number(e.target.value))}
						className="w-full p-1 rounded border border-default-300 bg-default"
					/>
				</div>
				<div>
					<span>maxFiles:</span>
					<input
						type="number"
						value={maxFiles}
						onChange={(e) => setMaxFiles(Number(e.target.value))}
						className="w-full p-1 rounded border border-default-300 bg-default"
					/>
				</div>
				<div>
					<span>Archivos añadidos:</span>
					<div className="flex items-center gap-1 mt-1">
						<button
							onClick={() => setFilesCount(Math.max(0, filesCount - 1))}
							className="px-2 py-0.5 rounded bg-default-200 font-bold"
						>
							-
						</button>
						<span className="px-2 font-mono font-bold">{filesCount}</span>
						<button
							onClick={() => setFilesCount(filesCount + 1)}
							className="px-2 py-0.5 rounded bg-default-200 font-bold"
						>
							+
						</button>
					</div>
				</div>
			</div>

			<div className="p-2.5 rounded-lg bg-default-50 border border-default-200 text-xs font-mono flex items-center justify-between">
				<span>validFiles:</span>
				<span
					className={
						isValid ? "text-green-500 font-bold" : "text-red-500 font-bold"
					}
				>
					{String(isValid)}{" "}
					{isValid ? "✅ (Correcto)" : "❌ (Fuera de límites)"}
				</span>
			</div>
		</div>
	);
}

const HooksSection = () => (
	<div className="flex flex-col gap-6">
		<ComponentItemCard
			title="useForm.ts (Manejador de Formularios y Validación)"
			file="src/hooks/useForm.ts"
			badge="Custom Hook"
			badgeColor="default"
			description="Hook reactivo que administra el estado de valores, errores por campo, validación asíncrona, reseteo y validación estricta de esquemas."
			fnTable={[
				{
					name: "values",
					signature: "T",
					description: "Valores vigentes del formulario tipados al genérico T",
				},
				{
					name: "errors",
					signature: "Partial<Record<keyof T, string | null>>",
					description: "Mensajes de error asociados a cada clave",
				},
				{
					name: "isValid",
					signature: "boolean",
					description:
						"Memo booleano que verifica si todos los campos cumplen el esquema",
				},
				{
					name: "setValue",
					signature: "(field: keyof T, value: any) => void",
					description: "Establece un valor individual y recalcula errores",
				},
				{
					name: "setValues",
					signature: "(data: Partial<T>) => void",
					description: "Carga en bloque múltiples valores (ideal para edición)",
				},
				{
					name: "validate",
					signature: "() => boolean",
					description:
						"Fuerza la validación total de todos los campos del formulario",
				},
				{
					name: "reset",
					signature: "() => void",
					description: "Restaura el estado a initialValues y borra los errores",
				},
			]}
			playground={<UseFormPlayground />}
			usage={`import useForm from "@/src/hooks/useForm";

type FormState = { usuario: string; email: string };

const form = useForm<FormState>({
  initialValues: { usuario: "", email: "" },
  schema: {
    usuario: { required: "Requerido", minLength: { value: 3, message: "Mínimo 3" } },
    email: { required: "Requerido", email: true },
  },
});

// En el submit:
if (!form.validate()) return;
console.log(form.values);`}
		/>

		<ComponentItemCard
			title="UseMounted.ts (Protección contra Hydration Mismatch)"
			file="src/hooks/UseMounted.ts"
			badge="Custom Hook"
			badgeColor="default"
			description="Retorna true una vez que el componente se monta en el navegador del cliente. Indispensable para componentes que leen window, localStorage o temas en Next.js."
			fnTable={[
				{
					name: "useMounted()",
					signature: "(): boolean",
					description:
						"Retorna false en SSR y true en cuanto monta en el DOM del cliente",
				},
			]}
			playground={<UseMountedPlayground />}
			usage={`import useMounted from "@/src/hooks/UseMounted";

export default function MiComponente() {
  const mounted = useMounted();
  if (!mounted) return null; // Evita error de hidratación en SSR
  return <div>{window.location.origin}</div>;
}`}
		/>

		<ComponentItemCard
			title="useQueryParams.ts (Parámetros de URL Tipados)"
			file="src/hooks/useQueryParams.ts"
			badge="Custom Hook"
			badgeColor="default"
			description="Extrae y filtra los parámetros de la URL usando searchParams de Next.js App Router con tipado TypeScript seguro."
			fnTable={[
				{
					name: "useQueryParams<T>()",
					signature: "(keys?: (keyof T)[]): T",
					description:
						"Extrae solo las claves especificadas o todas las presentes en la URL",
				},
			]}
			playground={<UseQueryParamsPlayground />}
			usage={`// URL: /catalogo?filtro=cursos&pagina=2
type MisParams = { filtro: string; pagina: string };

const { filtro, pagina } = useQueryParams<MisParams>(["filtro", "pagina"]);`}
		/>

		<ComponentItemCard
			title="UseFormData.ts (Manejador de Subida de Archivos)"
			file="src/hooks/UseFormData.ts"
			badge="Custom Hook"
			badgeColor="default"
			description="Facilita la construcción de un FormData multipart para subida de archivos múltiples con validación de límites numéricos (minFiles y maxFiles)."
			fnTable={[
				{
					name: "getFormData",
					signature: "FormData",
					description:
						"Instancia actual de FormData preparada para enviarse en peticiones",
				},
				{
					name: "setData",
					signature: "(data: any) => FormData",
					description: "Inyecta campos de texto/objeto en el FormData",
				},
				{
					name: "setFilesField",
					signature: "(files: FileList | File[] | null) => void",
					description: "Adjunta los archivos y valida las restricciones",
				},
				{
					name: "validFiles",
					signature: "boolean",
					description:
						"Booleano que confirma si la cantidad de archivos cumple el rango",
				},
			]}
			playground={<UseFormDataPlayground />}
			usage={`const { getFormData, setData, setFilesField, validFiles } = useFormData({
  minFiles: 1,
  maxFiles: 5,
  fdFilesName: "documentos",
});

// En el input type='file':
<input type="file" multiple onChange={(e) => setFilesField(e.target.files)} />`}
		/>
	</div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 3: LIBRERÍAS Y UTILIDADES (TOTALMENTE SEPARADAS)
// ═══════════════════════════════════════════════════════════════════════════════

function FetchFnPlayground() {
	const [endpoint, setEndpoint] = useState("/api/usuarios");
	const [method, setMethod] = useState("GET");
	const [token, setToken] = useState("bearer_mock_jwt_token");

	return (
		<div className="flex flex-col gap-3">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
				<div className="flex flex-col gap-1">
					<span className="text-foreground/60">endpoint:</span>
					<input
						type="text"
						value={endpoint}
						onChange={(e) => setEndpoint(e.target.value)}
						className="p-1 rounded border border-default-300 bg-default font-mono"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-foreground/60">method:</span>
					<select
						value={method}
						onChange={(e) => setMethod(e.target.value)}
						className="p-1 rounded border border-default-300 bg-default"
					>
						{["GET", "POST", "PUT", "DELETE"].map((m) => (
							<option key={m} value={m}>
								{m}
							</option>
						))}
					</select>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-foreground/60">token:</span>
					<input
						type="text"
						value={token}
						onChange={(e) => setToken(e.target.value)}
						className="p-1 rounded border border-default-300 bg-default font-mono"
					/>
				</div>
			</div>

			<div className="p-3 bg-gray-900 rounded-xl text-xs font-mono text-green-300 space-y-1">
				<div className="text-gray-400">// Petición construida:</div>
				<div>URL: process.env.NEXT_PUBLIC_API_URL + "{endpoint}"</div>
				<div>Method: {method}</div>
				<div>
					Headers:{" "}
					{
						"{ 'Content-Type': 'application/json', 'Authorization': 'Bearer ...' }"
					}
				</div>
			</div>
		</div>
	);
}

function FunctionsStringsPlayground() {
	const [amount, setAmount] = useState("4500000");
	const [pass, setPass] = useState("EciSegura*2026");
	const [mail, setMail] = useState("ingenieria.desarrollo@escuelaing.edu.co");
	const [date, setDate] = useState("2026-10-16T12:30:00");

	const score = passwordSecurity(pass);
	const levels = [
		"🔴 Muy débil",
		"🟠 Débil",
		"🟡 Regular",
		"🟢 Buena",
		"✅ Fuerte",
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
			<div className="p-3 bg-default-50 rounded-xl border border-default-200 flex flex-col gap-1">
				<span className="font-semibold text-foreground/70">
					convertToCurrency()
				</span>
				<input
					type="text"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					className="p-1 rounded border border-default-300 bg-default font-mono text-xs"
				/>
				<span className="text-primary font-bold mt-1">
					Salida: {convertToCurrency(amount)}
				</span>
			</div>

			<div className="p-3 bg-default-50 rounded-xl border border-default-200 flex flex-col gap-1">
				<span className="font-semibold text-foreground/70">
					passwordSecurity()
				</span>
				<input
					type="text"
					value={pass}
					onChange={(e) => setPass(e.target.value)}
					className="p-1 rounded border border-default-300 bg-default font-mono text-xs"
				/>
				<span className="font-bold mt-1">
					Puntaje: {score}/4 ({levels[score]})
				</span>
			</div>

			<div className="p-3 bg-default-50 rounded-xl border border-default-200 flex flex-col gap-1">
				<span className="font-semibold text-foreground/70">
					encriptarCorreo()
				</span>
				<input
					type="text"
					value={mail}
					onChange={(e) => setMail(e.target.value)}
					className="p-1 rounded border border-default-300 bg-default font-mono text-xs"
				/>
				<span className="text-green-600 dark:text-green-400 font-mono mt-1">
					{encriptarCorreo(mail || "user@eci.edu.co")}
				</span>
			</div>

			<div className="p-3 bg-default-50 rounded-xl border border-default-200 flex flex-col gap-1">
				<span className="font-semibold text-foreground/70">formatDate()</span>
				<input
					type="text"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className="p-1 rounded border border-default-300 bg-default font-mono text-xs"
				/>
				<span className="font-mono mt-1 text-primary">
					{formatDate(date, true)} (DD/MM/AAAA HH:mm)
				</span>
			</div>
		</div>
	);
}

function UtilsPlayground() {
	const [clase1, setClase1] = useState("px-4 py-2 bg-default");
	const [clase2, setClase2] = useState("bg-primary text-white rounded-xl");
	const [emailCheck, setEmailCheck] = useState("contacto@escuelaing.edu.co");

	return (
		<div className="flex flex-col gap-3 text-xs">
			<div className="p-3 bg-default-50 rounded-xl border border-default-200 flex flex-col gap-2">
				<span className="font-semibold text-foreground/70">
					cn() - Resolución de conflictos de Tailwind:
				</span>
				<div className="grid grid-cols-2 gap-2">
					<input
						type="text"
						value={clase1}
						onChange={(e) => setClase1(e.target.value)}
						className="p-1 rounded border border-default-300 bg-default font-mono text-xs"
					/>
					<input
						type="text"
						value={clase2}
						onChange={(e) => setClase2(e.target.value)}
						className="p-1 rounded border border-default-300 bg-default font-mono text-xs"
					/>
				</div>
				<div className="p-2 bg-gray-900 rounded text-green-300 font-mono">
					cn("{clase1}", "{clase2}") → "{cn(clase1, clase2)}"
				</div>
			</div>

			<div className="p-3 bg-default-50 rounded-xl border border-default-200 flex flex-col gap-1">
				<span className="font-semibold text-foreground/70">
					validateEmail() estricto:
				</span>
				<input
					type="text"
					value={emailCheck}
					onChange={(e) => setEmailCheck(e.target.value)}
					className="p-1 rounded border border-default-300 bg-default font-mono text-xs"
				/>
				<span
					className={`font-bold mt-1 ${validateEmail(emailCheck) ? "text-green-500" : "text-red-500"}`}
				>
					Resultado: {String(validateEmail(emailCheck))}
				</span>
			</div>
		</div>
	);
}

const LibsSection = () => (
	<div className="flex flex-col gap-6">
		<ComponentItemCard
			title="fetchFn.ts (Cliente HTTP JSON Seguro)"
			file="src/libs/fetchFn.ts"
			badge="HTTP Client"
			badgeColor="success"
			description="Función wrapper sobre fetch nativo que concatena la URL de entorno, añade headers JSON y tokens JWT, capturando errores sin romper el flujo de la aplicación."
			fnTable={[
				{
					name: "fetchFn(endpoint, options)",
					signature: "Promise<{ code: number, data?: any, error?: boolean }>",
					description:
						"Ejecuta GET, POST, PUT o DELETE retornando status HTTP estructurado",
				},
			]}
			playground={<FetchFnPlayground />}
			usage={`import fetchFn from "@/src/libs/fetchFn";

const res = await fetchFn("/usuarios", {
  method: "POST",
  body: { nombre: "Juan" },
  token: session?.accessToken,
});

if (res.code === 200) {
  console.log(res.data);
}`}
		/>

		<ComponentItemCard
			title="functionsStrings.ts (Transformación y Formato)"
			file="src/libs/functionsStrings.ts"
			badge="Utility"
			badgeColor="success"
			description="Colección de funciones para formateo de moneda colombiana, cálculo de seguridad de contraseñas, formateo de fechas y encriptación visual de correos."
			fnTable={[
				{
					name: "convertToCurrency(value)",
					signature: "(val: any) => string",
					description: "Transforma a formato de pesos colombianos '$1.500.000'",
				},
				{
					name: "passwordSecurity(pass)",
					signature: "(p: string) => 0|1|2|3|4",
					description:
						"Calcula nivel de fortaleza según símbolos, números y mayúsculas",
				},
				{
					name: "formatDate(date, withTime?)",
					signature: "(d: string, time?: boolean) => string",
					description: "Formatea fechas ISO a DD/MM/AAAA HH:mm",
				},
				{
					name: "encriptarCorreo(correo)",
					signature: "(c: string) => string",
					description:
						"Enmascara correos para privacidad (ej: jgon****@eci.edu.co)",
				},
			]}
			playground={<FunctionsStringsPlayground />}
			usage={`import { convertToCurrency, passwordSecurity, formatDate } from "@/src/libs/functionsStrings";

const total = convertToCurrency(1500000); // "$1.500.000"
const score = passwordSecurity("MiClave*123"); // 4`}
		/>

		<ComponentItemCard
			title="utils.ts (cn & Validadores Generales)"
			file="src/libs/utils.ts"
			badge="Utility"
			badgeColor="success"
			description="Mezclador inteligente de clases TailwindCSS (clsx + tailwind-merge) y utilidades de validación de strings, números y correos."
			fnTable={[
				{
					name: "cn(...inputs)",
					signature: "(...ClassValue[]) => string",
					description: "Resuelve clases condicionales y conflictos en Tailwind",
				},
				{
					name: "validateEmail(email)",
					signature: "(email: string) => boolean",
					description: "Validador estricto según especificación RFC",
				},
				{
					name: "verifyNumbers(val)",
					signature: "(v: any) => number | null",
					description: "Verifica que el string solo contenga números válidos",
				},
			]}
			playground={<UtilsPlayground />}
			usage={`import { cn, validateEmail } from "@/src/libs/utils";

<div className={cn("p-4 bg-default-200", esActivo && "bg-primary text-white")} />`}
		/>
	</div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 4: REDUX TOOLKIT (TOTALMENTE SEPARADOS)
// ═══════════════════════════════════════════════════════════════════════════════

function ReduxStorePlayground() {
	const dispatch = useAppDispatch();
	const selectedCycles = useAppSelector(
		(state) => state.generalReducer.selectedCycles,
	);

	const [regular, setRegular] = useState(1);
	const [inter, setInter] = useState(2);

	const handleUpdate = () => {
		dispatch(
			setCycles({
				selectedCycles: {
					regular,
					intersemestral: inter,
				},
			}),
		);
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-3 flex-wrap text-xs">
				<div className="flex items-center gap-1.5">
					<span>Ciclo Regular:</span>
					<input
						type="number"
						value={regular}
						onChange={(e) => setRegular(Number(e.target.value))}
						className="w-16 p-1 rounded border border-default-300 bg-default text-xs"
					/>
				</div>
				<div className="flex items-center gap-1.5">
					<span>Ciclo Intersemestral:</span>
					<input
						type="number"
						value={inter}
						onChange={(e) => setInter(Number(e.target.value))}
						className="w-16 p-1 rounded border border-default-300 bg-default text-xs"
					/>
				</div>
				<Button size="sm" variant="primary" onPress={handleUpdate}>
					⚡ dispatch(setCycles)
				</Button>
			</div>

			<div className="p-3 bg-gray-900 rounded-xl text-xs font-mono text-green-300">
				<span className="text-gray-400">
					// Estado leído en tiempo real con useAppSelector:
				</span>
				<pre className="mt-1">{JSON.stringify(selectedCycles, null, 2)}</pre>
			</div>
		</div>
	);
}

const ReduxSection = () => (
	<div className="flex flex-col gap-6">
		<ComponentItemCard
			title="store.ts (Configuración Central del Store)"
			file="src/redux/store.ts"
			badge="Redux Config"
			badgeColor="accent"
			description="Configura el almacén central con Redux Toolkit, habilitando DevTools en modo desarrollo y exportando los tipos RootState y AppDispatch."
			fnTable={[
				{
					name: "store",
					signature: "EnhancedStore",
					description:
						"Instancia global de Redux provista a toda la aplicación",
				},
				{
					name: "RootState",
					signature: "ReturnType<typeof store.getState>",
					description:
						"Tipo TypeScript que modela el estado global de todos los slices",
				},
				{
					name: "AppDispatch",
					signature: "typeof store.dispatch",
					description: "Tipo seguro para invocar despachos en componentes",
				},
			]}
			usage={`// Para registrar un nuevo slice en store.ts:
import { configureStore } from "@reduxjs/toolkit";
import generalReducer from "./slices/generalSlice";
import miNuevoReducer from "./slices/miNuevoSlice";

export const store = configureStore({
  reducer: {
    generalReducer,
    miNuevoReducer, // <- Registrar aquí
  },
});`}
		/>

		<ComponentItemCard
			title="hooks.ts (Hooks Tipados useAppSelector & useAppDispatch)"
			file="src/redux/hooks.ts"
			badge="Redux Hooks"
			badgeColor="accent"
			description="Hooks tipados que reemplazan a useDispatch y useSelector estándar de react-redux evitando escribir los tipos manualmente en cada vista."
			fnTable={[
				{
					name: "useAppDispatch()",
					signature: "() => AppDispatch",
					description:
						"Devuelve el dispatch con soporte para Thunks y acciones tipadas",
				},
				{
					name: "useAppSelector",
					signature: "TypedUseSelectorHook<RootState>",
					description:
						"Selector con autocompletado de todos los reducers registrados",
				},
			]}
			usage={`import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";

const dispatch = useAppDispatch();
const estado = useAppSelector((state) => state.generalReducer);`}
		/>

		<ComponentItemCard
			title="slices/generalSlice.ts (Slice de Estado y Acciones)"
			file="src/redux/slices/generalSlice.ts"
			badge="Redux Slice"
			badgeColor="accent"
			description="Ejemplo arquitectónico de un slice de Redux Toolkit con estado inicial tipado, reducers síncronos y exportación de acciones."
			fnTable={[
				{
					name: "setCycles",
					signature: "ActionCreator<{ selectedCycles }>",
					description:
						"Actualiza los periodos académicos regulares e intersemestrales",
				},
			]}
			playground={<ReduxStorePlayground />}
			usage={`import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const generalSlice = createSlice({
  name: "general",
  initialState: { selectedCycles: { regular: null, intersemestral: null } },
  reducers: {
    setCycles: (state, action: PayloadAction<{ selectedCycles: any }>) => {
      state.selectedCycles = action.payload.selectedCycles;
    },
  },
});

export const { setCycles } = generalSlice.actions;
export default generalSlice.reducer;`}
		/>
	</div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 5: CONFIGURACIÓN & AUTH (TOTALMENTE SEPARADOS)
// ═══════════════════════════════════════════════════════════════════════════════

const ConfigSection = () => (
	<div className="flex flex-col gap-6">
		<ComponentItemCard
			title="auth.ts (NextAuth v4: Azure AD & Credentials)"
			file="app/api/auth/[...nextauth]/auth.ts"
			badge="Auth Config"
			badgeColor="warning"
			description="Configuración de autenticación con doble proveedor (Azure AD Institucional y Credentials) con estrategia de sesión JWT a 1 hora."
			fnTable={[
				{
					name: "authOptions",
					signature: "AuthOptions",
					description:
						"Opciones de configuración de NextAuth exportadas para API handlers y Server Components",
				},
			]}
			usage={`// En Server Components de Next.js:
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

const session = await getServerSession(authOptions);
console.log(session?.user?.email);

// En Client Components:
import { useSession } from "next-auth/react";
const { data: session } = useSession();`}
		/>

		<ComponentItemCard
			title="middleware.ts (Control Perimetral de Rutas)"
			file="middleware.ts"
			badge="Middleware"
			badgeColor="warning"
			description="Middleware que intercepta peticiones en el Edge. Permite activar fácilmente la protección de rutas como /dashboard sin forzar login por defecto en la plantilla."
			usage={`// Descomenta el bloque de protección en middleware.ts:
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token && request.nextUrl.pathname.startsWith("/privado")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}`}
		/>

		<ComponentItemCard
			title="providers.tsx (Encapsulador de Contextos)"
			file="app/providers.tsx"
			badge="Providers"
			badgeColor="warning"
			description="Integra en orden jerárquico el Provider de Redux, el HeroUIProvider y el ThemeProvider de next-themes para toda la aplicación."
			usage={`// app/layout.tsx:
<html lang="es" suppressHydrationWarning>
  <body>
    <Providers>{children}</Providers>
  </body>
</html>`}
		/>

		<ComponentItemCard
			title=".env.example (Variables de Entorno)"
			file=".env.example"
			badge="Environment"
			badgeColor="warning"
			description="Plantilla de variables requeridas para backend, NextAuth, Azure AD y nombres de contenedor Docker."
			usage={`NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genera_un_hash_aleatorio_seguro
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_VERSION_APP=1.0.0
PORT=3000
CONTAINER_NAME=eci-template`}
		/>
	</div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SECCIÓN 6: DOCKER & DESPLIEGUE (TOTALMENTE SEPARADOS)
// ═══════════════════════════════════════════════════════════════════════════════

function DockerGeneratorPlayground() {
	const [containerName, setContainerName] = useState("eci-frontend");
	const [port, setPort] = useState(3000);

	return (
		<div className="flex flex-col gap-3">
			<div className="grid grid-cols-2 gap-2 text-xs">
				<div className="flex flex-col gap-1">
					<span className="text-foreground/60">CONTAINER_NAME:</span>
					<input
						type="text"
						value={containerName}
						onChange={(e) => setContainerName(e.target.value)}
						className="p-1 rounded border border-default-300 bg-default font-mono text-xs"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<span className="text-foreground/60">PORT externo:</span>
					<input
						type="number"
						value={port}
						onChange={(e) => setPort(Number(e.target.value))}
						className="p-1 rounded border border-default-300 bg-default font-mono text-xs w-28"
					/>
				</div>
			</div>

			<div className="p-3 bg-gray-950 rounded-xl border border-gray-800 text-xs font-mono text-green-300">
				<div className="text-gray-400">// docker-compose.yml generado:</div>
				<pre className="mt-1 whitespace-pre-wrap">{`services:
  app:
    build: .
    image: ${containerName}:latest
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "${port}:3000"
    environment:
      - TZ=America/Bogota`}</pre>
			</div>

			<div className="flex items-center gap-2 p-2 rounded-lg bg-default-100 font-mono text-xs">
				<span className="text-foreground/50">Comando:</span>
				<Code>docker compose up --build -d</Code>
			</div>
		</div>
	);
}

const DockerSection = () => (
	<div className="flex flex-col gap-6">
		<ComponentItemCard
			title="Dockerfile (Construcción Multi-Stage en 4 Fases)"
			file="Dockerfile"
			badge="Docker"
			badgeColor="accent"
			description="Construcción optimizada para producción: 1. Base (Node Alpine) -> 2. Deps (npm ci) -> 3. Builder (npm run build) -> 4. Runner liviano (~120MB en vez de 1GB)."
			usage={`FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
CMD ["npm", "start"]`}
		/>

		<ComponentItemCard
			title="docker-compose.yml (Orquestación para Producción)"
			file="docker-compose.yml"
			badge="Docker Compose"
			badgeColor="accent"
			description="Levanta el contenedor de producción con mapeo de puertos dinámico desde .env, zona horaria de Bogotá y política de reinicio automático."
			playground={<DockerGeneratorPlayground />}
			usage={`# Construir y levantar contenedor productivo en segundo plano:
docker compose up --build -d

# Ver registros en tiempo real:
docker compose logs -f app`}
		/>

		<ComponentItemCard
			title="docker-compose.dev.yml (Contenedor para Desarrollo con Hot Reload)"
			file="docker-compose.dev.yml"
			badge="Dev Docker"
			badgeColor="accent"
			description="Permite programar dentro del contenedor montando la carpeta local como volumen, con sondeo de archivos chokidar y watchpack activo para recarga en caliente."
			usage={`# Levantar en desarrollo:
docker compose -f docker-compose.dev.yml up`}
		/>
	</div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORIES_CONFIG = [
	{
		id: "components",
		label: "Componentes",
		icon: "box-seam",
		dot: "bg-primary",
		content: <ComponentsSection />,
	},
	{
		id: "hooks",
		label: "Hooks",
		icon: "lightning-charge-fill",
		dot: "bg-purple-500",
		content: <HooksSection />,
	},
	{
		id: "libs",
		label: "Librerías",
		icon: "tools",
		dot: "bg-green-600",
		content: <LibsSection />,
	},
	{
		id: "redux",
		label: "Redux",
		icon: "arrow-repeat",
		dot: "bg-amber-500",
		content: <ReduxSection />,
	},
	{
		id: "config",
		label: "Configuración",
		icon: "gear-fill",
		dot: "bg-rose-500",
		content: <ConfigSection />,
	},
	{
		id: "docker",
		label: "Docker",
		icon: "boxes",
		dot: "bg-orange-500",
		content: <DockerSection />,
	},
];

export default function ComponentsModal({
	modalRef,
	category = "components",
	onCategoryChange,
}: {
	modalRef: React.RefObject<ModalRef | null>;
	category?: CategoryParam;
	onCategoryChange?: (category: CategoryParam) => void;
}) {
	const [internalCategory, setInternalCategory] =
		useState<CategoryParam>(category);

	useEffect(() => {
		if (category) {
			setInternalCategory(category);
		}
	}, [category]);

	const activeCategory = category ?? internalCategory;

	const handleSelectCategory = (catId: CategoryParam) => {
		setInternalCategory(catId);
		onCategoryChange?.(catId);
	};

	const active =
		CATEGORIES_CONFIG.find((c) => c.id === activeCategory) ??
		CATEGORIES_CONFIG[0];

	return (
		<Modal
			ref={modalRef}
			title={`Documentación & Playgrounds: ${active.label}`}
			size="lg"
			classContainer="max-w-4xl w-full"
			animate="Kinematic Scale"
			scroll="inside"
		>
			<div className="flex flex-col gap-4">
				{/* Selector de categoría estilizado y compacto */}
				<div className="flex items-center gap-1.5 p-1 bg-surface-secondary rounded-xl overflow-x-auto border border-border">
					{CATEGORIES_CONFIG.map((cat) => {
						const isSelected = activeCategory === cat.id;
						return (
							<button
								key={cat.id}
								onClick={() => handleSelectCategory(cat.id as CategoryParam)}
								className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
									isSelected
										? "bg-primary text-primary-foreground shadow-xs"
										: "text-foreground-muted hover:bg-surface-hover hover:text-foreground"
								}`}
							>
								<span
									className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : cat.dot}`}
								/>
								<Icon icon={cat.icon} className="text-xs" />
								<span>{cat.label}</span>
							</button>
						);
					})}
				</div>

				{/* Contenido scrolleable con componentes independientes */}
				<div className="pt-1">{active.content}</div>
			</div>
		</Modal>
	);
}
