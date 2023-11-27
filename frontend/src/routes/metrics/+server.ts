import { register, collectDefaultMetrics } from 'prom-client';

// Collect default metrics like CPU and memory usage
collectDefaultMetrics();

export async function GET() {
  try {
    const metrics = register.metrics();

    const options: ResponseInit = {
        status: 200,
        headers: {
            'Content-Type': register.contentType,
        },
    }

    return new Response(await metrics, options);
  } catch (error) {
    console.error(error);
  }
}
