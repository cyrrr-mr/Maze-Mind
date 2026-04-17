export function generateMaze(rows: number, cols: number) {
  const grid = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      r,
      c,
      walls: { top: true, right: true, bottom: true, left: true },
      visited: false,
    }))
  );

  const stack: any[] = [];
  const start = grid[0][0];
  start.visited = true;
  stack.push(start);

  const dirs = [
    { dr: -1, dc: 0, a: "top", b: "bottom" },
    { dr: 1, dc: 0, a: "bottom", b: "top" },
    { dr: 0, dc: -1, a: "left", b: "right" },
    { dr: 0, dc: 1, a: "right", b: "left" },
  ];

  while (stack.length) {
    const cur = stack[stack.length - 1];

    const neighbors = dirs
      .map((d) => {
        const nr = cur.r + d.dr;
        const nc = cur.c + d.dc;

        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          !grid[nr][nc].visited
        ) {
          return { cell: grid[nr][nc], d };
        }
        return null;
      })
      .filter(Boolean);

    if (!neighbors.length) {
      stack.pop();
      continue;
    }

    const pick: any =
      neighbors[Math.floor(Math.random() * neighbors.length)];

    cur.walls[pick.d.a] = false;
    pick.cell.walls[pick.d.b] = false;

    pick.cell.visited = true;
    stack.push(pick.cell);
  }

  return grid;
}