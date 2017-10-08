# lifeCycle 设计

- 整个世界会有各种事件发生
- 一些需要角色关注的事件，也会触发对应角色的lifeCycle事件

## 世界 lifeCycle 列表

> 下面的事件列表，是按照实际发生的`时间先后顺序`从上到下列出来的。

name                | trigger time | 触发次数(N=回合数,M=目标对象数) | 参数 | 备注
-----               |------------- |-----------------------------|-----|-----
AFTER_WORLD_OPEN    |世界加载完成之后| 1 |
BATTLE_BEGIN |战斗开始|1|
TURN_BEGIN |回合开始|N|
BEFORE_CHAR_ACTION |角色行动前|N|{actor:<行动的char对象>}
BEFORE_CHAR_NORMAL_ATK |角色进行普攻前|N*M|{attacker:<行动的char对象>,target:<被选定的攻击对象>}|攻击时，如果选定多个对象，则此事件会挨个触发
BEFORE_CHAR_BE_NORMAL_ATKED |角色受到普攻前(此时已准备扣hp)|N*M|{attacker:<进攻的char对象>,target:<被选定的攻击对象>,damage:<造成的伤害>,realDamage:<实际伤害>}|在这个时候，可以对realDamage进行修改，来改变实际造成的伤害。(`比如实现某些减伤效果`)
AFTER_CHAR_BE_NORMAL_ATKED |角色受到普攻后(此时已扣过hp)|N*M|{attacker:<进攻的char对象>,target:<被选定的攻击对象>,damage:<造成的伤害>,realDamage:<实际伤害>}|在这个时候，realDamage就表示实际造成的伤害。(既成事实，已经无法修改)
AFTER_CHAR_NORMAL_ATK |角色进行普攻后|N*M|{attacker:<行动的char对象>,target:<被选定的攻击对象>,damage:<造成的伤害>,realDamage:<实际伤害>}
AFTER_CHAR_BE_NORMAL_ATK_MISS |角色受到普攻成功躲避后|N*M|{attacker:<进攻的char对象>,target:<被选定的攻击对象>}|如果普通攻击落空，会触发此事件
AFTER_CHAR_NORMAL_ATK_MISS |角色进行普攻Miss后|N*M|{attacker:<进攻的char对象>,target:<被选定的攻击对象>}|如果普通攻击落空，会触发此事件
AFTER_CHAR_ACTION |角色行动后|N|{actor:<行动的char对象>,continueTimes:<整数>如果大于0,则还可以再行动>}|continueTimes在行动完成之后会自动-1，如果被修改为>0的值,则actor可以再次进入行动周期（还在当前回合内），`可用于实现类似2次行动的特效`
TURN_END |回合结束|N|
BATTLE_END |战斗结束|1|
BEFORE_WORLD_CLOSE  |世界关闭之前|1|

## 角色 lifeCycle
对于`英雄`个体来说，因为在战斗中会发生频繁的被攻击、添加、移除状态等事件，所以其生命周期更加复杂。

目前的设计，除了一些固定的生命周期，需要封装一个`mutation`的发您

### 角色action
一个`action`表示一个对角色的修改操作。包括但不限于：
- 生命值变化
- 怒气值变化
- 添加效果
- 移除效果
- 等等...

一个`action`包括以下核心的参数：

名称  | 作用
-----|-------------
name | action名称
params | 报错action携带的上下文参数，根据不同的action不同而不同
canceld | boolean,表示这个action是否要取消

### 角色 lifeCycle 列表

name                | trigger time | 触发次数(N=回合数,M=目标对象数) | 参数 | 备注
-----               |------------- |-----------------------------|-----|-----
BEFORE_CHAR_ACTION |角色行动前|N|{}
BEFORE_CHAR_NORMAL_ATK |角色进行普攻前|N*M|{target:<被选定的攻击对象>}|攻击时，如果选定多个对象，则此事件会挨个触发
BEFORE_CHAR_BE_NORMAL_ATKED |角色受到普攻前(此时已准备扣hp)|N*M|{attacker:<进攻的char对象>,damage:<造成的伤害>,realDamage:<实际伤害>}|在这个时候，可以对realDamage进行修改，来改变实际造成的伤害。(`比如实现某些减伤效果`)
AFTER_CHAR_BE_NORMAL_ATKED |角色受到普攻后(此时已扣过hp)|N*M|{attacker:<进攻的char对象>,damage:<造成的伤害>,realDamage:<实际伤害>}|在这个时候，realDamage就表示实际造成的伤害。(既成事实，已经无法修改)
AFTER_CHAR_NORMAL_ATK |角色进行普攻后|N*M|{target:<被选定的攻击对象>,damage:<造成的伤害>,realDamage:<实际伤害>}
AFTER_CHAR_BE_NORMAL_ATK_MISS |角色受到普攻成功躲避后|N*M|{attacker:<进攻的char对象>}|如果成功闪避进攻者的普攻，会触发此事件
AFTER_CHAR_NORMAL_ATK_MISS |角色进行普攻Miss后|N*M|{target:<被选定的攻击对象>}|如果普通攻击落空，会触发此事件
AFTER_CHAR_ACTION |角色行动后|N|{continueTimes:<整数>如果大于0,则还可以再行动>}|continueTimes在行动完成之后会自动-1，如果被修改为>0的值,则actor可以再次进入行动周期（还在当前回合内），`可用于实现类似2次行动的特效`
