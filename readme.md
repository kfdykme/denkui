<!--
 * @Author: kfdykme
--> 

### START

```bash
deno run -A .\\src\\test\\testLife.ts
```

### 介绍

目标是实现一个跨平台的前端转桌面应用的套件。

当前初步的想法是以快应用为标准，实现将快应用的代码转换成桌面应用

最终会包含:
- 解析快应用/类小程序的app项目转换为目标文件的模块
- 基于Deno运行的运行非ui逻辑的模块
- Deno进程与原生ui进程通信的ipc模块
- 基于各个平台原生的ui模块
- 各个模块之间的接口定义，以便使得各个模块可以自由实现内部代码
- 暂时的想法是这样




### TODO

- view树 [DONE]
- view 与 deno的交互 [DONE]
- 生命周期保证 [DONE]
- 组件
    - 组件内的View
    - 组件内的Context
- 条件渲染
- 迭代渲染
- 合并
- css渲染树

TODO MODULE | TODO TASK | TASK STAUS 
--- | --- | --- | 
Part 1 : Trans from quickapp to Deno Code | Load From Manifest | -
 |-  | Load a single js file | DONE
Part 2 : System skill power   | fetch  网络请求|
 |- | prompt  建议通信 | -
 |- | storage 存储能力 | -
 |- | router 路由能力 | - 
 |- | request 上传下载能力 | - 
 |- | network 网络状态相关能力 | -
Part 3 : A pipe module | - | -
Part 4 : UI Module in windows | - | -