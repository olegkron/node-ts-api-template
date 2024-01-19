// cmcTokensService()
export async function measured (fn, label) {
  // console.log(`Starting ${label}`)
  const t0 = performance.now()
  await fn()
  const t1 = performance.now()
  console.log(`${label} took ${t1 - t0} ms`)
}
