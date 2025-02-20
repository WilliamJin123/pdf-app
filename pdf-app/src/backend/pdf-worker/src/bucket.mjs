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
	return request.headers.get("X-Custom-Auth-Key") === env['AUTH-KEY-SECRET'];
};

function authorizeRequest(request, env, key) {
	switch (request.method) {
		case "PUT":
		case "DELETE":
			return hasValidHeader(request, env);
		case "GET":
			return true
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
				const fileBuffer = await request.arrayBuffer();
				await env.MY_BUCKET.put(key, fileBuffer, {
					httpMetadata: {
						contentType: "application/pdf",
					},

				})
				return new Response(`File ${key} uploaded successfully`, { status: 200 });
			} catch (err) {
				return new Response(`Upload error: ${err.message}`, { status: 500 });
			}
		}
		if (request.method === "GET") {
			try {
				const file = await env.MY_BUCKET.get(key)
				if(!file){
					new Response("File not found", { status: 404 });
				}
				return new Response(file.body, {
					status: 200,
					headers: {
						"Content-Type": file.httpMetadata.contentType || "application/octet-stream",
					},
				});
			} catch (err) {
				return new Response(`Fetch file error: ${err.message}`, { status: 500 });
			}
		} else {
			return new Response("Method Not Allowed", {
				status: 405,
				headers: {
					Allow: "PUT, GET, DELETE"
				},
			});
		}
	},
};
