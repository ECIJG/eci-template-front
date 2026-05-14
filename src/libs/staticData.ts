export interface optionCard {
  id: number;
  text: string;
  icon: string;
  route?: string;
  routeExternal?: string;
}

export const optionsCards: optionCard[] = [
  {
    id: 1,
    text: "Enlace académico",
    icon: "mortarboard",
    routeExternal: process.env.NEXT_PUBLIC_ENLACE
  },
  {
    id: 2,
    text: "Gestión de cursos",
    icon: "journal-check",
    routeExternal: process.env.NEXT_PUBLIC_GESTION_CURSOS
  },
  {
    id: 3,
    text: "Gestione su contraseña de correo",
    icon: "envelope-check",
    routeExternal: "https://gestorpasswd.escuelaing.edu.co/dashboard/profile"
  },
  {
    id: 4,
    text: "ProgresoEstudios",
    icon: "journal-text",
    routeExternal: process.env.NEXT_PUBLIC_PROGRESO
  },
  // {
  //   id: 5,
  //   text: "Votaciones",
  //   icon: "box-seam",
  // }
];