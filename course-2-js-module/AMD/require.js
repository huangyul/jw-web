// AMD 迷你实现

const defaultOptions = {
  paths: '',
}

// config的时候获取到options的配置
rj.config = (options) => Object.assign(defaultOptions, options)
