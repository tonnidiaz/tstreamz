export interface IObj {
    [key: string]: any;
}

export interface ITask {
    name: string;
    id: string;
    interval: number;
    cb: (id: string) => Promise<any>;
    active: boolean;
    desc?: string;
}

// utils/Path.ts

// Depth control type
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Join<K, P> = K extends string | number
    ? P extends string | number
        ? `${K}.${P}`
        : never
    : never;

// Limit recursion depth to 10
type Leaves<T, D extends number = 10> = [D] extends [never]
    ? never
    : T extends object
        ? {
              [K in keyof T]-?: K extends string | number
                  ? T[K] extends object
                      ? Join<K, Leaves<T[K], Prev[D]>> | K
                      : K
                  : never;
          }[keyof T]
        : never;

export type Path<T> = Leaves<T>;

