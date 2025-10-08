
export enum ScoringType {
  PASS_FAIL = 'Đạt/Không đạt',
  SCALE_10 = 'Thang điểm 10',
  YES_NO = 'Có/Không',
}

export const SCORING_OPTIONS: Record<ScoringType, (string | number)[]> = {
    [ScoringType.PASS_FAIL]: ['Đạt', 'Không đạt'],
    [ScoringType.SCALE_10]: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [ScoringType.YES_NO]: ['Có', 'Không'],
};

export interface Evidence {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface Score {
  status: string | number;
  date: string;
  notes: string;
  evidence: Evidence[];
}

export interface SubItem {
  id: string;
  description: string;
  scoringGuide: string;
  scoringType: ScoringType;
  weight: number;
  score?: Score;
}

export interface Criterion {
  id: string;
  name: string;
  subItems: SubItem[];
}

export interface CriterionGroup {
  id: string;
  name: string;
  department: string;
  criteria: Criterion[];
}

export type View = 'management' | 'scoring' | 'reports';
