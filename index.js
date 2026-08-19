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
      return new Response(JSON.stringify({ error: "API_KEY variable is empty inside environmental memory." }), { status: 500, headers: corsHeaders });
    }

    if (url.pathname.includes("/api/adafruit")) {
      
      if (request.method === "GET") {
        try {
          const response = await fetch(`${baseUrl}?limit=10`, { headers: { "X-AIO-Key": apiKey } });
          
          if (!response.ok) {
            const errDetails = await response.text();
            return new Response(JSON.stringify({ error: "Adafruit API Refused Request", status: response.status, details: errDetails }), { status: 500, headers: corsHeaders });
          }

          const data = await response.json();
          const valuesArray = Array.isArray(data) ? data.map(item => item.value) : [];
          return new Response(JSON.stringify(valuesArray), { headers: corsHeaders });
        } catch (err) {
          return new Response(JSON.stringify({ error: "Worker Parse Defect", internalMessage: err.message }), { status: 500, headers: corsHeaders });
        }
      }

      if (request.method === "POST") {
        try {
          const body = await request.json();
          const response = await fetch(baseUrl, {
            method: "POST",
            headers: { "X-AIO-Key": apiKey, "Content-Type": "application/json" },
            body: JSON.stringify({ value: body.value })
          });

          if (!response.ok) {
            const errDetails = await response.text();
            return new Response(JSON.stringify({ error: "Adafruit Discarded Inbound Msg", status: response.status, details: errDetails }), { status: 500, headers: corsHeaders });
          }

          const data = await response.json();
          return new Response(JSON.stringify(data), { headers: corsHeaders });
        } catch (err) {
          return new Response(JSON.stringify({ error: "Worker Processing Defect", internalMessage: err.message }), { status: 500, headers: corsHeaders });
        }
      }
    }

    return new Response(JSON.stringify({ error: "Endpoint Not Found" }), { status: 404, headers: corsHeaders });
  }
};

