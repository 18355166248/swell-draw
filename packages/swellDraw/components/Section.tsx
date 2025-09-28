import { t } from "../i18n";
import { useSwellDrawContext } from "./AppContext";

/**
 * Section 组件 - 用于创建带有标题的可访问性区域
 * 这个组件为 SwellDraw 的各个功能区域提供语义化的 HTML 结构
 */
interface SectionProps {
  /** 区域标题类型，用于国际化 */
  heading: "canvasActions" | "selectedShapeActions" | "shapes";
  /** 子元素，可以是 React 节点或接收标题节点的函数 */
  children?: React.ReactNode | ((heading: React.ReactNode) => React.ReactNode);
  /** 额外的 CSS 类名 */
  className?: string;
}

const Section = ({ children, heading, ...otherProps }: SectionProps) => {
  const { id } = useSwellDrawContext();
  // 创建隐藏的标题元素，用于屏幕阅读器可访问性
  const header = (
    <h2 className="visually-hidden" id={`${id}-${heading}-title`}>
      {t(`headings.${heading}`)}
    </h2>
  );
  return (
    <section {...otherProps} aria-labelledby={`${id}-${heading}-title`}>
      {typeof children === "function" ? (
        // 如果 children 是函数，将标题作为参数传递
        children(header)
      ) : (
        // 如果 children 是普通节点，先渲染标题再渲染子元素
        <>
          {header}
          {children}
        </>
      )}
    </section>
  );
};

export default Section;
