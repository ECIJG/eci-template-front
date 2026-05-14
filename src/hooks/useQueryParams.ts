"use client";

import { useSearchParams } from "next/navigation";

export default function useQueryParams<TParams>(
	specifiedKeys?: (keyof TParams)[]
): TParams {
	const searchParams = useSearchParams();

	const params: Record<string, string> = {};

	searchParams.forEach((value, key) => {
		if (specifiedKeys && !specifiedKeys.includes(key as keyof TParams)) {
			return;
		}

		params[key] = value;
	});

	return params as TParams;
}
