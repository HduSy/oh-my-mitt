# oh-my-mitt
组件间通信简单实现。
## 特征
- 体积小，无依赖 📦
- 兼容多种模块方案 ⏱️
## 类型定义
```ts
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
```
## 使用
### 安装
```cmd
pnpm/yarn/npm install oh-my-mitt
```
### 引入
```ts
import mitter from 'oh-my-mitt'
```
### 方法
#### on(type: string, cb: IEventHandler)
监听 `type` 事件，并触发回调 `cb` 。同一回调，多次注册时，仅能成功注册一次，避免了多次执行。
```ts
mitter.on('show', () => {
  console.log('show')
})
// 多次触发，'show' 打印多次
```
#### once(type: string, cb: IEventHandler)
监听 `type` 事件，并触发回调 `cb`，与 `on` 方法不同的是，只监听一次
```ts
mitter.once('show', () => {
  console.log('show')
})
// 多次触发，'show' 只打印 1 次
```
### emit(type: string, payload?: any, cb?: IEventHandler)
触发 `type` 事件，可选参数传递值 `payload` 可选参数执行回调 `cb`
```ts
mitter.emit('show')
```
### off(type: string, cb?: IEventHandler)
移除对 `type` 事件的监听，可选参数传递值 `cb`，有两种传递情况：
- 若无 `cb` 参数，则抹除掉所有侦听 `type` 的事件；
- 若有 `cb` 参数，则只抹除掉对该 `cb` 回调的侦听事件；
```ts
const openDialog = () => {
  console.log('打开弹窗')
}
mitter.off('show') // 彻底不再侦听 `show` 事件
mitter.off('show', openDialog) // 仅仅不再执行 `show` 事件下 openDialog 的回调
```