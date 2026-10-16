"use client";

import Main from "@/src/Eliminar/Main";

export default function Home() {
	return (
		<>
			{/*
		TODO
		- Buscar CONTAINER_NAME en el proyecto y reemplazarlo para los despliegues
		- Buscar todos los TODO: y revisar si hay algún paso adicional
		- Eliminar todo de la carpeta Eliminar en src
		- NextAuth ya está configurado como infraestructura. Para proteger rutas:
		    1. Descomenta el bloque `pages` en app/api/auth/[...nextauth]/auth.ts
		    2. Crea app/login/page.tsx y app/logout/page.tsx
		    3. Activa la protección de rutas en middleware.ts
		*/}
			<Main />
		</>
	);
}
