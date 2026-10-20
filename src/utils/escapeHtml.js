const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

module.exports = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => map[ch]);
