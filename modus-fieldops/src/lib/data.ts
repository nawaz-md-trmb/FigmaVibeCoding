export type OrderStatus = 'open' | 'in-progress' | 'blocked' | 'done'

export type WorkOrder = {
  id: string
  site: string
  trade: string
  status: OrderStatus
  crews: number
  owner: string
  updated: string
}

export const SITES = [
  { value: 'north', label: 'North Yard' },
  { value: 'harbor', label: 'Harbor Dock' },
  { value: 'ridge', label: 'Ridge Quarry' },
  { value: 'east', label: 'East Plant' },
]

export const TRADES = [
  { value: 'grade', label: 'Grading' },
  { value: 'pave', label: 'Paving' },
  { value: 'util', label: 'Utilities' },
  { value: 'survey', label: 'Survey' },
]

export const INITIAL_ORDERS: WorkOrder[] = [
  { id: 'WO-1204', site: 'North Yard', trade: 'Grading', status: 'open', crews: 3, owner: 'A. Chen', updated: '10:14' },
  { id: 'WO-1205', site: 'Harbor Dock', trade: 'Paving', status: 'in-progress', crews: 2, owner: 'M. Okonkwo', updated: '09:52' },
  { id: 'WO-1206', site: 'Ridge Quarry', trade: 'Survey', status: 'blocked', crews: 1, owner: 'S. Patel', updated: 'Yesterday' },
  { id: 'WO-1207', site: 'East Plant', trade: 'Utilities', status: 'open', crews: 4, owner: 'J. Alvarez', updated: '08:11' },
  { id: 'WO-1208', site: 'North Yard', trade: 'Paving', status: 'done', crews: 2, owner: 'A. Chen', updated: 'Mon' },
  { id: 'WO-1209', site: 'Harbor Dock', trade: 'Grading', status: 'in-progress', crews: 3, owner: 'R. Singh', updated: '07:40' },
]

export const FLEET = [
  { id: 'EQ-88', name: 'Excavator 320', yard: 'North', hours: 412, grade: 82 },
  { id: 'EQ-91', name: 'Dozer D6', yard: 'Harbor', hours: 208, grade: 64 },
  { id: 'EQ-94', name: 'Grader 140', yard: 'Ridge', hours: 91, grade: 94 },
]
