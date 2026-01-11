import type { GameParameters, SolverResult, DPState } from './types';

/**
 * 夹娃娃刮刮卡最优策略求解器
 * 使用动态规划计算最优停止策略
 */
export class ClawMachineSolver {
  private R0: number;
  private B0: number;
  private payout_per_win: number;
  private cost_per_grab: number;
  private q: number;
  private scratch_per_grab: number;
  private grabs_per_scratch: number;
  private effective_cost_per_scratch: number;
  private gR: number;
  private gB: number;

  constructor(params: GameParameters) {
    this.R0 = params.R0;
    this.B0 = params.B0;
    this.payout_per_win = params.payout_per_win;
    this.cost_per_grab = params.cost_per_grab;
    this.q = params.q ?? 0;
    this.scratch_per_grab = params.scratch_per_grab ?? 1;
    this.grabs_per_scratch = params.grabs_per_scratch ?? 1;

    // 计算有效每刮成本
    this.effective_cost_per_scratch =
      (this.cost_per_grab * this.grabs_per_scratch) / this.scratch_per_grab;

    // 计算单次抽到红球(中奖)和黑球(未中)的即时收益
    this.gR = this.payout_per_win - this.effective_cost_per_scratch;
    this.gB = this.q - this.effective_cost_per_scratch;
  }

  /**
   * 求解最优策略
   */
  public solve(): SolverResult {
    const state = this.initializeState();
    this.computeDP(state);

    const V_start = state.V[this.R0][this.B0];
    const policy_start = state.policy[this.R0][this.B0];
    const expected_wins = state.W[this.R0][this.B0];
    const expected_total_cost = state.C[this.R0][this.B0];

    const avg_cost_per_win = expected_wins > 0
      ? expected_total_cost / expected_wins
      : null;

    return {
      V_start,
      policy_start,
      effective_cost_per_scratch: this.effective_cost_per_scratch,
      avg_cost_per_win,
      expected_wins,
      expected_total_cost,
      policy_matrix: state.policy,
      V_matrix: state.V,
      Continue_matrix: state.Continue,
    };
  }

  /**
   * 初始化DP状态数组
   */
  private initializeState(): DPState {
    const V: number[][] = [];
    const C: number[][] = [];
    const W: number[][] = [];
    const policy: boolean[][] = [];
    const Continue: number[][] = [];

    for (let r = 0; r <= this.R0; r++) {
      V[r] = new Array(this.B0 + 1).fill(0);
      C[r] = new Array(this.B0 + 1).fill(0);
      W[r] = new Array(this.B0 + 1).fill(0);
      policy[r] = new Array(this.B0 + 1).fill(false);
      Continue[r] = new Array(this.B0 + 1).fill(0);
    }

    return { V, C, W, policy, Continue };
  }

  /**
   * 核心DP计算
   * 从小状态向大状态递推
   */
  private computeDP(state: DPState): void {
    // 边界条件已在初始化时设置为0
    // V(0,b) = 0, V(r,0) = 0
    // C(0,b) = 0, C(r,0) = 0
    // W(0,b) = 0, W(r,0) = 0

    // 从 (1,1) 开始递推到 (R0, B0)
    for (let r = 0; r <= this.R0; r++) {
      for (let b = 0; b <= this.B0; b++) {
        // 边界情况：没有球了或没有中奖球了
        if (r === 0 || (r + b) === 0) {
          state.V[r][b] = 0;
          state.policy[r][b] = false;
          state.Continue[r][b] = 0;
          state.C[r][b] = 0;
          state.W[r][b] = 0;
          continue;
        }

        const total = r + b;
        const pR = r / total;
        const pB = b / total;

        // 计算Continue(r,b)的期望值
        let continueValue = 0;

        if (r > 0) {
          continueValue += pR * (this.gR + state.V[r - 1][b]);
        }
        if (b > 0) {
          continueValue += pB * (this.gB + state.V[r][b - 1]);
        }

        state.Continue[r][b] = continueValue;

        // V(r,b) = max(0, Continue(r,b))
        state.V[r][b] = Math.max(0, continueValue);

        // policy(r,b) = Continue(r,b) > 0
        state.policy[r][b] = continueValue > 0;

        // 如果策略是继续，计算期望成本和期望中奖次数
        if (state.policy[r][b]) {
          // C(r,b) = effective_cost + pR*C(r-1,b) + pB*C(r,b-1)
          let expectedCost = this.effective_cost_per_scratch;
          if (r > 0) {
            expectedCost += pR * state.C[r - 1][b];
          }
          if (b > 0) {
            expectedCost += pB * state.C[r][b - 1];
          }
          state.C[r][b] = expectedCost;

          // W(r,b) = pR*(1 + W(r-1,b)) + pB*W(r,b-1)
          let expectedWins = 0;
          if (r > 0) {
            expectedWins += pR * (1 + state.W[r - 1][b]);
          }
          if (b > 0) {
            expectedWins += pB * state.W[r][b - 1];
          }
          state.W[r][b] = expectedWins;
        } else {
          // 如果策略是停手，成本和中奖次数为0
          state.C[r][b] = 0;
          state.W[r][b] = 0;
        }
      }
    }
  }
}

/**
 * 便捷求解函数
 */
export function solveClawMachine(params: GameParameters): SolverResult {
  const solver = new ClawMachineSolver(params);
  return solver.solve();
}
