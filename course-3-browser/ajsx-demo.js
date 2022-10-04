/* 原生的请求方式 */

const xhr = new XMLHttpRequest()

xhr.open('GET', 'http://xxx/xxx')

xhr.onreadystatechange = function () {
  // readyState 为4请求才算成功
  if (xhr.readyState != 4) {
    return
  }

  if (xhr.status == 200) {
    console.log(xhr.responseText)
  } else {
    console.error(xhr.status, xhr.statusText)
  }
}

xhr.timeout = 3000

// 获取上传进度
xhr.upload.onprogress = function (p) {
  console.log(Math.round((p.loaded / p.total) * 100) + '%')
}

xhr.send()

fetch('http://xxx/xxx', {
  method: 'GET',
  credentials: 'same-origin'
})
  .then((res) => {
    res.json()
  })
  .then((json) => console.log(json))
  .catch((err) => {
    console.log(err)
  })
