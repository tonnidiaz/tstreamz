
export interface IObj {
    [key: string]: any;
}

export interface ITask {name: string, id: string; interval: number; cb: (id: string)=> Promise<any>; active: boolean; desc?: string}