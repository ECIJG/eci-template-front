import { title } from "process";
import { containerType } from "./type";

export const randomColors = [
  "border-blue-500",
  "border-green-500",
  "border-yellow-500",
  "border-red-500",
  "border-purple-500",
  "border-pink-500",
  "border-indigo-500",
  "border-orange-500",
  "border-teal-500",
  "border-cyan-500",
];


export const containers: containerType[] = [
{
	title: "Componentes",
	description: "UI y Formularios",
	param: "components",
	sections: [
		{
			title: "UI",
			items: [
		{
			title: "Icon.tsx",
			description: "Componente de iconos reutilizables"
		},
		{
			title: "Modal.tsx",
			description: "Modal con soporte para contenido dinámico"
		},
		{
			title: "SimpleLoading.tsx",
			description: "Indicador de carga simple"
		},
		{
			title: "SwitchTheme.tsx",
			description: "Toggle para tema claro/oscuro"
		},
		{
			title: "ImageLogo.tsx",
			description: "Logo de la aplicación"
		},
		{
			title: "ImageCutLogo.tsx",
			description: "Logo recortado"
		}
	]
},
{
	title: "Form",
	items: [
		{
			title: "InputForm.tsx",
			description: "Input de formulario con validación"
		}
	]
}
]
},
{
	title: "Hooks",
	description: "Custom Hooks",
	sections: [
		{
			title: null,
			items: [
		{
			title: "UseFormData.ts",
			description: "Manejo de datos de formularios"
		},
		{
			title: "UseMounted.ts",
			description: "Detecta si el componente está montado"
		},
		{
			title: "useForm.ts",
			description: "Hook personalizado para formularios"
		},
		{
			title: "useQueryParams.ts",
			description: "Manejo de parámetros URL"
		},
		{
			title: "useValidateForm.ts",
			description: "Validación de formularios"
		}
	]
}
]
},
{
	title: "Librerías",
	description: "Utilidades",
	sections	: [
		{
			title: null,
			items: [
		{
			title: "fetchFn.ts",
			description: "Cliente HTTP para peticiones API"
		},
		{
			title: "fetchFileFn.ts",
			description: "Descarga de archivos"
		},
		{
			title: "functionsStrings.ts",
			description: "Funciones de manipulación de strings"
		},
		{
			title: "utils.ts",
			description: "Utilidades generales"
		},
		{
			title: "staticData.ts",
			description: "Datos estáticos de la app"
		}
	]
	}
	]
},
{
	title: "Redux",
	description: "State Management",
	sections: [
		{
			title: null,
			items: [
				{
					title: "store.ts",
					description: "Configuración principal de Redux"
				},
				{
					title: "hooks.ts",
					description: "Hooks tipados de Redux"
				},
				{
					title: "slices/generalSlice.ts",
					description: "Slice de estado general"
				}
			]
		}
	]
},
{
	title: "Docker",
	description: "Contenedores y Despliegue",
	principal: true,
	sections: [
		{
			title: "Imagen multi-stage para producción",
			items: [
				{
					title: "Base",
					description: "Node.js 20 Alpine"
				},
				{
					title: "Stage deps",
					description: "Instala dependencias"
				},
				{
					title: "Stage builder",
					description: "Compila la app"
				},
				{
					title: "Stage runner",
					description: "Ejecuta en producción"
				}
			]
		},
		{
			title: "Orquestación para producción",
			items: [
				{
					title: "Puerto configurable",
					description: "via .env"
				},
				{
					title: "Zona horaria",
					description: "America/Bogota"
				},
				{
					title: "Reinicio automático",
					description: "Se reinicia si falla (falso)"
				}
			]
		},
		{
			title: "Configuración para desarrollo",
			items: [
				{
					title: "Hot reload habilitado",
					description: "Recarga automática al cambiar código"
				},
				{
					title: "Volumenes para código en vivo",
					description: "Monta el código local en el contenedor"
				}
			]
		}
	]
}
];
