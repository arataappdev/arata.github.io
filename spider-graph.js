// Get the canvas element
const canvas = document.getElementById('spider-graph-canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = 300;
canvas.height = 300;

// Function to draw the spider graph
function drawSpiderGraph(stats) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Transparent background
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) * 0.8;
  const numStats = stats.length;
  const angleStep = (2 * Math.PI) / numStats;
  const maxLevel = 10; // Max stat level for normalization
  const levels = 5; // Number of concentric grid levels

  // Draw concentric polygon grid
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  for (let l = 1; l <= levels; l++) {
    const r = (radius * l) / levels;
    ctx.beginPath();
    for (let i = 0; i < numStats; i++) {
      const angle = i * angleStep;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Draw radial lines
  ctx.strokeStyle = '#666';
  for (let i = 0; i < numStats; i++) {
    const angle = i * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  // Draw the stat polygon
  ctx.beginPath();
  for (let i = 0; i < numStats; i++) {
    const stat = stats[i];
    const level = Math.min(stat.level, maxLevel);
    const r = (radius * level) / maxLevel;
    const angle = i * angleStep;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(79, 195, 247, 0.3)';
  ctx.fill();
  ctx.strokeStyle = '#4facfe';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw stat points
  for (let i = 0; i < numStats; i++) {
    const stat = stats[i];
    const level = Math.min(stat.level, maxLevel);
    const r = (radius * level) / maxLevel;
    const angle = i * angleStep;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#4facfe';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw stat labels
  ctx.font = '12px Inter';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < numStats; i++) {
    const stat = stats[i];
    const angle = i * angleStep;
    const labelRadius = radius + 15;
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY + labelRadius * Math.sin(angle);
    ctx.fillText(stat.name, x, y);
  }
}


window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'updateSpiderGraph') {
    const stats = event.data.stats;
    drawSpiderGraph(stats);
  }
});

// Initial draw with empty stats
drawSpiderGraph([]);
