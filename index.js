export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);

    if (url.pathname === "/api/adafruit") {
      const action = url.searchParams.get("action");
      const apiKey = env.API_KEY;
      const username = "Robert22G";
      const feedName = "messages";
      const baseUrl = `https://io.adafruit.com/api/v2/${username}/feeds/${feedName}/data`;

      if (!apiKey) {
        return new Response(JSON.stringify({ error: "Cloudflare API_KEY secret is missing." }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      try {
        if (request.method === "GET" && action === "get") {
          const response = await fetch(`${baseUrl}?limit=5`, {
            headers: { "X-AIO-Key": apiKey }
          });
          const data = await response.json();
          return new Response(JSON.stringify(data), { 
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
          });
        }

        if (request.method === "POST") {
          const body = await request.json();

          if (body.action === "send") {
            const response = await fetch(baseUrl, {
              method: "POST",
              headers: { "X-AIO-Key": apiKey, "Content-Type": "application/json" },
              body: JSON.stringify({ value: body.value })
            });
            const data = await response.json();
            return new Response(JSON.stringify(data), { 
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
            });
          }

          if (body.action === "delete") {
            await fetch(`${baseUrl}/${body.id}`, {
              method: "DELETE",
              headers: { "X-AIO-Key": apiKey }
            });
            return new Response(JSON.stringify({ success: true }), { 
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
            });
          }
        }

        return new Response("Method Not Allowed", { status: 405 });
	} catch (err) { 
  		return new Response(JSON.stringify({ 
    		CRASH_DETECTED: true,
	    	message: err.message, 
    		stack: err.stack 
  	}), { 
	    status: 200, 
	    headers: { 
	      "Content-Type": "application/json", 
	      "Access-Control-Allow-Origin": "*" 
	    } 
	  }); 
	}

    }

    return env.assets.fetch(request);
  }
};

