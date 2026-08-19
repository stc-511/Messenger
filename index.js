export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    const apiKey = env.API_KEY;
    const username = "Robert22G";
    const feedName = "messages";
    const baseUrl = `https://io.adafruit.com/api/v2/${username}/feeds/${feedName}/data`;

    const corsHeaders = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API_KEY secret is missing." }), { status: 500, headers: corsHeaders });
    }

    if (request.method === "GET" && (url.pathname === "/api/get" || url.pathname === "/api/adafruit")) {
      try {
        const response = await fetch(`${baseUrl}?limit=10`, { headers: { "X-AIO-Key": apiKey } });
        const data = await response.json();
        const valuesArray = Array.isArray(data) ? data.map(item => item.value) : [];
        return new Response(JSON.stringify(valuesArray), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Failed fetching chat logs." }), { status: 500, headers: corsHeaders });
      }
    }

    if (request.method === "POST" && (url.pathname === "/api/send" || url.pathname === "/api/adafruit")) {
      try {
        const body = await request.json();
        const response = await fetch(baseUrl, {
          method: "POST",
          headers: { "X-AIO-Key": apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({ value: body.value })
        });
        const data = await response.json();
        return new Response(JSON.stringify(data), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Failed sending chat payload." }), { status: 500, headers: corsHeaders });
      }
    }

    return env.assets.fetch(request);
  }
};

