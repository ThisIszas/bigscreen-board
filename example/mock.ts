/** 示例数据源: 随机 60-95 */
export async function genData(): Promise<number> {
  await new Promise((r) => setTimeout(r, 200));
  return Math.round(60 + Math.random() * 35);
}
