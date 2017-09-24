# 关于英雄


## 基本属性

基本属性，是英雄的主要属性，也分别决定了其他各项衍生属性的数值。


名称      |           含义|             受其正面影响的数值|       受其负面影响的数值
----|----|----|-----
STR|力量|ATK|FLEE
INT|智力|M_ATK,M_DEF|HP_MAX
AGI|敏捷|SPD,FLEE|CRI
VIT|体质|DEF,M_DEF,HP_MAX|SPD,FLEE,HIT
DEX|协调|HIT,FLEE|NO
LUK|运气|CRI,FLEE,HIT|NO

## 衍生属性

衍生属性，是直接表现英雄在某方的能力的属性。

- 衍生属性是由基本属性，根据一定的计算公式得出。
- 物品、道具、技能的加成，如果是百分比加成，是基于"基础属性所计算得出的衍生属性"进行加成

> 下表列出了不同基础属性对衍生属性的影响程度

名称      |           含义|力量(STR)|敏捷(AGI)|协调(DEX)|INT(智力)|VIT(体质)|LUK(运气)
----|----|----|-----|-----|-----|-----|-----
HP_MAX|HP上限|NO|NO|NO|-|+++|NO
ATK|攻击力(物理)|+++|NO|NO|NO|NO|NO
M_ATK|攻击力(魔法)|NO|NO|NO|+++|NO|NO
DEF|防御力(物理)|NO|NO|NO|NO|+++|NO
M_DEF|防御力(魔法)|NO|NO|NO|+++|+|NO
SPD|速度|NO|+++|NO|NO|-|NO
FLEE|闪避|-|++|+++|NO|-|+
HIT|命中|NO|NO|++|NO|-|+
CRI|暴击率|NO|-|NO|NO|NO|+++



## 其他属性

其他属性，并不是根据基础属性计算得出，而通常是系统分配，或者随机确定的。

名称      |           含义|力量(STR)|敏捷(AGI)|协调(DEX)|INT(智力)|VIT(体质)|LUK(运气)
----|----|----|-----|-----|-----|-----|-----
CRI_ATK|暴击伤害加成|NO|NO|NO|NO|NO|NO
SP_MAX|怒气值上限|NO|NO|NO|NO|NO|NO

> 下表列出了各种属性的作用


名称      |           含义|作用机制|备注
----|----|----|------
HP_MAX|HP上限|决定了人物的hp最大值，越多代表生成能力越强|
SP_MAX|怒气值上限|怒气达到MAX,会自动释放主动技能。怒气上限多，释放技能慢，但是技能效果(和怒气值相关)越强，可以实现一些类似秒杀的效果|为了数值考虑，怒气值正常基准为100，最多不应该超过200
ATK|攻击力(物理)|人物普通、或技能（物理属性）攻击的时候，计算对对手造成伤害的主要属性|普通攻击一定是物理属性，技能则需要看具体技能的说明
M_ATK|攻击力(魔法)|人物使用技能（魔法属性）攻击的时候，计算对对手造成伤害的主要属性|
DEF|防御力(物理)|人物受到普通、或技能（物理属性）攻击的时候，计算对对手造成伤害抵抗的主要属性|
M_DEF|防御力(魔法)|人物受到技能攻击（魔法属性）的时候，计算对对手造成伤害抵抗的主要属性|
SPD|速度|决定人物的行动先后顺序|
FLEE|闪避|计算是否免疫对方普通、技能攻击的时候，主要依赖flee|
HIT|命中|计算对对手的攻击是否命中，依靠HIT来完成|
CRI|暴击率|当普通/技能攻击的时候，暴击率越高，造成暴击伤害加成的概率越大|
CRI_ATK|暴击伤害加成|当暴击发生的时候，伤害加成越多，效果越好|



## 阵营


## 星级


## 职业