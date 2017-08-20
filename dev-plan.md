# Aug 2017
- 2017/08/30:
    - finish the data structure sync framework
    - build the server skeleton
    - build the client skeleton

- 2017/08/15:
    - finish the domain logic
    - add test cases to the domain logic

### details

- 2017年08月19日：

    > (DONE)开发level包
        - 表示等级、可升级对象

    - (DONE)画出领域模型关系图，和代码一致
    - (DONE)开发effect ，增加params.continueTurn
        - 表示持续若干回合的效果
            - 这类效果内部会记录一个持续回合数
            - 这类效果会订阅target上一个特殊的生命周期"AFTER_CHAR_ACTION"
            - 在角色行动结束之后，效果会减少持续回合数，如果为0，则自动触发uninstall

    - (ing)开发Skill包
        - (DONE)Skill 继承自 levelable,表示是一个可以升级的东西
        - (DONE)Skill 包含Skill Item,Skill Item 包含若干个effect
        - (ing)skillItem.toString实现
        - (DONE)effect.toString实现
    - (DONE)实现概率模块
