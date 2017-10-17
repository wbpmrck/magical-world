# Aug 2017
- 2017/10/30:
    - finish the data structure sync framework
    - build the server skeleton
    - build the client skeleton

- 2017/11/15:
    - finish the domain logic
    - add test cases to the domain logic

### details

- deadline:2017年10月25日：

    - (ing)开发battle v0.1
        - 定义战场位置、对战双方等基础规则
        - 定义 hero 类，表示一个人物
            - (DONE)阵营系统
            - (DONE)职业系统
            - (DONE)属性系统
            - (DONE)星级系统
        - Action
            - 英雄行为
            - 对技能的使用，都在Action里
        - Team
            - 队伍系统：占位、人数
            - 团队属性：光环等
        - Mutation
            - 状态修改
            - 对英雄属性、效果的修改，都在Mutation里
        - 定义战斗流程
            - 能量槽、主动、被动技能
        - 完成单元测试，能够后台进行完整的对战流程

    - 开发用户、物品、背包体系
        - 创建player概念
        - player具有物品资源列表
            - 不管是角色已经装备的，还是资源，所有物品统一记录在列表
            - 通过物品位置记录物品的所在：
                - 0:列表
                - 1:hero对象，表示在hero身上装备
        - 角色具有装备列表
            -（角色不持有其他物品，只记录装备的物品）
            - 角色的装备列表引用物品列表的id
        - 把用户、背包数、卡片角色进行对应
        - 搭建整体经济体系：金币、钻石、经验石、其他材料
        - 开发简易的合成公式体系
        - 开发完整的装备体系
        - 完善测试用例

    - 数据落地
        - 数据库选型
        - 服务重启之后，玩家登录之后，数据初始化问题
            - 考虑从Player类一直到Hero类，都支持随时把自己序列化到数据库，以及从数据库读取的功能

    - 完善组队战斗
        - 实现阵营光环机制

    - 开发基础技能体系
        - 把常用的技能都进行丰富
        - 完善测试用例

    - 开发基础玩法0.1
        - PVE
            - 区域搜索与挂机战斗
        - PVP
            - 开发简单的竞技场体系
            - 竞技场排名每分钟都可以获取收益（而不是按点结算)

    - 数值策划
        - 经验值曲线
        - 衍生属性计算公式


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


- 性能优化
    - 属性压缩：
        - 目前使用字符串存储attrCarrier里的属性，其实后面可以考虑使用数组
        - 使用枚举+iota的方式，一个整数下标表示一个属性名
        - 数据库存储可以直接数组存储