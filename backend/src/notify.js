const clients = new Map();
export function publish(userId, data) { for (const res of clients.get(userId) ?? []) res.write(`data: ${JSON.stringify(data)}\n\n`); }
export function openStream(req,res) {
  res.set({ 'Content-Type':'text/event-stream', 'Cache-Control':'no-cache, no-transform', Connection:'keep-alive', 'X-Accel-Buffering':'no' }); res.flushHeaders(); res.write(': connected\n\n');
  const set=clients.get(req.user.id) ?? new Set(); set.add(res); clients.set(req.user.id,set);
  const timer=setInterval(()=>res.write(': heartbeat\n\n'),25000);
  req.on('close',()=>{ clearInterval(timer); set.delete(res); if(!set.size) clients.delete(req.user.id); });
}
