import { cn } from "@/src/libs/utils";
import { Button, Modal as HerouiModal } from "@heroui/react";
import Icon from "./Icon";

import { forwardRef, useImperativeHandle, useState } from "react";

export interface ModalRef {
	open: () => void;
	close: () => void;
	toggle: () => void;
}

interface Props {
	template?: {
		icon?: string;
		variant?: "danger" | "warning" | "success" | "info";
		showFooter?: boolean;
		primaryText?: string;
		secondaryText?: string;
		onClick?: () => void;
	};
	backdropVariant?: "blur" | "opaque" | "transparent";
	animate?: "Kinematic Scale" | "Fluid Slide";
	closeButton?: boolean;
	placement?: "auto" | "center" | "top" | "bottom";
	scroll?: "inside" | "outside";
	size?: "xs" | "sm" | "md" | "lg" | "full";
	classContainer?: string;
	title?: string;
	closeDisabled?: boolean;
	children?: React.ReactNode;
}

// Si se quiere manejar el estado desde el padre, se debe usar const modalRef = useRef<ModalRef>(null);
// y luego llamar a modalRef.current?.open() o modalRef.current?.close() y poner como prop del compontente ref={modalRef}

const Modal = forwardRef<ModalRef, Props>(
	(
		{
			animate = "Fluid Slide",
			closeDisabled,
			classContainer,
			backdropVariant = "opaque",
			closeButton = !closeDisabled,
			children,
			scroll = "outside",
			size = "md",
			placement = "center",
			title,
			template,
		}: Props,
		ref,
	) => {
		const [isOpen, setIsOpen] = useState(false);

		const animations = [
			{
				classNames: {
					backdrop: [
						"data-[entering]:duration-400",
						"data-[entering]:ease-[cubic-bezier(0.16,1,0.3,1)]",
						"data-[exiting]:duration-200",
						"data-[exiting]:ease-[cubic-bezier(0.7,0,0.84,0)]",
					].join(" "),
					container: [
						"data-[entering]:animate-in",
						"data-[entering]:fade-in-0",
						"data-[entering]:zoom-in-95",
						"data-[entering]:duration-400",
						"data-[entering]:ease-[cubic-bezier(0.16,1,0.3,1)]",
						"data-[exiting]:animate-out",
						"data-[exiting]:fade-out-0",
						"data-[exiting]:zoom-out-95",
						"data-[exiting]:duration-200",
						"data-[exiting]:ease-[cubic-bezier(0.7,0,0.84,0)]",
					].join(" "),
				},
				description:
					"Physics-based elastic scaling. Simulates a high-damping spring system with fast transient response and prolonged settling time. Ideal for Modals and Popovers.",
				icon: "gravity-ui:sparkles",
				name: "Kinematic Scale",
			},
			{
				classNames: {
					backdrop: [
						"data-[entering]:duration-500",
						"data-[entering]:ease-[cubic-bezier(0.25,1,0.5,1)]",
						"data-[exiting]:duration-200",
						"data-[exiting]:ease-[cubic-bezier(0.5,0,0.75,0)]",
					].join(" "),
					container: [
						"data-[entering]:animate-in",
						"data-[entering]:fade-in-0",
						"data-[entering]:slide-in-from-bottom-4",
						"data-[entering]:duration-500",
						"data-[entering]:ease-[cubic-bezier(0.25,1,0.5,1)]",
						"data-[exiting]:animate-out",
						"data-[exiting]:fade-out-0",
						"data-[exiting]:slide-out-to-bottom-2",
						"data-[exiting]:duration-200",
						"data-[exiting]:ease-[cubic-bezier(0.5,0,0.75,0)]",
					].join(" "),
				},
				description:
					"Simulates movement through a medium with fluid resistance. Eliminates mechanical linearity for a natural, grounded feel. Perfect for Bottom Sheets or Toasts.",
				icon: "gravity-ui:arrow-up-from-line",
				name: "Fluid Slide",
			},
		];

		const selectedAnimation = animations.find(
			(animation) => animation.name === animate,
		);

		useImperativeHandle(ref, () => ({
			open: () => setIsOpen(true),
			close: () => setIsOpen(false),
			toggle: () => setIsOpen((prev) => !prev),
		}));

		return (
			<>
				<HerouiModal isOpen={isOpen} onOpenChange={setIsOpen}>
					<HerouiModal.Backdrop
						variant={backdropVariant}
						isDismissable={!closeDisabled}
						isKeyboardDismissDisabled={closeDisabled}
						className={cn(selectedAnimation?.classNames?.backdrop)}
					>
						<HerouiModal.Container
							size={size}
							scroll={scroll}
							placement={placement}
							className={cn(selectedAnimation?.classNames?.container)}
						>
							<HerouiModal.Dialog className={cn(classContainer)}>
								{closeButton && <HerouiModal.CloseTrigger />}
								<HerouiModal.Header>
									{template && (
										<HerouiModal.Icon
											className={cn({
												"rounded-full": template?.variant === "warning",
												"text-warning bg-warning/20":
													template?.variant === "warning",
												"text-danger bg-danger/20":
													template?.variant === "danger",
												"text-success bg-success/20":
													template?.variant === "success",
												"text-gray bg-gray/20": template?.variant === "info",
											})}
										>
											<Icon
												icon={cn(template?.icon ?? undefined, {
													"info-circle": template?.variant === "info",
													"exclamation-lg": template?.variant === "warning",
													"exclamation-triangle":
														template?.variant === "danger",
													"check-circle": template?.variant === "success",
												})}
											/>
										</HerouiModal.Icon>
									)}
									{title && <HerouiModal.Heading>{title}</HerouiModal.Heading>}
								</HerouiModal.Header>
								<HerouiModal.Body>{children}</HerouiModal.Body>
								{template?.showFooter && (
									<HerouiModal.Footer>
										<Button slot="close" variant="ghost">
											{template.secondaryText}
										</Button>
										<Button
											slot="close"
											variant="primary"
											onPress={template.onClick}
											className={cn("text-default-white", {
												"bg-danger": template.variant == "danger",
												"bg-warning": template.variant == "warning",
												"bg-success": template.variant == "success",
												"bg-gray": template.variant == "info",
											})}
										>
											{template.primaryText}
										</Button>
									</HerouiModal.Footer>
								)}
							</HerouiModal.Dialog>
						</HerouiModal.Container>
					</HerouiModal.Backdrop>
				</HerouiModal>
			</>
		);
	},
);

export default Modal;
