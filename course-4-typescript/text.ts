interface Test<T> {
  name: T
}

type TestA = Test<string>

const t: TestA = {
  'name': 'sdf'
}