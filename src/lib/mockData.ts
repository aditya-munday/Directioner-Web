export const mockUser = { 
  id: "u_123", 
  username: "aditya", 
  email: "aditya@directioner.bot", 
  tier: "pro" as const, 
  createdAt: "2023-01-15T00:00:00Z" 
};

export const mockBots = [
  { id: "b_1", serverId: "s_1", serverName: "Gaming Hub", memberCount: 342, channelCount: 12, status: "online", tier: "pro" },
  { id: "b_2", serverId: "s_2", serverName: "Study Server", memberCount: 128, channelCount: 5, status: "online", tier: "pro" },
  { id: "b_3", serverId: "s_3", serverName: "Dev Community", memberCount: 891, channelCount: 24, status: "offline", tier: "pro" }
];

export function generateAnalyticsData(range: '7d'|'30d'|'90d') {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const data = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toISOString().split('T')[0],
      textMessages: Math.floor(Math.random() * 500) + 100,
      voiceMinutes: Math.floor(Math.random() * 200) + 20,
      credits: Math.floor(Math.random() * 1000) + 200,
    });
  }
  return data;
}

export function generateHeatmapData() {
  const data: number[][] = [];
  for (let i = 0; i < 7; i++) {
    const row = [];
    for (let j = 0; j < 24; j++) {
      // simulate higher activity in evenings
      let base = Math.random();
      if (j > 16 && j < 22) base += 0.5;
      row.push(Math.min(1, base));
    }
    data.push(row);
  }
  return data;
}

export function generateModeBreakdown() {
  return [
    { name: "chat", count: 4500, pct: 45, color: "var(--color-primary)" },
    { name: "tutor", count: 2500, pct: 25, color: "var(--color-accent)" },
    { name: "coder", count: 1500, pct: 15, color: "#3B82F6" },
    { name: "chaos", count: 1000, pct: 10, color: "var(--color-destructive)" },
    { name: "other", count: 500, pct: 5, color: "var(--color-muted-foreground)" }
  ];
}

export const mockBillingHistory = [
  { id: "inv_1", date: "2025-08-01", amount: 14.99, status: "paid", description: "Pro Subscription - September" },
  { id: "inv_2", date: "2025-07-01", amount: 14.99, status: "paid", description: "Pro Subscription - August" },
  { id: "inv_3", date: "2025-06-01", amount: 14.99, status: "paid", description: "Pro Subscription - July" },
  { id: "inv_4", date: "2025-05-15", amount: 4.99, status: "paid", description: "Credit Top-Up (5,000)" },
  { id: "inv_5", date: "2025-05-01", amount: 14.99, status: "paid", description: "Pro Subscription - June" },
  { id: "inv_6", date: "2025-04-01", amount: 14.99, status: "paid", description: "Pro Subscription - May" },
  { id: "inv_7", date: "2025-03-01", amount: 14.99, status: "failed", description: "Pro Subscription - April (Retry)" },
  { id: "inv_8", date: "2025-02-01", amount: 14.99, status: "paid", description: "Pro Subscription - March" }
];

export const mockLogs = Array.from({length: 25}).map((_, i) => ({
  id: `log_${i}`,
  timestamp: new Date(Date.now() - Math.floor(Math.random() * 36000000)).toISOString(),
  eventType: ["Message Sent", "Voice Joined", "Command Executed", "Setting Changed", "Memory Stored"][Math.floor(Math.random() * 5)],
  channel: ["#general", "#voice", "#bot-commands", "DM", "#study-group"][Math.floor(Math.random() * 5)],
  user: `user_${Math.floor(Math.random() * 1000)}`,
  details: "System logged interaction event."
}));

export const mockActivityFeed = [
  { id: 1, type: "system", title: "Bot Updated", desc: "Directioner core engine updated to v1.0.4", time: "10 mins ago" },
  { id: 2, type: "server", title: "New Server Joined", desc: "Added to 'Minecraft Elite'", time: "2 hours ago" },
  { id: 3, type: "billing", title: "Subscription Renewed", desc: "Pro plan renewed for $14.99", time: "1 day ago" },
  { id: 4, type: "alert", title: "High Latency Warning", desc: "Voice node #4 experienced latency > 200ms", time: "1 day ago" },
  { id: 5, type: "memory", title: "Memory Threshold", desc: "Gaming Hub reached 80% memory capacity", time: "2 days ago" },
  { id: 6, type: "user", title: "Permission Changed", desc: "Admin enabled /chaos mode on Study Server", time: "3 days ago" },
  { id: 7, type: "system", title: "Scheduled Maintenance", desc: "Completed successfully with 0 downtime", time: "1 week ago" },
  { id: 8, type: "server", title: "Custom Preset Saved", desc: "New personality 'Debater' saved", time: "1 week ago" },
];

export const mockMemories = [
  { id: "mem_1", content: "Server owner's real name is Alex", source: "User @admin", date: "2023-10-12", scope: "global" },
  { id: "mem_2", content: "Default timezone is EST", source: "Manual /remember", date: "2023-10-15", scope: "server" },
  { id: "mem_3", content: "No anime discussions in #general", source: "Channel rule inference", date: "2023-11-02", scope: "server" },
  { id: "mem_4", content: "Prefers Python for coding examples", source: "User @dev_guy", date: "2023-12-05", scope: "user" },
  { id: "mem_5", content: "Raid night is Friday 8PM", source: "Event extraction", date: "2024-01-10", scope: "global" },
];

export const mockChannels = [
  { id: "c_1", name: "general", type: "text", enabled: true, mode: "chat" },
  { id: "c_2", name: "bot-commands", type: "text", enabled: true, mode: "chat" },
  { id: "c_3", name: "study-room", type: "text", enabled: true, mode: "tutor" },
  { id: "c_4", name: "dev-talk", type: "text", enabled: true, mode: "coder" },
  { id: "c_5", name: "announcements", type: "text", enabled: false, mode: "chat" },
  { id: "c_6", name: "Lounge", type: "voice", enabled: true, mode: "chat" },
  { id: "c_7", name: "Gaming 1", type: "voice", enabled: false, mode: "chat" },
];
