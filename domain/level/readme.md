# level

本目录专门存放用于表示、计算等级、升级相关的类

## level的设计

- 等级是依赖消耗经验点进行提升
- 每升级一次，会消耗存储的经验点数，同时下一级需要的点数应该更多

    > 这块点数的增长曲线，依赖[data](./data)目录里定义的经验值表