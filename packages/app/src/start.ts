import { createMiddleware, createStart } from "@tanstack/react-start";

const requestLogger = createMiddleware().server(async ({ next, request }) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${request.method} ${request.url} - Starting`);
  console.log("Headers:", Object.fromEntries(request.headers.entries()));

  try {
    const result = await next();
    const duration = Date.now() - startTime;

    console.log(
      `[${timestamp}] ${request.method} ${request.url} - ${result.response.status} (${duration}ms)`,
    );

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[${timestamp}] ${request.method} ${request.url} - Error (${duration}ms):`,
      error,
    );
    throw error;
  }
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [requestLogger],
  };
});
