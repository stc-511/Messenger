export default async (request, context) => {
  return new Response(JSON.stringify({ 
    API_KEY: process.env.API_KEY 
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

