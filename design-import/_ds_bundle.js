/* @ds-bundle: {"format":4,"namespace":"KeypadDesignSystem_1f1ec3","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Dialog","sourcePath":"components/overlay/Dialog.jsx"},{"name":"Toast","sourcePath":"components/overlay/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/overlay/Tooltip.jsx"},{"name":"Badge","sourcePath":"components/surfaces/Badge.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Tag","sourcePath":"components/surfaces/Tag.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"478c4fa66f5a","components/buttons/IconButton.jsx":"219c37405e99","components/forms/Checkbox.jsx":"8eac760862b6","components/forms/Input.jsx":"af4449157b48","components/forms/Radio.jsx":"09aa0d122225","components/forms/Select.jsx":"a6e85f1d893e","components/forms/Switch.jsx":"98fbbd8f8fef","components/navigation/Tabs.jsx":"3588cae1875b","components/overlay/Dialog.jsx":"d8c9c91bb1db","components/overlay/Toast.jsx":"9428685f6f88","components/overlay/Tooltip.jsx":"dfa392f88d44","components/surfaces/Badge.jsx":"d1ab6c6f5595","components/surfaces/Card.jsx":"5cdd15305406","components/surfaces/Tag.jsx":"1f7667cff611","ui_kits/admin-dashboard/ActivityChart.jsx":"be0016a2f577","ui_kits/admin-dashboard/QuizTable.jsx":"7a7145502735","ui_kits/admin-dashboard/Sidebar.jsx":"7bf775ddd68c","ui_kits/admin-dashboard/StatCards.jsx":"458bdab1eb47","ui_kits/admin-dashboard/Topbar.jsx":"5944f2fe1d53","ui_kits/quiz-app/QuestionScreen.jsx":"8e6edeb7a4ee","ui_kits/quiz-app/ResultsScreen.jsx":"9ead601a1376","ui_kits/quiz-app/StartScreen.jsx":"f85e8e98ea5c","ui_kits/quiz-live/LiveQuestion.jsx":"d1a9b326544a","ui_kits/quiz-live/Lobby.jsx":"659c2da548af","ui_kits/quiz-live/Podium.jsx":"704d53e5b56d","ui_kits/quiz-live/Reveal.jsx":"80dac6def658","ui_kits/website/Features.jsx":"e266ceebb029","ui_kits/website/Footer.jsx":"e0cac3f8b882","ui_kits/website/Hero.jsx":"6d3e923f992c","ui_kits/website/Pricing.jsx":"f3f40157b2b5"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.KeypadDesignSystem_1f1ec3 = window.KeypadDesignSystem_1f1ec3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
const sizeMap = {
  sm: {
    padding: '8px 16px',
    font: 'var(--font-label)',
    radius: 'var(--radius-sm)'
  },
  md: {
    padding: '12px 22px',
    font: '600 15px/1 var(--font-body)',
    radius: 'var(--radius-md)'
  },
  lg: {
    padding: '16px 30px',
    font: '600 17px/1 var(--font-body)',
    radius: 'var(--radius-md)'
  }
};
function variantStyle(variant, disabled) {
  if (disabled) {
    return {
      background: 'var(--grey-100)',
      color: 'var(--grey-300)',
      border: '2.5px solid var(--grey-200)',
      boxShadow: 'none'
    };
  }
  switch (variant) {
    case 'primary':
      return {
        background: 'var(--accent-primary)',
        color: 'var(--text-on-accent)',
        border: '2.5px solid var(--black)',
        boxShadow: 'var(--shadow-hard-md)'
      };
    case 'secondary':
      return {
        background: 'var(--white)',
        color: 'var(--black)',
        border: '2.5px solid var(--black)',
        boxShadow: 'var(--shadow-hard-md)'
      };
    case 'ghost':
      return {
        background: 'transparent',
        color: 'var(--black)',
        border: '2.5px solid transparent',
        boxShadow: 'none'
      };
    case 'danger':
      return {
        background: 'var(--semantic-danger)',
        color: '#fff',
        border: '2.5px solid var(--black)',
        boxShadow: 'var(--shadow-hard-md)'
      };
    default:
      return {};
  }
}

/**
 * Button — the core haptic control. Every press shrinks the hard shadow and
 * shifts the button toward it, then springs back on release.
 */
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon = null,
  children,
  onClick,
  style,
  ...rest
}) {
  const s = sizeMap[size] || sizeMap.md;
  const v = variantStyle(variant, disabled);
  const [pressed, setPressed] = React.useState(false);
  return React.createElement('button', {
    onClick: disabled ? undefined : onClick,
    disabled,
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    ...rest,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-body)',
      padding: s.padding,
      font: s.font,
      borderRadius: s.radius,
      ...v,
      transform: pressed && !disabled ? `translate(var(--press-translate),var(--press-translate)) scale(var(--press-scale))` : 'none',
      boxShadow: pressed && !disabled && v.boxShadow !== 'none' ? 'var(--shadow-hard-press)' : v.boxShadow,
      transition: `transform var(--duration-fast) var(--ease-out-back), box-shadow var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard)`,
      ...style
    }
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
const sizePx = {
  sm: 36,
  md: 44,
  lg: 52
};

/**
 * IconButton — square haptic control for a single icon action (close, toolbar,
 * step controls). Shares the same press signature as Button.
 */
function IconButton({
  variant = 'secondary',
  size = 'md',
  disabled = false,
  children,
  onClick,
  'aria-label': ariaLabel,
  style,
  ...rest
}) {
  const px = sizePx[size] || sizePx.md;
  const [pressed, setPressed] = React.useState(false);
  const filled = variant === 'primary';
  return React.createElement('button', {
    onClick: disabled ? undefined : onClick,
    disabled,
    'aria-label': ariaLabel,
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    ...rest,
    style: {
      width: px,
      height: px,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled ? 'var(--grey-100)' : filled ? 'var(--accent-primary)' : 'var(--white)',
      color: disabled ? 'var(--grey-300)' : filled ? 'var(--white)' : 'var(--black)',
      border: `2.5px solid ${disabled ? 'var(--grey-200)' : 'var(--black)'}`,
      boxShadow: disabled ? 'none' : pressed ? 'var(--shadow-hard-press)' : 'var(--shadow-hard-sm)',
      transform: pressed && !disabled ? 'translate(2px,2px) scale(var(--press-scale))' : 'none',
      transition: 'transform var(--duration-fast) var(--ease-out-back), box-shadow var(--duration-fast) var(--ease-standard)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/** Checkbox — square, thick-bordered; check fills with the accent color and a white mark, scale-pops on toggle. */
function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  style
}) {
  return React.createElement('label', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, React.createElement('span', {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 24,
      height: 24,
      borderRadius: 'var(--radius-sm)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `2.5px solid ${disabled ? 'var(--grey-300)' : 'var(--black)'}`,
      background: checked ? disabled ? 'var(--grey-300)' : 'var(--accent-primary)' : 'var(--white)',
      transition: 'transform var(--duration-fast) var(--ease-out-back), background var(--duration-fast) var(--ease-standard)',
      transform: checked ? 'scale(1.05)' : 'scale(1)'
    }
  }, checked && React.createElement('svg', {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#fff',
    strokeWidth: 3,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }, React.createElement('polyline', {
    points: '20 6 9 17 4 12'
  }))), label && React.createElement('span', {
    style: {
      font: 'var(--font-body-md)',
      color: disabled ? 'var(--text-muted)' : 'var(--black)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
/**
 * Input — text field. Border thickens/turns accent-colored on focus rather
 * than glowing; error state swaps border+helper text to red.
 */
function Input({
  label,
  placeholder,
  value,
  onChange,
  error,
  helper,
  disabled = false,
  type = 'text',
  style
}) {
  const [focused, setFocused] = React.useState(false);
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && React.createElement('label', {
    style: {
      font: 'var(--font-label)',
      color: 'var(--text-secondary)'
    }
  }, label), React.createElement('input', {
    type,
    placeholder,
    value,
    disabled,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      font: 'var(--font-body-lg)',
      padding: '12px 16px',
      borderRadius: 'var(--radius-md)',
      border: `2.5px solid ${error ? 'var(--semantic-danger)' : focused ? 'var(--accent-primary)' : 'var(--black)'}`,
      outline: 'none',
      background: disabled ? 'var(--grey-50)' : 'var(--white)',
      color: 'var(--black)',
      boxShadow: focused ? 'var(--shadow-focus-ring)' : 'none',
      transition: 'border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)'
    }
  }), (helper || error) && React.createElement('span', {
    style: {
      font: 'var(--font-body-sm)',
      color: error ? 'var(--semantic-danger)' : 'var(--text-muted)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
/**
 * Radio — used heavily as the quiz answer-option control: a full bordered row,
 * not just a dot, so tapping anywhere on the option selects it.
 */
function Radio({
  label,
  selected = false,
  onSelect,
  disabled = false,
  style
}) {
  return React.createElement('label', {
    onClick: () => !disabled && onSelect && onSelect(),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 18px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      borderRadius: 'var(--radius-md)',
      border: `2.5px solid ${selected ? 'var(--accent-primary)' : 'var(--black)'}`,
      background: selected ? 'var(--accent-primary-soft)' : 'var(--white)',
      fontFamily: 'var(--font-body)',
      transform: selected ? 'scale(1.015)' : 'scale(1)',
      transition: 'border-color var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-out-back)',
      ...style
    }
  }, React.createElement('span', {
    style: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      border: `2.5px solid ${selected ? 'var(--accent-primary)' : 'var(--black)'}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, selected && React.createElement('span', {
    style: {
      width: 11,
      height: 11,
      borderRadius: '50%',
      background: 'var(--accent-primary)'
    }
  })), React.createElement('span', {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--black)'
    }
  }, label));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
/** Select — native select dressed in the same bordered control shell as Input. */
function Select({
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  style
}) {
  const [focused, setFocused] = React.useState(false);
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && React.createElement('label', {
    style: {
      font: 'var(--font-label)',
      color: 'var(--text-secondary)'
    }
  }, label), React.createElement('select', {
    value,
    disabled,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      font: 'var(--font-body-lg)',
      padding: '12px 16px',
      borderRadius: 'var(--radius-md)',
      border: `2.5px solid ${focused ? 'var(--accent-primary)' : 'var(--black)'}`,
      outline: 'none',
      background: disabled ? 'var(--grey-50)' : 'var(--white)',
      color: 'var(--black)',
      boxShadow: focused ? 'var(--shadow-focus-ring)' : 'none',
      appearance: 'auto',
      transition: 'border-color var(--duration-fast) var(--ease-standard)'
    }
  }, options.map(o => React.createElement('option', {
    key: o.value ?? o,
    value: o.value ?? o
  }, o.label ?? o))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/** Switch — pill toggle, thumb springs across on change. */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  style
}) {
  return React.createElement('label', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, React.createElement('span', {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 48,
      height: 28,
      borderRadius: 'var(--radius-pill)',
      position: 'relative',
      flexShrink: 0,
      border: `2.5px solid ${disabled ? 'var(--grey-300)' : 'var(--black)'}`,
      background: checked ? disabled ? 'var(--grey-300)' : 'var(--accent-primary)' : 'var(--white)',
      transition: 'background var(--duration-fast) var(--ease-standard)'
    }
  }, React.createElement('span', {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 22 : 2,
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: checked ? '#fff' : 'var(--black)',
      transition: 'left var(--duration-base) var(--ease-out-back)'
    }
  })), label && React.createElement('span', {
    style: {
      font: 'var(--font-body-md)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/** Tabs — segmented control; selected tab slides with an overshoot ease. Generous padding for a softer feel. */
function Tabs({
  items = [],
  value,
  onChange,
  style
}) {
  return React.createElement('div', {
    style: {
      display: 'inline-flex',
      gap: 8,
      padding: 8,
      background: 'var(--surface-warm)',
      border: '2.5px solid var(--black)',
      borderRadius: 'var(--radius-lg)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, items.map(it => {
    const active = it === value || it.value === value;
    const label = it.label ?? it;
    const val = it.value ?? it;
    return React.createElement('button', {
      key: val,
      onClick: () => onChange && onChange(val),
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.background = 'var(--white)';
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      },
      style: {
        padding: '12px 26px',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        background: active ? 'var(--black)' : 'transparent',
        color: active ? 'var(--white)' : 'var(--black)',
        font: '600 15px/1 var(--font-body)',
        transition: 'background var(--duration-base) var(--ease-out-back), color var(--duration-base) var(--ease-standard), transform var(--duration-fast) var(--ease-out-back)',
        transform: active ? 'scale(1.02)' : 'scale(1)'
      }
    }, label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Dialog.jsx
try { (() => {
/** Dialog — modal with a flat (no blur) dark scrim and a hard-shadow bordered panel. */
function Dialog({
  open,
  title,
  children,
  onClose,
  actions,
  style
}) {
  if (!open) return null;
  return React.createElement('div', {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--surface-overlay)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    },
    onClick: onClose
  }, React.createElement('div', {
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--white)',
      border: '3px solid var(--black)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-hard-lg)',
      padding: 32,
      width: 420,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, title && React.createElement('div', {
    style: {
      font: 'var(--font-h4)',
      fontFamily: 'var(--font-display)',
      marginBottom: 12
    }
  }, title), React.createElement('div', {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--text-secondary)'
    }
  }, children), actions && React.createElement('div', {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 24,
      justifyContent: 'flex-end'
    }
  }, actions)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Toast.jsx
try { (() => {
const toneMap = {
  neutral: {
    bg: 'var(--black)',
    fg: 'var(--white)'
  },
  success: {
    bg: 'var(--semantic-success)',
    fg: '#fff'
  },
  danger: {
    bg: 'var(--semantic-danger)',
    fg: '#fff'
  }
};

/** Toast — brief bottom-of-screen confirmation; slides up with overshoot ease. */
function Toast({
  tone = 'neutral',
  children,
  style
}) {
  const t = toneMap[tone] || toneMap.neutral;
  return React.createElement('div', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 20px',
      borderRadius: 'var(--radius-md)',
      background: t.bg,
      color: t.fg,
      font: 'var(--font-body-md)',
      fontWeight: 600,
      fontFamily: 'var(--font-body)',
      boxShadow: 'var(--shadow-hard-sm)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Toast.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Tooltip.jsx
try { (() => {
/** Tooltip — small black label that appears above a trigger on hover. */
function Tooltip({
  label,
  children,
  style
}) {
  const [show, setShow] = React.useState(false);
  return React.createElement('span', {
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, show && React.createElement('span', {
    style: {
      position: 'absolute',
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--black)',
      color: 'var(--white)',
      padding: '6px 12px',
      borderRadius: 'var(--radius-sm)',
      font: 'var(--font-body-sm)',
      whiteSpace: 'nowrap',
      fontFamily: 'var(--font-body)',
      zIndex: 10
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Badge.jsx
try { (() => {
const toneMap = {
  neutral: {
    bg: 'var(--grey-100)',
    fg: 'var(--black)'
  },
  primary: {
    bg: 'var(--accent-primary-soft-strong)',
    fg: 'var(--accent-700)'
  },
  success: {
    bg: 'var(--semantic-success-soft)',
    fg: 'var(--semantic-success)'
  },
  danger: {
    bg: 'var(--semantic-danger-soft)',
    fg: 'var(--semantic-danger)'
  },
  warning: {
    bg: 'var(--semantic-warning-soft)',
    fg: 'var(--semantic-warning)'
  }
};

/** Badge — small filled-pill status indicator (score result, live state). No border. Pops in on mount. */
function Badge({
  tone = 'neutral',
  children,
  style
}) {
  const t = toneMap[tone] || toneMap.neutral;
  const [in_, setIn] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setIn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: 'var(--radius-pill)',
      background: t.bg,
      color: t.fg,
      font: 'var(--font-label)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      fontFamily: 'var(--font-body)',
      transform: in_ ? 'scale(1)' : 'scale(0.7)',
      opacity: in_ ? 1 : 0,
      transition: 'transform var(--duration-base) var(--ease-out-back), opacity var(--duration-fast) var(--ease-standard)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Badge.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
/** Card — bordered surface with the hard offset shadow; lifts slightly on hover. The default content container. */
function Card({
  children,
  padding = 28,
  interactive = false,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const lift = interactive && hover;
  return React.createElement('div', {
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: '2.5px solid var(--black)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: lift ? 'var(--shadow-hard-lg)' : 'var(--shadow-hard-md)',
      transform: lift ? 'translate(-2px,-2px)' : 'none',
      transition: 'box-shadow var(--duration-base) var(--ease-out-back), transform var(--duration-base) var(--ease-out-back)',
      padding,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Tag.jsx
try { (() => {
/** Tag — bordered, outline-style label chip; optionally removable. Distinct from Badge (filled, no border). */
function Tag({
  children,
  onRemove,
  style
}) {
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 12px 5px 14px',
      borderRadius: 'var(--radius-pill)',
      border: '2px solid var(--black)',
      background: 'var(--white)',
      font: 'var(--font-body-sm)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, children, onRemove && React.createElement('button', {
    onClick: onRemove,
    'aria-label': 'Remove',
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: 0,
      display: 'flex',
      color: 'var(--black)'
    }
  }, React.createElement('svg', {
    width: 12,
    height: 12,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 3,
    strokeLinecap: 'round'
  }, React.createElement('line', {
    x1: 4,
    y1: 4,
    x2: 20,
    y2: 20
  }), React.createElement('line', {
    x1: 20,
    y1: 4,
    x2: 4,
    y2: 20
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Tag.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin-dashboard/ActivityChart.jsx
try { (() => {
function ActivityChart() {
  const {
    Card
  } = window.KeypadDesignSystem_1f1ec3;
  const bars = [40, 62, 51, 78, 66, 90, 71];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [in_, setIn] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setIn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return /*#__PURE__*/React.createElement(Card, {
    padding: 28,
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-h4)',
      fontFamily: 'var(--font-display)',
      marginBottom: 24
    }
  }, "Plays this week"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 16,
      height: 160
    }
  }, bars.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
      background: i === 5 ? 'var(--accent-primary)' : 'var(--black)',
      height: in_ ? b + '%' : '0%',
      transition: `height 700ms var(--ease-out-back) ${i * 60}ms`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-body-sm)',
      color: 'var(--text-muted)'
    }
  }, days[i])))));
}
window.ActivityChart = ActivityChart;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin-dashboard/ActivityChart.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin-dashboard/QuizTable.jsx
try { (() => {
function QuizTable() {
  const {
    Badge,
    Tag,
    IconButton,
    Switch,
    Tabs
  } = window.KeypadDesignSystem_1f1ec3;
  const [filter, setFilter] = React.useState('All');
  const rows = [{
    name: 'World geography',
    category: 'Geography',
    players: 312,
    status: 'Live',
    tone: 'success'
  }, {
    name: 'Pop culture 2020s',
    category: 'Culture',
    players: 198,
    status: 'Draft',
    tone: 'neutral'
  }, {
    name: 'Startup trivia',
    category: 'Business',
    players: 84,
    status: 'Live',
    tone: 'success'
  }, {
    name: 'Space & astronomy',
    category: 'Science',
    players: 47,
    status: 'Paused',
    tone: 'warning'
  }];
  return /*#__PURE__*/React.createElement(Card_, {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-h4)',
      fontFamily: 'var(--font-display)'
    }
  }, "Your quizzes"), /*#__PURE__*/React.createElement(Tabs, {
    items: ['All', 'Live', 'Draft'],
    value: filter,
    onChange: setFilter
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 100px 60px',
      padding: '10px 16px',
      color: 'var(--text-muted)',
      font: 'var(--font-label)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)'
    }
  }, /*#__PURE__*/React.createElement("div", null, "Name"), /*#__PURE__*/React.createElement("div", null, "Category"), /*#__PURE__*/React.createElement("div", null, "Players"), /*#__PURE__*/React.createElement("div", null, "Status"), /*#__PURE__*/React.createElement("div", null, "Live"), /*#__PURE__*/React.createElement("div", null)), rows.filter(r => filter === 'All' || r.status === filter).map(r => /*#__PURE__*/React.createElement("div", {
    key: r.name,
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 100px 60px',
      alignItems: 'center',
      padding: '16px',
      borderTop: '2px solid var(--grey-100)',
      borderRadius: 'var(--radius-sm)',
      transition: 'background var(--duration-fast) var(--ease-standard)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--beige-50)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, r.name), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Tag, null, r.category)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-mono-md)'
    }
  }, r.players), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    tone: r.tone
  }, r.status)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Switch, {
    checked: r.status === 'Live',
    onChange: () => {}
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(IconButton, {
    size: "sm",
    variant: "secondary",
    "aria-label": "More"
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://unpkg.com/lucide-static@latest/icons/more-horizontal.svg",
    width: "16",
    height: "16"
  })))))));
}
function Card_(props) {
  const {
    Card
  } = window.KeypadDesignSystem_1f1ec3;
  return /*#__PURE__*/React.createElement(Card, props);
}
window.QuizTable = QuizTable;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin-dashboard/QuizTable.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin-dashboard/Sidebar.jsx
try { (() => {
function Sidebar({
  active
}) {
  const items = [{
    k: 'overview',
    label: 'Overview',
    icon: 'layout-grid'
  }, {
    k: 'quizzes',
    label: 'Quizzes',
    icon: 'list-checks'
  }, {
    k: 'players',
    label: 'Players',
    icon: 'users'
  }, {
    k: 'reports',
    label: 'Reports',
    icon: 'bar-chart-3'
  }, {
    k: 'settings',
    label: 'Settings',
    icon: 'settings'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 240,
      flexShrink: 0,
      borderRight: '2.5px solid var(--black)',
      background: 'var(--beige-50)',
      padding: '28px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      height: '100%',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 22,
      marginBottom: 28,
      padding: '0 8px'
    }
  }, "Keypad"), items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.k,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 14px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      background: it.k === active ? 'var(--black)' : 'transparent',
      color: it.k === active ? 'var(--white)' : 'var(--black)',
      fontWeight: 600,
      fontSize: 15,
      transition: 'background var(--duration-base) var(--ease-out-back), transform var(--duration-fast) var(--ease-out-back)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `https://unpkg.com/lucide-static@latest/icons/${it.icon}.svg`,
    width: "18",
    height: "18",
    style: {
      filter: it.k === active ? 'invert(1)' : 'none'
    }
  }), it.label)));
}
window.Sidebar = Sidebar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin-dashboard/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin-dashboard/StatCards.jsx
try { (() => {
function AnimatedNumber({
  value,
  duration = 900
}) {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    }
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [value]);
  return n;
}
function StatCards() {
  const {
    Card,
    Badge
  } = window.KeypadDesignSystem_1f1ec3;
  const stats = [{
    label: 'Quizzes played',
    value: 4820,
    delta: '+12%',
    tone: 'success'
  }, {
    label: 'Active players',
    value: 963,
    delta: '+4%',
    tone: 'success'
  }, {
    label: 'Avg. score',
    value: 74,
    suffix: '%',
    delta: '-2%',
    tone: 'warning'
  }, {
    label: 'Completion rate',
    value: 91,
    suffix: '%',
    delta: '+1%',
    tone: 'success'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 24,
      padding: '32px 40px'
    }
  }, stats.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.label,
    interactive: true,
    padding: 24
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-muted)',
      font: 'var(--font-label)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)',
      marginBottom: 14
    }
  }, s.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 40px/1 var(--font-mono)'
    }
  }, /*#__PURE__*/React.createElement(AnimatedNumber, {
    value: s.value
  }), s.suffix || ''), /*#__PURE__*/React.createElement(Badge, {
    tone: s.tone
  }, s.delta)))));
}
window.StatCards = StatCards;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin-dashboard/StatCards.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin-dashboard/Topbar.jsx
try { (() => {
function Topbar() {
  const {
    Button,
    IconButton
  } = window.KeypadDesignSystem_1f1ec3;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 40px',
      borderBottom: '2.5px solid var(--black)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-h3)',
      fontFamily: 'var(--font-display)'
    }
  }, "Overview"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-muted)',
      marginTop: 4
    }
  }, "Tuesday, August 18")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "Notifications"
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://unpkg.com/lucide-static@latest/icons/bell.svg",
    width: "18",
    height: "18"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "New quiz")));
}
window.Topbar = Topbar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin-dashboard/Topbar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quiz-app/QuestionScreen.jsx
try { (() => {
const QUESTIONS = [{
  q: 'What is the capital of France?',
  options: ['Lyon', 'Paris', 'Marseille', 'Nice'],
  correct: 'Paris'
}, {
  q: 'Which is the largest country by area?',
  options: ['China', 'USA', 'Russia', 'Canada'],
  correct: 'Russia'
}, {
  q: 'Mount Kilimanjaro is located in which country?',
  options: ['Kenya', 'Tanzania', 'Uganda', 'Ethiopia'],
  correct: 'Tanzania'
}];
window.QUIZ_QUESTIONS = QUESTIONS;
function QuestionScreen({
  index,
  total,
  onAnswer
}) {
  const {
    Button,
    IconButton
  } = window.KeypadDesignSystem_1f1ec3;
  const [selected, setSelected] = React.useState(null);
  const [seconds, setSeconds] = React.useState(20);
  const question = QUESTIONS[index % QUESTIONS.length];
  React.useEffect(() => {
    setSelected(null);
    setSeconds(20);
    const t = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [index]);
  const pct = index / total * 100;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '20px 32px',
      borderBottom: '2.5px solid var(--black)'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "Close",
    size: "sm"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 12,
      background: 'var(--grey-100)',
      borderRadius: 'var(--radius-pill)',
      border: '2px solid var(--black)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: pct + '%',
      background: 'var(--accent-primary)',
      transition: 'width var(--duration-base) var(--ease-out-back)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-mono-md)',
      color: 'var(--black)',
      minWidth: 70,
      textAlign: 'right'
    }
  }, String(seconds).padStart(2, '0'), "s")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-label)',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-widest)',
      marginBottom: 16
    }
  }, "Question ", index + 1, " of ", total), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-h3)',
      fontFamily: 'var(--font-display)',
      textAlign: 'center',
      maxWidth: 560,
      marginBottom: 36
    }
  }, question.q), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      width: '100%',
      maxWidth: 480
    }
  }, question.options.map(opt => {
    const {
      Radio
    } = window.KeypadDesignSystem_1f1ec3;
    return /*#__PURE__*/React.createElement(Radio, {
      key: opt,
      label: opt,
      selected: selected === opt,
      onSelect: () => setSelected(opt)
    });
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 32px',
      borderTop: '2.5px solid var(--black)',
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "primary",
    disabled: !selected,
    onClick: () => onAnswer(selected === question.correct)
  }, index + 1 === total ? 'See results' : 'Next question')));
}
window.QuestionScreen = QuestionScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quiz-app/QuestionScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quiz-app/ResultsScreen.jsx
try { (() => {
function ResultsScreen({
  score,
  total,
  onRetry
}) {
  const {
    Button,
    Badge
  } = window.KeypadDesignSystem_1f1ec3;
  const good = score >= total * 0.6;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      textAlign: 'center',
      background: 'var(--black)',
      color: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: good ? 'success' : 'warning',
    style: {
      marginBottom: 24
    }
  }, good ? 'Nice work' : 'Worth another go'), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 96px/1 var(--font-mono)',
      color: 'var(--white)',
      marginBottom: 16
    }
  }, score, "/", total), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--grey-300)',
      marginBottom: 40,
      maxWidth: 420
    }
  }, good ? 'Solid run. You beat most first attempts.' : 'A few tricky ones — the map never lies twice.'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "primary",
    onClick: onRetry
  }, "Try again"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    style: {
      background: 'transparent',
      color: 'var(--white)',
      border: '2.5px solid var(--white)',
      boxShadow: '5px 5px 0 var(--white)'
    }
  }, "See all quizzes")));
}
window.ResultsScreen = ResultsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quiz-app/ResultsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quiz-app/StartScreen.jsx
try { (() => {
function StartScreen({
  onStart
}) {
  const {
    Button,
    Badge,
    Tag
  } = window.KeypadDesignSystem_1f1ec3;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      textAlign: 'center',
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "primary",
    style: {
      marginBottom: 20
    }
  }, "New this week"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-h1)',
      fontFamily: 'var(--font-display)',
      color: 'var(--black)',
      marginBottom: 16,
      maxWidth: 640
    }
  }, "World geography"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--text-secondary)',
      marginBottom: 28,
      maxWidth: 480
    }
  }, "10 questions. About 5 minutes. Answer fast \u2014 speed counts toward your score."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement(Tag, null, "Geography"), /*#__PURE__*/React.createElement(Tag, null, "Medium"), /*#__PURE__*/React.createElement(Tag, null, "10 questions")), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "primary",
    onClick: onStart
  }, "Start quiz"));
}
window.StartScreen = StartScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quiz-app/StartScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quiz-live/LiveQuestion.jsx
try { (() => {
const LIVE_QUESTIONS = [{
  q: 'Which planet has the most moons?',
  options: [{
    label: 'Saturn',
    shape: 'triangle',
    color: 'var(--semantic-danger)'
  }, {
    label: 'Jupiter',
    shape: 'diamond',
    color: 'var(--accent-primary)'
  }, {
    label: 'Uranus',
    shape: 'circle',
    color: 'var(--amber-500)'
  }, {
    label: 'Neptune',
    shape: 'square',
    color: 'var(--semantic-success)'
  }],
  correct: 0
}, {
  q: 'What year did the first iPhone launch?',
  options: [{
    label: '2005',
    shape: 'triangle',
    color: 'var(--semantic-danger)'
  }, {
    label: '2007',
    shape: 'diamond',
    color: 'var(--accent-primary)'
  }, {
    label: '2009',
    shape: 'circle',
    color: 'var(--amber-500)'
  }, {
    label: '2011',
    shape: 'square',
    color: 'var(--semantic-success)'
  }],
  correct: 1
}];
window.LIVE_QUESTIONS = LIVE_QUESTIONS;
function CountdownRing({
  seconds,
  total
}) {
  const r = 36,
    c = 2 * Math.PI * r;
  const pct = seconds / total;
  return /*#__PURE__*/React.createElement("svg", {
    width: "88",
    height: "88",
    viewBox: "0 0 88 88"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "44",
    cy: "44",
    r: r,
    fill: "none",
    stroke: "rgba(255,255,255,.25)",
    strokeWidth: "8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "44",
    cy: "44",
    r: r,
    fill: "none",
    stroke: "var(--accent-400)",
    strokeWidth: "8",
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: c * (1 - pct),
    transform: "rotate(-90 44 44)",
    style: {
      transition: 'stroke-dashoffset 1s linear'
    }
  }), /*#__PURE__*/React.createElement("text", {
    x: "44",
    y: "50",
    textAnchor: "middle",
    fill: "#fff",
    fontSize: "24",
    fontFamily: "var(--font-mono)",
    fontWeight: "700"
  }, seconds));
}
function LiveQuestion({
  index,
  total,
  onDone
}) {
  const question = LIVE_QUESTIONS[index % LIVE_QUESTIONS.length];
  const [seconds, setSeconds] = React.useState(10);
  const [picked, setPicked] = React.useState(null);
  React.useEffect(() => {
    setSeconds(10);
    setPicked(null);
    const t = setInterval(() => setSeconds(s => {
      if (s <= 1) {
        clearInterval(t);
        return 0;
      }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [index]);
  React.useEffect(() => {
    if (seconds === 0) {
      const id = setTimeout(() => onDone(picked === question.correct), 700);
      return () => clearTimeout(id);
    }
  }, [seconds]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--black)',
      color: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-label)',
      color: 'var(--grey-300)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-widest)'
    }
  }, "Question ", index + 1, " of ", total), /*#__PURE__*/React.createElement(CountdownRing, {
    seconds: seconds,
    total: 10
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-h2)',
      fontFamily: 'var(--font-display)',
      textAlign: 'center',
      maxWidth: 760
    }
  }, question.q)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      padding: '0 40px 40px'
    }
  }, question.options.map((o, i) => {
    const isPicked = picked === i;
    const revealed = seconds === 0;
    const isCorrect = i === question.correct;
    const dim = revealed && !isCorrect;
    return /*#__PURE__*/React.createElement("button", {
      key: o.label,
      disabled: picked !== null || revealed,
      onClick: () => setPicked(i),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '28px 32px',
        border: 'none',
        borderRadius: 'var(--radius-lg)',
        background: o.color,
        color: '#fff',
        font: '700 22px/1 var(--font-display)',
        cursor: 'pointer',
        textAlign: 'left',
        opacity: dim ? 0.35 : 1,
        transform: isPicked ? 'scale(0.97)' : revealed && isCorrect ? 'scale(1.03)' : 'scale(1)',
        boxShadow: isPicked || revealed && isCorrect ? '0 0 0 5px rgba(255,255,255,.5)' : 'none',
        transition: 'transform 200ms var(--ease-out-back), opacity 300ms var(--ease-standard), box-shadow 200ms var(--ease-standard)'
      }
    }, o.label);
  })));
}
window.LiveQuestion = LiveQuestion;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quiz-live/LiveQuestion.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quiz-live/Lobby.jsx
try { (() => {
function Lobby({
  onLaunch
}) {
  const {
    Button,
    Badge
  } = window.KeypadDesignSystem_1f1ec3;
  const players = ['Nadia', 'Theo', 'Priya', 'Marcus', 'Elin', 'Sam'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px',
      background: 'var(--black)',
      color: 'var(--white)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-label)',
      color: 'var(--accent-400)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-widest)',
      marginBottom: 16
    }
  }, "Game PIN"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 96px/1 var(--font-mono)',
      marginBottom: 40,
      letterSpacing: '0.08em'
    }
  }, "482 917"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      justifyContent: 'center',
      maxWidth: 560,
      marginBottom: 44
    }
  }, players.map((p, i) => /*#__PURE__*/React.createElement("span", {
    key: p,
    style: {
      padding: '10px 20px',
      borderRadius: 'var(--radius-pill)',
      border: '2.5px solid var(--white)',
      fontWeight: 600,
      opacity: 0,
      animation: `kp-pop 400ms var(--ease-out-back) ${i * 90}ms forwards`
    }
  }, p))), /*#__PURE__*/React.createElement(Badge, {
    tone: "primary",
    style: {
      marginBottom: 28
    }
  }, players.length, " players joined"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "primary",
    onClick: onLaunch
  }, "Start game"), /*#__PURE__*/React.createElement("style", null, `@keyframes kp-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}`));
}
window.Lobby = Lobby;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quiz-live/Lobby.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quiz-live/Podium.jsx
try { (() => {
function Podium({
  onRestart
}) {
  const {
    Button
  } = window.KeypadDesignSystem_1f1ec3;
  const results = [{
    name: 'Priya',
    score: 4820,
    place: 1
  }, {
    name: 'Theo',
    score: 4310,
    place: 2
  }, {
    name: 'Nadia',
    score: 3960,
    place: 3
  }];
  const heights = {
    1: 200,
    2: 150,
    3: 110
  };
  const order = [2, 1, 3];
  const [in_, setIn] = React.useState(false);
  React.useEffect(() => {
    const id = setTimeout(() => setIn(true), 150);
    return () => clearTimeout(id);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 40px',
      background: 'var(--black)',
      color: 'var(--white)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-h2)',
      fontFamily: 'var(--font-display)',
      marginBottom: 48
    }
  }, "Final results"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 24,
      marginBottom: 48
    }
  }, order.map(place => {
    const r = results.find(x => x.place === place);
    return /*#__PURE__*/React.createElement("div", {
      key: place,
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700
      }
    }, r.name), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--font-mono-md)',
        color: 'var(--grey-300)'
      }
    }, r.score.toLocaleString()), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 120,
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        background: place === 1 ? 'var(--accent-primary)' : 'var(--grey-700)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        font: '700 32px/1 var(--font-display)',
        height: in_ ? heights[place] : 0,
        transition: `height 700ms var(--ease-out-back) ${(3 - place) * 150}ms`
      }
    }, place));
  })), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "primary",
    onClick: onRestart
  }, "Play again"));
}
window.Podium = Podium;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quiz-live/Podium.jsx", error: String((e && e.message) || e) }); }

// ui_kits/quiz-live/Reveal.jsx
try { (() => {
function Reveal({
  correct,
  streak,
  onNext
}) {
  const {
    Button,
    Badge
  } = window.KeypadDesignSystem_1f1ec3;
  const counts = [38, 61, 22, 44];
  const [in_, setIn] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setIn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const max = Math.max(...counts);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 40px',
      background: 'var(--black)',
      color: 'var(--white)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      height: 96,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      background: correct ? 'var(--semantic-success)' : 'var(--semantic-danger)',
      animation: 'kp-bounce-in 500ms var(--ease-out-back)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 44
    }
  }, correct ? '✓' : '✕')), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-h3)',
      fontFamily: 'var(--font-display)',
      marginBottom: 8
    }
  }, correct ? 'Correct!' : 'Not quite'), correct && /*#__PURE__*/React.createElement(Badge, {
    tone: "primary",
    style: {
      marginBottom: 36
    }
  }, "Streak \xD7", streak), !correct && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 36,
      marginBottom: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-end',
      height: 120,
      marginBottom: 44
    }
  }, counts.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 44,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-mono-md)',
      color: 'var(--grey-300)'
    }
  }, c), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      borderRadius: '6px 6px 0 0',
      background: ['var(--semantic-danger)', 'var(--accent-primary)', 'var(--amber-500)', 'var(--semantic-success)'][i],
      height: in_ ? c / max * 100 + 'px' : '0px',
      transition: `height 600ms var(--ease-out-back) ${i * 70}ms`
    }
  })))), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "primary",
    onClick: onNext
  }, "Next question"), /*#__PURE__*/React.createElement("style", null, `@keyframes kp-bounce-in{0%{transform:scale(0)}70%{transform:scale(1.15)}100%{transform:scale(1)}}`));
}
window.Reveal = Reveal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/quiz-live/Reveal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Features.jsx
try { (() => {
function Features() {
  const {
    Card
  } = window.KeypadDesignSystem_1f1ec3;
  const items = [{
    t: 'Instant scoring',
    d: 'Every answer is graded the moment it lands — no waiting on a spreadsheet.'
  }, {
    t: 'Live leaderboards',
    d: 'Watch rank shift in real time as a group answers together.'
  }, {
    t: 'Built for speed',
    d: 'Timers, streaks, and haptic feedback keep every question snappy.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '96px 24px',
      borderBottom: '2.5px solid var(--black)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 32,
      maxWidth: 1080,
      margin: '0 auto'
    }
  }, items.map(it => /*#__PURE__*/React.createElement(Card, {
    key: it.t,
    interactive: true,
    style: {
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-h4)',
      fontFamily: 'var(--font-display)',
      marginBottom: 12
    }
  }, it.t), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-secondary)',
      font: 'var(--font-body-md)'
    }
  }, it.d)))));
}
window.Features = Features;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Features.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
function Footer() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '32px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: 1000,
      margin: '0 auto',
      font: 'var(--font-body-sm)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--black)'
    }
  }, "Keypad"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Product"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Pricing"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Support")));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
function Hero() {
  const {
    Button,
    Tag
  } = window.KeypadDesignSystem_1f1ec3;
  const [in_, setIn] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setIn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const rise = {
    transform: in_ ? 'translateY(0)' : 'translateY(16px)',
    opacity: in_ ? 1 : 0,
    transition: 'transform 500ms var(--ease-out-back), opacity 400ms var(--ease-standard)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '120px 24px 104px',
      textAlign: 'center',
      borderBottom: '2.5px solid var(--black)',
      background: 'var(--beige-50)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 12,
      marginBottom: 32,
      ...rise
    }
  }, /*#__PURE__*/React.createElement(Tag, null, "Quizzes"), /*#__PURE__*/React.createElement(Tag, null, "Trivia"), /*#__PURE__*/React.createElement(Tag, null, "Teams")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-h1)',
      fontFamily: 'var(--font-display)',
      maxWidth: 760,
      margin: '0 auto 24px',
      ...rise,
      transitionDelay: '60ms'
    }
  }, "Quizzes that feel like pressing a button, not filling a form."), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-body-lg)',
      color: 'var(--text-secondary)',
      maxWidth: 520,
      margin: '0 auto 44px',
      ...rise,
      transitionDelay: '120ms'
    }
  }, "Build a quiz in minutes. Share a link. Watch answers come in live."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      justifyContent: 'center',
      ...rise,
      transitionDelay: '180ms'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "primary"
  }, "Create a quiz"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary"
  }, "See examples")));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Pricing.jsx
try { (() => {
function Pricing() {
  const {
    Card,
    Button,
    Badge,
    Tabs
  } = window.KeypadDesignSystem_1f1ec3;
  const [cycle, setCycle] = React.useState('Monthly');
  const plans = [{
    name: 'Free',
    price: '$0',
    d: 'For trying it out.',
    cta: 'Start free'
  }, {
    name: 'Pro',
    price: cycle === 'Monthly' ? '$12/mo' : '$9/mo',
    d: 'For teams running quizzes weekly.',
    cta: 'Start Pro',
    highlight: true
  }, {
    name: 'Org',
    price: 'Contact us',
    d: 'For large groups and SSO.',
    cta: 'Talk to us'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '96px 24px',
      borderBottom: '2.5px solid var(--black)',
      textAlign: 'center',
      background: 'var(--beige-50)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-h2)',
      fontFamily: 'var(--font-display)',
      marginBottom: 28
    }
  }, "Pricing"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    items: ['Monthly', 'Yearly'],
    value: cycle,
    onChange: setCycle
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 32,
      maxWidth: 1080,
      margin: '0 auto',
      textAlign: 'left'
    }
  }, plans.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.name,
    style: p.highlight ? {
      border: '2.5px solid var(--accent-primary)',
      boxShadow: 'var(--shadow-hard-accent-md)'
    } : {}
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-h4)',
      fontFamily: 'var(--font-display)'
    }
  }, p.name), p.highlight && /*#__PURE__*/React.createElement(Badge, {
    tone: "primary"
  }, "Popular")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 32px/1 var(--font-mono)',
      marginBottom: 14
    }
  }, p.price), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-secondary)',
      marginBottom: 20
    }
  }, p.d), /*#__PURE__*/React.createElement(Button, {
    variant: p.highlight ? 'primary' : 'secondary',
    style: {
      width: '100%'
    }
  }, p.cta)))));
}
window.Pricing = Pricing;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Pricing.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tag = __ds_scope.Tag;

})();
