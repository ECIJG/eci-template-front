import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware de plantilla — sin protección de rutas activa.
 *
 * NextAuth está configurado como infraestructura (providers, callbacks, etc.)
 * pero no fuerza autenticación en ninguna ruta por defecto.
 *
 * TODO: Para proteger rutas en un proyecto concreto, descomenta el bloque
 * de abajo y ajusta los paths que deben requerir sesión.
 */
export function middleware(request: NextRequest) {
	// const { pathname } = request.nextUrl;

	// Ejemplo: proteger solo rutas bajo /dashboard
	// const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
	// if (!token && pathname.startsWith("/dashboard")) {
	// 	return NextResponse.redirect(new URL("/login", request.url));
	// }

	return NextResponse.next();
}

export const config = {
	// Excluye archivos estáticos y rutas internas de Next.js
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
