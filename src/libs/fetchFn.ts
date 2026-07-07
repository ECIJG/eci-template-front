type Method = "GET" | "POST" | "PUT" | "DELETE";

interface Options {
	externalUrl?: boolean;
	method?: Method;
	token?: string;
	cache?: RequestCache;
	body?: Object;
}

async function fetchFn(endpoint: string, options?: Options) {
	try {
		const { externalUrl, cache, method, body, token } = options ?? {};
		const res = await fetch(
			externalUrl ? endpoint : process.env.NEXT_PUBLIC_API_URL + endpoint,
			{
				method: method ?? "GET",
				headers: {
					"Content-Type": "application/json",
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
				cache: cache ?? "default",
				body: body && JSON.stringify(body),
			},
		);

		// Check if response is JSON before parsing
		const contentType = res.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
			const text = await res.text();
			console.error("Non-JSON response:", text);
			return {
				code: res.status,
				error: true,
				data: { message: "Invalid response format from server" },
			};
		}

		const response = await res.json();

		return {
			code: res.status,
			data: response,
		};
	} catch (e) {
		console.error("Fetch error:", e);
		return {
			code: 999,
			error: true,
			e,
		};
	}
}

export default fetchFn;
