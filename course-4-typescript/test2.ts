// 1. Partial
// 2. Required
// 3. Readonly
// 4. RetureType
// 5. Pick
// 6. Record
// 7. Exclude
// 8. Extract
// 9. Omit

type Exclude3<T, P> = T extends P ? never : T
type Type8 = Exclude3<'a' | 'b', 'a'>
type Extract3<T, P> = T extends P ? T : never
type Type9 = Extract3<'a' | 'b', 'b'>
