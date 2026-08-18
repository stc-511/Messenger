export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);

    if (url.pathname === "/api/adafruit") {
      const action = url.searchParams.get("action");
      const apiKey = env.API_KEY;
      const username = "Robert22G";
      const feedName = "messages";
      const baseUrl = `https://adafruit.com{username}/feeds/${feedName}/data`;

      if (!apiKey) {
        return new Response(JSON.stringify({ error: "Cloudflare API_KEY secret is completely missing or empty." }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      try {
        if (request.method === "GET" && action === "get") {
          const response = await fetch(`${baseUrl}?limit=5`, {
            headers: { "X-AIO-Key": apiKey }
          });
          
          if (!response.ok) {
            const errText = await response.text();
            return new Response(JSON.stringify({ error: "Adafruit connection rejected request", details: errText }), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            });
          }

          const data = await response.json();
          return new Response(JSON.stringify(data), { 
            headers: { "Content-Type": "application/json" } 
          });
        }

        if (request.method === "POST") {
          const body = await request.json();

          if (body.action === "send") {
            const response = await fetch(baseUrl, {
              method: "POST",
              headers: { 
                "X-AIO-Key": apiKey, 
                "Content-Type": "application/json" 
              },
              body: JSON.stringify({ value: body.value })
            });
            const data = await response.json();
            return new Response(JSON.stringify(data), { 
              headers: { "Content-Type": "application/json" } 
            });
          }

          if (body.action === "delete") {
            await fetch(`${baseUrl}/${body.id}`, {
              method: "DELETE",
              headers: { "X-AIO-Key": apiKey }
            });
            return new Response(JSON.stringify({ success: true }), { 
              headers: { "Content-Type": "application/json" } 
            });
          }
        }

        return new Response(JSON.stringify({ error: "Method or action assignment not allowed" }), { 
          status: 405, 
          headers: { "Content-Type": "application/json" } 
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: err.message, trace: err.stack }), { 
          status: 200, 
          headers: { "Content-Type": "application/json" } 
        });
      }
    }

    return env.assets.fetch(request);
  }
};

