export enum TodoStatus {
  Opening = 1,
  Progressing = 2,
  Testing = 3,
  Done = 4,
  Rejected = 5,
}

export const TodoStatusMapping = {
  1: 'Opening',
  2: 'Progressing',
  3: 'Testing',
  4: 'Done',
  5: 'Rejected',
};

export const TodoStatusReverseMapping: Record<string, TodoStatus> = {
  Opening: TodoStatus.Opening,
  Progressing: TodoStatus.Progressing,
  Testing: TodoStatus.Testing,
  Done: TodoStatus.Done,
  Rejected: TodoStatus.Rejected,
};
