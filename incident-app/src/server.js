'use strict';

const { createApp } = require('./app');
const { createStore } = require('./store');

const DEFAULT_PORT = 3000;

function resolvePort(raw) {
  if (raw === undefined || raw === '') return DEFAULT_PORT;
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`PORT ไม่ถูกต้อง: "${raw}"`);
  }
  return port;
}

function main() {
  const port = resolvePort(process.env.PORT);
  const app = createApp({ store: createStore() });
  const server = app.listen(port, () => {
    console.log(`IT Incident Tracker รันที่ http://localhost:${server.address().port}`);
  });
  server.on('error', (err) => {
    console.error('เริ่มเซิร์ฟเวอร์ไม่สำเร็จ:', err.message);
    process.exit(1);
  });
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = { resolvePort };
