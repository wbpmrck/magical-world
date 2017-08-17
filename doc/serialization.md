# 序列化和反序列化
为了方便游戏数据的加载和落地。所有需要落地的数据结构都必须实现2个方法：

- fromJSON(Object context,String json) T
    - 根据输入json字符串，输出自己的对象引用
    - context 是游戏世界里的上下文，在加载游戏世界的时候生成，用于辅助对象来构造自身
- toJSON(Object context) String
    - 根据自己的内存结构，输出字符串表示
    - 要保证输出的字符串通过fromJSON方法还可以还原自己
    - context 是游戏世界里的上下文，在加载游戏世界的时候生成，用于辅助对象来描述自身