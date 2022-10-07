interface Person {
  name: string
  age: number
}

// Pick

type Pick2<T, K extends keyof T> = {
  [P in K]: T[K]
}

type Person2 = Pick2<Person, 'age'>

// record

type Page = 'xxx'

type Record2<K extends keyof any, T> = {
  [P in K]: T
}

type PageDetail = Record<Page, Person>

// ReturnType

type Func = (x: string) => string
type reType = ReturnType<Func>

// Exclude
type Exclude2<T, U> = T extends U ? never : T

type Person1 = Exclude2<'name' | 'age', 'age'>

// Extract
type Extract2<T, U> = T extends U ? T : never

type Person3 = Extract2<'name' | 'age', 'age'>

// Omit
type Omit2<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>

type Person4 = Omit2<Person, 'name'>
