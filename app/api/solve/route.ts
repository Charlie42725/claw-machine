import { NextRequest, NextResponse } from 'next/server';
import { solveClawMachine } from '@/lib/solver';
import type { GameParameters } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证输入参数
    const errors = validateParameters(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: errors },
        { status: 400 }
      );
    }

    // 构建参数对象
    const params: GameParameters = {
      R0: body.R0,
      B0: body.B0,
      payout_per_win: body.payout_per_win,
      cost_per_grab: body.cost_per_grab,
      q: body.q,
      scratch_per_grab: body.scratch_per_grab,
      grabs_per_scratch: body.grabs_per_scratch,
    };

    // 执行求解
    const result = solveClawMachine(params);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Solver error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function validateParameters(body: any): string[] {
  const errors: string[] = [];

  if (typeof body.R0 !== 'number' || body.R0 < 0 || !Number.isInteger(body.R0)) {
    errors.push('R0 must be a non-negative integer');
  }

  if (typeof body.B0 !== 'number' || body.B0 < 0 || !Number.isInteger(body.B0)) {
    errors.push('B0 must be a non-negative integer');
  }

  if (body.R0 === 0 && body.B0 === 0) {
    errors.push('R0 and B0 cannot both be zero');
  }

  if (typeof body.payout_per_win !== 'number' || body.payout_per_win < 0) {
    errors.push('payout_per_win must be a non-negative number');
  }

  if (typeof body.cost_per_grab !== 'number' || body.cost_per_grab < 0) {
    errors.push('cost_per_grab must be a non-negative number');
  }

  if (body.q !== undefined && (typeof body.q !== 'number' || body.q < 0)) {
    errors.push('q must be a non-negative number if provided');
  }

  if (body.scratch_per_grab !== undefined) {
    if (typeof body.scratch_per_grab !== 'number' || body.scratch_per_grab <= 0) {
      errors.push('scratch_per_grab must be a positive number if provided');
    }
  }

  if (body.grabs_per_scratch !== undefined) {
    if (typeof body.grabs_per_scratch !== 'number' || body.grabs_per_scratch <= 0) {
      errors.push('grabs_per_scratch must be a positive number if provided');
    }
  }

  // 检查状态空间大小（防止过大导致性能问题）
  if (body.R0 > 500 || body.B0 > 500) {
    errors.push('R0 and B0 must not exceed 500 to ensure reasonable computation time');
  }

  return errors;
}
