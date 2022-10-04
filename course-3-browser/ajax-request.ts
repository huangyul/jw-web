// 封装通用的ajax请求

type AjaxType = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface IOptions {
  url: string
  type?: AjaxType
  data?: any
  timeout?: number
}

function formatUrl(json) {
  let _json = { ...json }
  let arr: string[] = []
  _json.t = Math.random() + Date.now()
  for (let key in json) {
    arr.push(`${key}=${encodeURIComponent(json(key))}`)
  }
  return arr.join('&')
}

export function ajax(
  options: IOptions = {
    type: 'GET',
    timeout: 3000,
    url: '',
    data: {},
  }
) {
  return new Promise((resolve, reject) => {
    // ajax({} as any) 可以绕过
    if (!options || !options.url) {
      return
    }

    let dataToUrl = formatUrl(options.data)
    let xhr
    let timer

    if ((window as any).XMLHttpRequest) {
      xhr = new XMLHttpRequest()
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }

    if (options.type?.toUpperCase() === 'GET') {
      xhr.open('get', `${options.url}?${dataToUrl}`)
      xhr.send()
    } else if (options.type?.toUpperCase() === 'POST') {
      xhr.open('post', options.url)
      xhr.setRequestHeader('ContentType', 'application/x-www-form-urlencode')
      xhr.send(options.data)
    }

    xhr.onreadystatechange = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      if (xhr.readStatus === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          resolve(xhr.responseText)
        } else {
          reject(xhr.status)
        }
      }
    }

    if (options.timeout) {
      timer = setTimeout(() => {
        xhr.abort()
        reject('请求超时')
      }, options.timeout)
    }
  })
}
