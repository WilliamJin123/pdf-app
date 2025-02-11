/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const hasValidHeader = (request, env) => {
	return request.headers.get("X-Custom-Auth-Key") === env.AUTH_KEY_SECRET;
};

function authorizeRequest(request, env, key) {
	switch (request.method) {
		case "PUT":
		case "DELETE":
			return hasValidHeader(request, env);
		case "GET":
			return ALLOW_LIST.includes(key);
		default:
			return false;
	}
}

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const key = url.pathname.slice(1);

		if (!authorizeRequest(request, env, key)) {
			return new Response("Forbidden", { status: 403 });
		}
		if (request.method === "PUT") {
			try {
				const fileBuffer = await request.ArrayBuffer();
				await env.MY_BUCKET.put(key, fileBuffer, {
					httpMetadata: { contentType: "application/pdf" },
				})
				return new Response(`File ${key} uploaded successfully`, { status: 200 });
			} catch (err) {
				return new Response(`Upload error: ${error.message}`, { status: 500 });
			}
		}
	},
};
