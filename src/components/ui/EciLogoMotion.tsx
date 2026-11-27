"use client";

import { cn } from "@/src/libs/utils";
import { useTheme } from "next-themes";
import { useEffect, useState, type CSSProperties } from "react";

/**
 * Logo animado de la Escuela Colombiana de Ingeniería Julio Garavito.
 * Contenedor transparente controlado desde el padre mediante `className`,
 * con adaptación automática a modo claro/oscuro y velocidad parametrizable.
 */

const W = 963;
const H = 485;

type PartName =
	| "emblem"
	| "divider"
	| "base"
	| "l1"
	| "l2"
	| "l3"
	| "l4"
	| "vig"
	| "hr"
	| "univ";

/** [x0, y0, x1, y1] en píxeles del sprite base (963×485) */
const PARTS: Record<PartName, [number, number, number, number]> = {
	emblem: [0, 0, 325, 300],
	divider: [326, 4, 334, 272],
	base: [12, 301, 348, 308],
	l1: [366, 24, 850, 74],
	l2: [366, 92, 850, 143],
	l3: [366, 156, 850, 211],
	l4: [366, 229, 850, 280],
	vig: [918, 3, 960, 309],
	hr: [8, 365, 852, 372],
	univ: [214, 427, 646, 481],
};

function getPartStyles(name: PartName, src: string) {
	const [x0, y0, x1, y1] = PARTS[name];
	const w = x1 - x0;
	const h = y1 - y0;

	const boxStyle = {
		left: `${(x0 / W) * 100}%`,
		top: `${(y0 / H) * 100}%`,
		width: `${(w / W) * 100}%`,
		height: `${(h / H) * 100}%`,
		"--src": `url("${src}")`,
		"--size": `${(W / w) * 100}% ${(H / h) * 100}%`,
		"--pos": `${(x0 / (W - w)) * 100}% ${(y0 / (H - h)) * 100}%`,
	} as CSSProperties;

	const imgStyle: CSSProperties = {
		left: `${-(x0 / w) * 100}%`,
		top: `${-(y0 / h) * 100}%`,
		width: `${(W / w) * 100}%`,
		height: `${(H / h) * 100}%`,
	};

	return { boxStyle, imgStyle };
}

export interface EciLogoMotionProps {
	/** Alto del logo en píxeles (igual que ImageLogo). */
	height?: 66 | 81 | 126 | 250;
	/** Velocidad de la animación de entrada. */
	speed?: "fast" | "normal" | "slow";
	/** Acción opcional al hacer clic en el logo. */
	onClick?: () => void;
	/** Clases para el contenedor externo (controlado desde el padre). */
	className?: string;
}

const SPEED_SCALE: Record<NonNullable<EciLogoMotionProps["speed"]>, number> = {
	fast: 0.65,
	normal: 1,
	slow: 1.6,
};

export default function EciLogoMotion({
	height = 250,
	speed = "normal",
	onClick,
	className,
}: EciLogoMotionProps) {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [useFallback, setUseFallback] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = mounted && resolvedTheme === "dark";

	const primarySrc = isDark
		? "/images/ecijg-og-light.png"
		: "/images/ecijg-og.png";
	const fallbackSrc = isDark
		? "/images/ecijg250-light.png"
		: "/images/ecijg126.png";
	const activeSrc = useFallback ? fallbackSrc : primarySrc;

	useEffect(() => {
		setUseFallback(false);
	}, [primarySrc]);

	const logoWidth = Math.round((height * W) / H);

	const rootStyle = {
		"--eci-w": `${logoWidth}px`,
		"--eci-t": SPEED_SCALE[speed] ?? 1,
		"--eci-line": isDark
			? "rgba(255, 255, 255, 0.14)"
			: "rgba(153, 0, 0, 0.08)",
		"--eci-glint-blend": isDark ? "screen" : "overlay",
		"--eci-glint-color": isDark ? "#ffd9b0" : "rgba(255, 255, 255, 0.85)",
	} as CSSProperties;

	return (
		<section className={cn("w-fit max-w-full", className)} style={rootStyle}>
			<style>{CSS}</style>

			<div
				key={mounted ? activeSrc : "pending"}
				className={`eci-logo ${onClick ? "eci-logo--clickable" : ""}`}
				role={onClick ? "button" : "img"}
				tabIndex={onClick ? 0 : undefined}
				aria-label="Escuela Colombiana de Ingeniería Julio Garavito, Universidad"
				onClick={onClick}
				onKeyDown={
					onClick
						? (e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onClick();
								}
							}
						: undefined
				}
			>
				{mounted && (
					<>
						<div className="eci-blueprint" aria-hidden="true" />
						{(Object.keys(PARTS) as PartName[]).map((name) => {
							const { boxStyle, imgStyle } = getPartStyles(name, activeSrc);
							return (
								<div
									key={name}
									className={`eci-p eci-${name}`}
									style={boxStyle}
									aria-hidden="true"
								>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={activeSrc}
										alt=""
										className="eci-img"
										style={imgStyle}
										draggable={false}
										onError={
											name === "emblem"
												? () => {
														if (!useFallback) setUseFallback(true);
													}
												: undefined
										}
									/>
									{name === "emblem" && <div className="eci-glint" />}
								</div>
							);
						})}
					</>
				)}
			</div>
		</section>
	);
}

const CSS = `
.eci-logo{
  position:relative;
  width:var(--eci-w, 496px);
  max-width:100%;
  aspect-ratio:${W}/${H};
  user-select:none;
}
.eci-logo--clickable{cursor:pointer}
.eci-logo--clickable:focus-visible{
  outline:2px solid var(--primary, #990000);
  outline-offset:6px;
  border-radius:10px;
}
.eci-p{position:absolute;overflow:hidden}
.eci-img{
  position:absolute;
  display:block;
  max-width:none;
  max-height:none;
  pointer-events:none;
  image-rendering:auto;
}

/* Cuadrícula tipo plano detrás del emblema */
.eci-blueprint{
  position:absolute;inset:-6% -4%;pointer-events:none;opacity:0;
  background-image:
    linear-gradient(var(--eci-line) 1px,transparent 1px),
    linear-gradient(90deg,var(--eci-line) 1px,transparent 1px);
  background-size:4.2% 8.4%;
  -webkit-mask-image:radial-gradient(60% 70% at 18% 38%,#000 0%,transparent 70%);
          mask-image:radial-gradient(60% 70% at 18% 38%,#000 0%,transparent 70%);
  animation:eci-bp calc(1.4s * var(--eci-t, 1)) ease-out calc(.05s * var(--eci-t, 1)) forwards;
}
@keyframes eci-bp{0%{opacity:0}35%{opacity:.55}100%{opacity:.14}}

/* Líneas base y divisor */
.eci-base{transform-origin:left center;transform:scaleX(0);animation:eci-gx calc(.3s * var(--eci-t, 1)) cubic-bezier(.65,0,.35,1) calc(.05s * var(--eci-t, 1)) forwards}
.eci-divider{transform-origin:center bottom;transform:scaleY(0);animation:eci-gy calc(.3s * var(--eci-t, 1)) cubic-bezier(.65,0,.35,1) calc(.18s * var(--eci-t, 1)) forwards}
@keyframes eci-gx{to{transform:scaleX(1)}}
@keyframes eci-gy{to{transform:scaleY(1)}}

/* Emblema: barrido circular desde la esquina inferior izquierda */
.eci-emblem{clip-path:circle(0% at 0% 100%);animation:eci-sweep calc(.6s * var(--eci-t, 1)) cubic-bezier(.3,.7,.2,1) calc(.22s * var(--eci-t, 1)) forwards}
@keyframes eci-sweep{99%{clip-path:circle(180% at 0% 100%)}100%{clip-path:none}}

/* Nombre: cuatro líneas que salen desde detrás del divisor */
.eci-l1,.eci-l2,.eci-l3,.eci-l4{clip-path:inset(0 100% 0 0);animation:eci-wipe calc(.38s * var(--eci-t, 1)) cubic-bezier(.2,.8,.2,1) forwards}
.eci-l1 .eci-img,.eci-l2 .eci-img,.eci-l3 .eci-img,.eci-l4 .eci-img{
  transform:translateX(-18%);opacity:0;animation:eci-slide calc(.38s * var(--eci-t, 1)) cubic-bezier(.2,.8,.2,1) forwards}
.eci-l1,.eci-l1 .eci-img{animation-delay:calc(.40s * var(--eci-t, 1))}
.eci-l2,.eci-l2 .eci-img{animation-delay:calc(.46s * var(--eci-t, 1))}
.eci-l3,.eci-l3 .eci-img{animation-delay:calc(.52s * var(--eci-t, 1))}
.eci-l4,.eci-l4 .eci-img{animation-delay:calc(.58s * var(--eci-t, 1))}
@keyframes eci-wipe{to{clip-path:inset(0 0 0 0)}}
@keyframes eci-slide{to{transform:none;opacity:1}}

/* Línea larga + "Universidad" */
.eci-hr{transform:scaleX(0);animation:eci-gx calc(.38s * var(--eci-t, 1)) cubic-bezier(.65,0,.35,1) calc(.78s * var(--eci-t, 1)) forwards}
.eci-univ{opacity:0;animation:eci-fade calc(.42s * var(--eci-t, 1)) ease-out calc(.88s * var(--eci-t, 1)) forwards}
.eci-univ .eci-img{transform:scale(1.12);filter:blur(6px);animation:eci-focus calc(.48s * var(--eci-t, 1)) cubic-bezier(.2,.8,.2,1) calc(.88s * var(--eci-t, 1)) forwards}
@keyframes eci-fade{to{opacity:1}}
@keyframes eci-focus{to{transform:none;filter:none}}

/* Vigilada Mineducación */
.eci-vig{clip-path:inset(100% 0 0 0);animation:eci-up calc(.35s * var(--eci-t, 1)) cubic-bezier(.65,0,.35,1) calc(.98s * var(--eci-t, 1)) forwards}
@keyframes eci-up{to{clip-path:inset(0 0 0 0)}}

/* Destello de luz sobre las líneas del emblema (usa el propio PNG como máscara) */
.eci-glint{
  position:absolute;inset:0;overflow:hidden;pointer-events:none;
  -webkit-mask-image:var(--src);mask-image:var(--src);
  -webkit-mask-size:var(--size);mask-size:var(--size);
  -webkit-mask-position:var(--pos);mask-position:var(--pos);
  -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;
}
.eci-glint::after{
  content:"";position:absolute;inset:0;transform:translateX(-120%);
  background:linear-gradient(115deg,transparent 35%,var(--eci-glint-color) 50%,transparent 65%);
  mix-blend-mode:var(--eci-glint-blend);
  animation:eci-glint calc(.65s * var(--eci-t, 1)) ease-in-out calc(1.15s * var(--eci-t, 1)) forwards;
}
@keyframes eci-glint{0%{transform:translateX(-120%);opacity:1}90%{opacity:1}100%{transform:translateX(120%);opacity:0}}

@media (prefers-reduced-motion: reduce){
  .eci-logo *,.eci-logo *::after{animation-duration:.01s!important;animation-delay:0s!important}
}
`;
