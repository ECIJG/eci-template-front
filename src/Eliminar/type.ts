export type CategoryParam =
	| "components"
	| "hooks"
	| "libs"
	| "redux"
	| "config"
	| "docker";

export interface itemType {
	title: string;
	description: string;
	badge?: string;
	path?: string;
}

export interface sectionType {
	title: string | null;
	items: itemType[];
}

export interface containerType {
	title: string;
	description: string;
	principal?: boolean;
	sections: sectionType[];
	param?: CategoryParam;
	icon?: string;
	badge?: string;
	color?: string;
}
