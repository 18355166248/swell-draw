import { createElement, Fragment, ReactNode } from "react";
import { t, TranslationKeys } from "../i18n";

/**
 * Trans 组件用于处理国际化翻译中的 JSX 插值和标签替换
 *
 * 该组件支持两种插值方式：
 * 1. 变量插值：{{variable}} - 用于插入动态值
 * 2. 标签插值：<tag>content</tag> - 用于包装内容为 React 组件
 */

// 用于将 i18nKey 分割成标记的正则表达式
// 示例：
// "Please <link>click {{location}}</link> to continue.".split(SPLIT_REGEX).filter(Boolean)
// 结果：
// ["Please ", "<link>", "click ", "{{location}}", "</link>", " to continue."]
const SPLIT_REGEX = /({{[\w-]+}})|(<[\w-]+>)|(<\/[\w-]+>)/g;

// 用于从 "{{location}}" 中提取 "location" 的正则表达式
const KEY_REGEXP = /{{([\w-]+)}}/;

// 用于从 "<link>" 中提取 "link" 的正则表达式
const TAG_START_REGEXP = /<([\w-]+)>/;

// 用于从 "</link>" 中提取 "link" 的正则表达式
const TAG_END_REGEXP = /<\/([\w-]+)>/;

const getTransChildren = (format: string, props: OtherProps): ReactNode[] => {
  // 使用栈结构来管理嵌套的标签和内容
  const stack: { name: string; children: React.ReactNode[] }[] = [
    {
      name: "",
      children: [],
    },
  ];
  format
    .split(SPLIT_REGEX)
    .filter(Boolean)
    .forEach((item) => {
      const tagStartMatch = item.match(TAG_START_REGEXP);
      const tagEndMatch = item.match(TAG_END_REGEXP);
      const keyMatch = item.match(KEY_REGEXP);
      if (tagStartMatch !== null) {
        // 匹配到开始标签 <tag>
        // 例如："Please <link>click the button</link> to continue"
        // tagStartMatch[1] = "link"，如果 props 中包含 "link" 属性，则将其推入栈
        const name = tagStartMatch[1];
        // eslint-disable-next-line no-prototype-builtins
        if (props.hasOwnProperty(name)) {
          stack.push({
            name,
            children: [],
          });
        } else {
          console.warn(
            `Trans: missed to pass in prop ${name} for interpolating ${format}`,
          );
        }
      } else if (tagEndMatch !== null) {
        // 匹配到结束标签 </tag>
        // 例如：format = "Please <link>click the button</link> to continue"
        // tagEndMatch 匹配 "</link>"，栈顶项名称为 "link"
        // props.link = (el) => <a href="https://example.com">{el}</a>
        // 则将其子内容包装为链接组件
        const name = tagEndMatch[1];
        if (name === stack[stack.length - 1].name) {
          const item = stack.pop()!;
          const itemChildren = createElement(Fragment, {}, ...item.children);
          const fn = props[item.name];
          if (typeof fn === "function") {
            stack[stack.length - 1].children.push(fn(itemChildren));
          }
        } else {
          console.warn(
            `Trans: unexpected end tag ${item} for interpolating ${format}`,
          );
        }
      } else if (keyMatch !== null) {
        // 匹配到变量插值 {{key}}
        // 例如：format = "Hello {{name}}"，key = "name"，props.name = "Excalidraw"
        // 则在 DOM 中渲染为 "Hello Excalidraw"
        const name = keyMatch[1];
        // eslint-disable-next-line no-prototype-builtins
        if (props.hasOwnProperty(name)) {
          stack[stack.length - 1].children.push(props[name] as React.ReactNode);
        } else {
          console.warn(
            `Trans: key ${name} not in props for interpolating ${format}`,
          );
        }
      } else {
        // 如果都不匹配，说明是普通文本，直接推入栈顶的子节点
        // 例如："Hello {{name}} Whats up?" 中的 "Hello" 和 " Whats up?" 会被推入
        stack[stack.length - 1].children.push(item);
      }
    });

  // 检查栈是否为空（应该只剩下根节点）
  if (stack.length !== 1) {
    console.warn(`Trans: stack not empty for interpolating ${format}`);
  }
  return stack[0].children;
};

interface OtherProps {
  [key: string]: React.ReactNode | ((el: React.ReactNode) => React.ReactNode);
}

interface TransProps {
  i18nKey: TranslationKeys;
}

const Trans = ({ i18nKey, ...props }: TransProps & OtherProps) => {
  // 提取用于翻译替换的字符串和数字值
  const replacement: typeof props = {};
  Object.entries(props).forEach(([key, value]) => {
    if (key !== "children") {
      replacement[key] = value;
    }
  });

  return createElement(
    Fragment,
    {},
    ...getTransChildren(t(i18nKey), replacement),
  );
};

export default Trans;
