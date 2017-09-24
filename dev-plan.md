# Aug 2017
- 2017/08/30:
    - finish the data structure sync framework
    - build the server skeleton
    - build the client skeleton

- 2017/08/15:
    - finish the domain logic
    - add test cases to the domain logic

### details

- deadline:2017年08月25日：

    - (ing)开发battle v0.1
        - 定义战场位置、对战双方等基础规则
        - 定义 hero 类，表示一个人物
            - 阵营系统
            - 职业系统
            - 属性系统
            - 星级系统
        - 定义战斗流程
            - 能量槽、主动、被动技能
        - 完成单元测试，能够后台进行完整的对战流程

    - 开发用户、物品体系
        - 把用户、背包数、卡片角色进行对应
        - 搭建整体经济体系：金币、钻石、经验石、其他材料
        - 开发简易的合成公式体系
        - 开发完整的装备体系
        - 完善测试用例


    - 开发基础技能体系
        - 把常用的技能都进行丰富
        - 完善测试用例

    - 开发基础玩法0.1
        - PVE
            - 区域搜索与挂机战斗
        - PVP
            - 开发简单的竞技场体系
            - 竞技场排名每分钟都可以获取收益（而不是按点结算)


    - 数据落地
        - 数据库选型
        - 服务重启之后，玩家登录之后，数据初始化问题

    - (DONE)开发level包
        - 表示等级、可升级对象

    - (DONE)画出领域模型关系图，和代码一致
    - (DONE)开发effect ，增加params.continueTurn
        - 表示持续若干回合的效果
            - 这类效果内部会记录一个持续回合数
            - 这类效果会订阅target上一个特殊的生命周期"AFTER_CHAR_ACTION"
            - 在角色行动结束之后，效果会减少持续回合数，如果为0，则自动触发uninstall

    - (DONE)开发Skill包
        - (DONE)Skill 继承自 levelable,表示是一个可以升级的东西
        - (DONE)Skill 包含Skill Item,Skill Item 包含若干个effect
        - (DONE)skillItem.toString实现
        - (DONE)effect.toString实现
    - (DONE)实现概率模块
