export function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  const diff = Math.floor((Date.now() - date) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  return `${Math.floor(diff/86400)}d ago`
}

export function workDuration(joinedDate) {
  if (!joinedDate) return '—'
  const join = new Date(joinedDate)
  const now = new Date()
  const years = now.getFullYear() - join.getFullYear()
  const months = now.getMonth() - join.getMonth() + (years * 12)
  return months >= 12
    ? `${Math.floor(months / 12)} years ${months % 12} months`
    : `${months} months`
}


