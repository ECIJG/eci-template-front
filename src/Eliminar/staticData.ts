import { containerType } from "./type";

export const randomColors = [
	"border-primary/30",
	"border-purple-500/30",
	"border-emerald-500/30",
	"border-amber-500/30",
	"border-rose-500/30",
	"border-orange-500/30",
];

export const containers: containerType[] = [
	{
		title: "Componentes",
		description:
			"UI reutilizable y componentes de formulario con validación integrada",
		param: "components",
		principal: true,
		icon: "box-seam",
		badge: "UI & Form",
		color: "primary",
		sections: [
			{
				title: "Elementos de UI",
				items: [
					{
						title: "Modal.tsx",
						description:
							"Modal imperativo con ref (open/close/toggle), animaciones y variantes (danger, success, etc.)",
						path: "src/components/ui/Modal.tsx",
					},
					{
						title: "Icon.tsx",
						description:
							"Wrapper simplificado para Bootstrap Icons con soporte de tamaños y clases",
						path: "src/components/ui/Icon.tsx",
					},
					{
						title: "AnimateText.tsx",
						description:
							"Texto animado con Framer Motion con segmentación por letras o palabras, efectos slide/fade y descripción secundaria",
						path: "src/components/ui/AnimateText.tsx",
					},
					{
						title: "SimpleLoading.tsx",
						description: "Indicador animado de carga con spinner y rebotes",
						path: "src/components/ui/SimpleLoading.tsx",
					},
					{
						title: "SwitchTheme.tsx",
						description:
							"Toggle flotante para alternar entre modo Claro y Oscuro con animaciones",
						path: "src/components/ui/SwitchTheme.tsx",
					},
					{
						title: "ImageLogo.tsx & ImageCutLogo.tsx",
						description:
							"Logos institucionales ECIJG adaptativos a resolución y temas",
						path: "src/components/ui/ImageLogo.tsx",
					},
				],
			},
			{
				title: "Formularios",
				items: [
					{
						title: "InputForm.tsx",
						description:
							"Input tipado para textos, números, correos, passwords y fechas ligado a useForm",
						path: "src/components/form/InputForm.tsx",
					},
					{
						title: "SelectForm.tsx",
						description:
							"Autocomplete con buscador interactivo, íconos y descripciones por opción",
						path: "src/components/form/SelectForm.tsx",
					},
					{
						title: "ComboBoxForm.tsx",
						description:
							"Selector híbrido: escoge de una lista predeterminada o escribe un valor libre",
						path: "src/components/form/ComboBoxForm.tsx",
					},
					{
						title: "TextareaForm.tsx",
						description:
							"Campo multilínea con control de filas, descripciones y validación automática",
						path: "src/components/form/TextareaForm.tsx",
					},
				],
			},
		],
	},
	{
		title: "Hooks Personalizados",
		description:
			"Lógica reactiva para formularios, ciclo de vida, URLs y archivos",
		param: "hooks",
		icon: "lightning-charge-fill",
		badge: "Custom Hooks",
		color: "purple",
		sections: [
			{
				title: "Manejo de Formularios",
				items: [
					{
						title: "useForm.ts",
						description:
							"Hook moderno para formularios tipados con esquema de validación (required, minLength, email, number)",
						path: "src/hooks/useForm.ts",
					},
					{
						title: "useValidateForm.ts",
						description:
							"Sistema de validaciones estructuradas con reglas avanzadas y precarga de datos",
						path: "src/hooks/useValidateForm.ts",
					},
					{
						title: "UseFormData.ts",
						description:
							"Gestión de FormData para subida de múltiples archivos con validación de cantidad",
						path: "src/hooks/UseFormData.ts",
					},
				],
			},
			{
				title: "Ciclo de Vida y Navegación",
				items: [
					{
						title: "UseMounted.ts",
						description:
							"Detecta si el componente ya está montado en cliente para evitar hydration mismatch en SSR",
						path: "src/hooks/UseMounted.ts",
					},
					{
						title: "useQueryParams.ts",
						description:
							"Extracción tipada y filtrado de parámetros searchParams en la URL",
						path: "src/hooks/useQueryParams.ts",
					},
				],
			},
		],
	},
	{
		title: "Librerías y Utilidades",
		description:
			"Clientes HTTP, manipulación de strings, formateo y utilidades generales",
		param: "libs",
		icon: "tools",
		badge: "Utilities",
		color: "emerald",
		sections: [
			{
				title: "Peticiones HTTP",
				items: [
					{
						title: "fetchFn.ts",
						description:
							"Cliente HTTP para APIs JSON con auto-prefijo NEXT_PUBLIC_API_URL, Bearer tokens y errores normalizados",
						path: "src/libs/fetchFn.ts",
					},
					{
						title: "fetchFileFn.ts",
						description:
							"Cliente optimizado para subir archivos multipart/form-data hacia el backend",
						path: "src/libs/fetchFileFn.ts",
					},
				],
			},
			{
				title: "Formatos y Validaciones",
				items: [
					{
						title: "utils.ts",
						description:
							"Función cn (clsx + tailwind-merge) y validadores de correos, números y cadenas",
						path: "src/libs/utils.ts",
					},
					{
						title: "functionsStrings.ts",
						description:
							"Formateo de fechas, horas, moneda colombiana, niveles de contraseña y enmascaramiento de correos",
						path: "src/libs/functionsStrings.ts",
					},
					{
						title: "staticData.ts",
						description:
							"Datos estáticos y menús institucionales configurables",
						path: "src/libs/staticData.ts",
					},
				],
			},
		],
	},
	{
		title: "Redux Toolkit",
		description: "Gestión de estado global centralizado y predecible",
		param: "redux",
		icon: "arrow-repeat",
		badge: "State Management",
		color: "amber",
		sections: [
			{
				title: "Arquitectura Redux",
				items: [
					{
						title: "store.ts",
						description:
							"Configuración central del store con soporte para DevTools y listeners RTK",
						path: "src/redux/store.ts",
					},
					{
						title: "hooks.ts",
						description:
							"Hooks tipados useAppSelector y useAppDispatch con tipado fuerte de RootState y AppDispatch",
						path: "src/redux/hooks.ts",
					},
					{
						title: "slices/generalSlice.ts",
						description:
							"Ejemplo de slice modular con estado inicial, acciones síncronas y reducers",
						path: "src/redux/slices/generalSlice.ts",
					},
				],
			},
		],
	},
	{
		title: "Configuración y Autenticación",
		description: "NextAuth v4, variables de entorno, middleware y Providers",
		param: "config",
		icon: "gear-fill",
		badge: "Auth & Env",
		color: "rose",
		sections: [
			{
				title: "Seguridad y Sesión",
				items: [
					{
						title: "auth.ts (NextAuth)",
						description:
							"Infraestructura con proveedores Azure AD y Credentials con estrategia JWT de 1 hora",
						path: "app/api/auth/[...nextauth]/auth.ts",
					},
					{
						title: "middleware.ts",
						description:
							"Middleware perimetral para proteger rutas y excluir recursos estáticos",
						path: "middleware.ts",
					},
				],
			},
			{
				title: "Entorno y Providers",
				items: [
					{
						title: "providers.tsx",
						description:
							"Encapsula Redux Provider, HeroUI Provider y NextThemes Provider para toda la app",
						path: "app/providers.tsx",
					},
					{
						title: ".env.example",
						description:
							"Variables de entorno para URLs de backend, secretos de sesión y puertos",
						path: ".env.example",
					},
				],
			},
		],
	},
	{
		title: "Docker y Despliegue",
		description:
			"Contenedores multi-stage optimizados para producción y desarrollo con hot-reload",
		// principal: true,
		param: "docker",
		icon: "boxes",
		badge: "DevOps",
		color: "orange",
		sections: [
			{
				title: "Imagen Multi-Stage para Producción",
				items: [
					{
						title: "Dockerfile",
						description:
							"Construcción en 4 etapas: base (node:20-alpine) -> deps -> builder -> runner mínimo para producción",
						path: "Dockerfile",
					},
					{
						title: "docker-compose.yml",
						description:
							"Levanta el contenedor productivo con reinicio unless-stopped, zona horaria Bogotá y variables .env",
						path: "docker-compose.yml",
					},
				],
			},
			{
				title: "Contenedor de Desarrollo",
				items: [
					{
						title: "Dockerfile.dev & docker-compose.dev.yml",
						description:
							"Entorno con volumen montado para hot reload en tiempo real y sondeo de archivos chokidar",
						path: "docker-compose.dev.yml",
					},
				],
			},
		],
	},
];
