# TypeScript 配置文件 (tsconfig.json) 翻译说明

## 基本结构

```json
{
  "compilerOptions": { ... },  // 编译器选项
  "include": [ ... ],          // 包含的文件
  "exclude": [ ... ]           // 排除的文件
}
```

## 编译器选项 (compilerOptions) 详细说明

### 基础配置

- **`"rootDir": "./"`** - 根目录设置为当前目录
- **`"target": "ESNext"`** - 编译目标为最新的 ECMAScript 版本
- **`"lib": ["dom", "dom.iterable", "esnext"]`** - 包含的库文件：
  - `dom` - DOM 相关类型定义
  - `dom.iterable` - DOM 可迭代对象类型
  - `esnext` - 最新 ECMAScript 特性

### 类型定义

- **`"types": ["vitest/globals", "@testing-library/jest-dom"]`** - 包含的全局类型：
  - `vitest/globals` - Vitest 测试框架的全局类型
  - `@testing-library/jest-dom` - Jest DOM 测试库的类型

### JavaScript 兼容性

- **`"allowJs": true`** - 允许编译 JavaScript 文件
- **`"skipLibCheck": true`** - 跳过库文件的类型检查（提高编译速度）
- **`"esModuleInterop": true`** - 启用 ES 模块互操作性
- **`"allowSyntheticDefaultImports": true`** - 允许合成默认导入

### 严格模式

- **`"strict": true`** - 启用所有严格类型检查选项
- **`"forceConsistentCasingInFileNames": true`** - 强制文件名大小写一致
- **`"noFallthroughCasesInSwitch": true`** - 禁止 switch 语句中的 fallthrough 情况

### 模块系统

- **`"module": "ESNext"`** - 使用最新的 ES 模块系统
- **`"moduleResolution": "node"`** - 使用 Node.js 模块解析策略
- **`"resolveJsonModule": true`** - 允许导入 JSON 模块
- **`"isolatedModules": true`** - 确保每个文件都能独立编译

### 输出配置

- **`"noEmit": true`** - 不生成输出文件（仅进行类型检查）

### JSX 配置

- **`"jsx": "react-jsx"`** - 使用新的 JSX 转换（React 17+）

### 路径映射

- **`"baseUrl": "."`** - 基础路径设置为当前目录
- **`"paths": {}`** - 路径映射配置（当前为空）

## 文件包含和排除

### 包含的文件 (include)

- **`"packages"`** - packages 目录
- **`"excalidraw-app"`** - excalidraw-app 目录

### 排除的文件 (exclude)

- **`"examples"`** - examples 目录
- **`"dist"`** - dist 构建输出目录
- **`"types"`** - types 类型定义目录
- **`"tests"`** - tests 测试目录

## 总结

这个 TypeScript 配置适用于一个现代化的 React 项目，具有以下特点：

1. **现代 ES 特性** - 使用最新的 ECMAScript 和模块系统
2. **React 支持** - 配置了 React JSX 转换
3. **严格类型检查** - 启用了所有严格模式选项
4. **测试支持** - 包含了 Vitest 和 Jest DOM 的类型定义
5. **开发友好** - 跳过库文件检查以提高编译速度
6. **模块化** - 支持 ES 模块和 JSON 模块导入

该配置特别适合用于 Excalidraw 这样的绘图应用项目。
