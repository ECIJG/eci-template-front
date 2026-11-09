const OsirisSignature = () => {
	return (
		<div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-1 py-3">
			<div className="flex items-center justify-center gap-2">
				<span className="text-[11px] text-foreground-muted">
					Dirección de Tecnología
				</span>

				<span className="h-3 w-px bg-foreground-muted/40" />

				<span className="text-[11px] font-semibold tracking-wide text-foreground/80">
					OSIRIS
				</span>
			</div>

			<p className="text-center text-[10px] tracking-wide text-foreground-muted/70">
				Escuela Colombiana de Ingeniería Julio Garavito
			</p>
		</div>
	);
};

export default OsirisSignature;
