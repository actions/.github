export default {
  async fetch(request, env, ctx) {
    return new Response("Hello from Cloudflare Worker shy-base-82d5!");
  },
};
