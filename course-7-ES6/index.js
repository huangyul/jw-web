function PromsieAllSettled(promiseArray) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promiseArray)) {
      return reject(new TypeError('参数必须是一个数组'))
    }

    let counter = 0
    const len = promiseArray.length
    const res = []

    for (let i = 0; i < len; i++) {
      Promise.resolve(promiseArray[i])
        .then((value) => {
          res[i] = {
            value,
            status: 'fulfilled',
          }
        })
        .catch((reason) => {
          res[i] = {
            reason,
            status: 'rejected',
          }
        })
        .finally(() => {
          counter++
          if (counter == len) {
            resolve(res)
          }
        })
    }
  })
}
