import { PointerType } from "@swell-draw/swellDraw/types";
import clsx from "clsx";
import { CSSProperties, useRef } from "react";
import { useSwellDrawContext } from "../AppContext";
import "./ToolButton.scss";

export type ToolButtonSize = "small" | "medium";

interface ToolButtonBaseProps {
  icon?: React.ReactNode;
  /** 标签 - 可选的字符串，用于显示工具按钮的文本标签 */
  label?: string;
  /** 标题 - 可选的字符串，用于鼠标悬停时显示的提示文本 */
  title?: string;
  /** 无障碍标签 - 必需的字符串，为屏幕阅读器提供按钮的描述 */
  "aria-label": string;
  /** 快捷键说明 - 可选的字符串，描述该按钮的键盘快捷键 */
  "aria-keyshortcuts"?: string;
  /** 测试标识 - 可选的字符串，用于自动化测试时识别该元素 */
  "data-testid"?: string;
  /** 名称 - 可选的字符串，用于表单分组（特别是 radio 类型按钮） */
  /** 快捷键标签 - 可选的字符串或 null，用于在按钮上显示快捷键提示 */
  keyBindingLabel?: string | null;
  /** 显示无障碍标签 - 可选的布尔值，控制是否显示无障碍标签 */
  showAriaLabel?: boolean;
  name?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  size?: ToolButtonSize;
}

type ToolButtonProps =
  | (ToolButtonBaseProps & {
      type: "button";
      children?: React.ReactNode;
      onClick: () => void;
    })
  | (ToolButtonBaseProps & {
      type: "radio";
      checked: boolean;
      onChange?(data: { pointerType: PointerType | null }): void;
      onPointerDown?(data: { pointerType: PointerType }): void;
    });

const ToolButton = (props: ToolButtonProps) => {
  const { id: swellDrawId } = useSwellDrawContext();
  const { icon, title, className, type, size = "medium" } = props;
  const innerRef = useRef(null);
  const lastPointerTypeRef = useRef<PointerType | null>(null);
  const sizeCn = `ToolIcon_size_${size}`;

  if (type === "radio") {
    return (
      <label
        className={clsx("ToolIcon", className)}
        title={title}
        onPointerDown={(event) => {
          lastPointerTypeRef.current = event.pointerType || null;
          props.onPointerDown?.({ pointerType: event.pointerType || null });
        }}
        onPointerUp={() => {
          requestAnimationFrame(() => {
            lastPointerTypeRef.current = null;
          });
        }}
      >
        <input
          className={`ToolIcon_type_radio ${sizeCn}`}
          type="radio"
          name={props.name}
          aria-label={props["aria-label"]}
          aria-keyshortcuts={props["aria-keyshortcuts"]}
          data-testid={props["data-testid"]}
          id={`${swellDrawId}-${props.id}`}
          onChange={() => {
            props.onChange?.({ pointerType: lastPointerTypeRef.current });
          }}
          checked={props.checked}
          ref={innerRef}
        />
        <div className="ToolIcon__icon">
          {props.icon}
          {props.keyBindingLabel && (
            <span className="ToolIcon__keybinding">
              {props.keyBindingLabel}
            </span>
          )}
        </div>
      </label>
    );
  }

  return <button>{icon}</button>;
};

export default ToolButton;
