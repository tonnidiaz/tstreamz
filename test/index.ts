interface IProps {name: string; age: number}
function getKeys<T>(): (keyof T)[] {
    return Object.keys({} as T) as (keyof T)[];
  }
  function getInterfaceKeys<T extends Record<string, any>>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
  }
  
  // Get the interface keys
  const keys: (keyof IProps)[] = getInterfaceKeys<IProps>({} as IProps); 
  
  console.log(keys); // Output: ["property1", "method1"]
// console.log(createDummyObject<IProps>());