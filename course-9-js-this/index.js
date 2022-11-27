function fn() {
  return {
    b: () => {
      console.log(this)
    },
  }
}

fn().b()
fn().b.bind(1)()
fn.bind(2)().bind(3)()
