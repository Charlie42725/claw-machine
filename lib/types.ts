/**
 * 核心参数类型定义
 */
export interface GameParameters {
  // 剩余中奖刮卡数
  R0: number;
  // 剩余未中刮卡数
  B0: number;
  // 中一次奖金
  payout_per_win: number;
  // 每次夹的成本
  cost_per_grab: number;
  // 未中奖安慰奖（默认0）
  q?: number;
  // 一次夹拿几张刮卡（默认1）
  scratch_per_grab?: number;
  // 平均要夹几次才拿到一张刮卡（默认1）
  grabs_per_scratch?: number;
}

/**
 * 求解结果
 */
export interface SolverResult {
  // 起手状态的最优期望净利
  V_start: number;
  // 起手是否应该继续
  policy_start: boolean;
  // 有效每刮成本
  effective_cost_per_scratch: number;
  // 平均每中一次的成本（若可计算）
  avg_cost_per_win: number | null;
  // 期望中奖次数
  expected_wins: number;
  // 期望总成本
  expected_total_cost: number;
  // 策略矩阵 [R][B] -> true=继续, false=停手
  policy_matrix: boolean[][];
  // 价值矩阵 [R][B] -> V(R,B)
  V_matrix: number[][];
  // Continue值矩阵 [R][B] -> Continue(R,B)
  Continue_matrix: number[][];
}

/**
 * 内部计算状态
 */
export interface DPState {
  V: number[][];
  C: number[][];
  W: number[][];
  policy: boolean[][];
  Continue: number[][];
}
