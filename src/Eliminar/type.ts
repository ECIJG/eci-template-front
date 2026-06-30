export interface containerType {
	title: string;
	description: string;
	principal?: boolean;
	sections: sectionType[];
	param?: string;
}

export interface itemType {
	title: string;
	description: string;
}

export interface sectionType {
	title: string | null;
	items: itemType[];
}
