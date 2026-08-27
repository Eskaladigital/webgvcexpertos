/** Posts with a future published_at stay hidden until that instant. */
export function publishedAtVisibleNow() {
  return new Date().toISOString()
}
