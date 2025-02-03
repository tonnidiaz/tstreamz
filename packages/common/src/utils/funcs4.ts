type Path<T> = T extends object
    ? {
          [K in keyof T]: K extends string
              ? T[K] extends object
                  ? K | `${K}.${Path<T[K]>}`
                  : K
              : never;
      }[keyof T]
    : never;
type PathValue<T, P extends Path<T>> = P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
        ? Rest extends Path<T[K]>
            ? PathValue<T[K], Rest>
            : never
        : never
    : P extends keyof T
      ? T[P]
      : never;
/**
 * 
 * @param obj The object to modify
 * @param path The path to field to be modified
 * @param value The field value
 * @returns The modified object
 */
export  const $obj = <T, P extends Path<T>>(
    obj: T,
    path: P,
    value: PathValue<T, P>
): T => {
    const keys = path.split(".") as (keyof any)[];
    let current: any = obj;

    keys.slice(0, -1).forEach((key) => {
        if (!(key in current)) {
            throw new Error(`Invalid path: ${String(key)}`);
        }
        current = current[key];
    });

    const lastKey = keys[keys.length - 1];
    current[lastKey] = value;
    console.log(obj, current);
    return obj;
};


export const tuImmer = <T>(obj: T, cb: (objCopy: T)=>any)=>{
    const copy = {...obj}
    cb(copy)
    return copy
}

