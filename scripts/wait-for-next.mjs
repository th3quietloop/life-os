// Wait for Next.js dev server to be ready before launching Electron
const maxRetries = 30;
const delay = 1000;

async function waitForServer() {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch("http://localhost:3000");
      if (res.ok || res.status === 404) return;
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, delay));
  }
  console.error("Next.js dev server did not start in time");
  process.exit(1);
}

waitForServer();
