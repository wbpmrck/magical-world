# mutation

`mutation`的概念，也是借鉴了前端状态管理的里的一个机制。也即：

> 对游戏世界里的角色、物品、世界等的改动，不直接使用对象直接互操作的方式，而是通过创建一个mutation对象，然后将这个对象派发给对应的target
## mutation 和 action 的关系

`mutation`一定依附于`action`存在，他是一个`主动动作`带来的`side effect`，如果没有一个主动动作，是不会产生`mutation`的
## mutation存在的意义

将对游戏世界进行改变的过程，进行结构化，同时也更加优雅的支持游戏中复杂的效果机制。

比如，HeroA攻击HeroB,造成22点伤害，则大致处理思路:

- 构造一个Mutation,`target`是HeroB,类型可能是:`属性扣减`，参数可能是:"HP","-22"
- HeroB对象通过某个方法(比如:acceptMutation)接收这个mutation:
    - 解析`mutation`类型
    - 触发对应的生命周期事件
    - 如果这个mutation成功被应用，则使用对应参数，进行自身修改
    - 修改之后的结果，落地到数据库