export interface IEventHandler {
  (...rest: any[]): any
}

interface IEventMap {
  [eventType: string]: Array<{
    type: string;
    cb: IEventHandler;
    options?: {
      once?: boolean;
    }
  }>
}

function isPromise(obj: any):boolean {
  if(!obj || typeof obj !== 'object' || typeof obj.then !== 'function') return false
  if(Promise && Promise.resolve) {
    return Promise.resolve(obj) === obj
  } else {
    return Object.prototype.toString.call(obj) === '[object Promise]'
  }
}

class OhMyEmitter {
  private eventMap: IEventMap = {}

  public on(type: string, cb: IEventHandler) {
    if(!type || !cb) return false
    if(!this.eventMap[type]) this.eventMap[type] = []

    if(this.eventMap[type].findIndex(item => item.cb === cb) > -1) return // 已存在相同事件直接返回

    this.eventMap[type].push({
      type,
      cb
    })
  }

  public once(type: string, cb: IEventHandler) {
    if(!type || !cb) return false
    if(!this.eventMap[type]) this.eventMap[type] = []

    this.eventMap[type].push({
      type,
      cb,
      options: {
        once: true
      }
    })
  }
  
  public emit(type: string, payload?: any, cb?: IEventHandler) {
    const collect = this.eventMap[type]
    if(!Array.isArray(collect)) return false
    const processor: Array<Promise<any>> = []

    collect.forEach((item, index) => {
      const feedback = item.cb(payload)
      if(isPromise(feedback)) {
        processor.push(feedback)
      }
      if(item.options && item.options.once) {
        collect.splice(index, 1)
      }
    })

    Promise.all(processor).then(() => cb ? cb() : null).catch(console.error)
  }

  public off(type: string, cb?: IEventHandler) {
    const collect = this.eventMap[type]
    if(!Array.isArray(collect)) return false

    if(!cb) delete this.eventMap[type] // 抹除所有

    const idx = collect.findIndex(item => item.cb === cb)
    if(idx !== -1) collect.splice(idx, 1)
  }
}

declare global {
  export interface Window {
    // @ts-ignore
    OhMyEmitter: OhMyEmitter
  }
}

if(!window.OhMyEmitter) {
  // @ts-ignore
  window.OhMyEmitter = new OhMyEmitter()
}

export default window.OhMyEmitter