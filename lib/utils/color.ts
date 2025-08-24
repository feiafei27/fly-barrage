/**
 * 判断 color 是不是人眼可见
 * @param color 颜色字符串
 */
function isVisibleColor(color: string) {
  // 处理空值或非字符串输入（视为不可见）
  if (!color) {
    return false;
  }

  const trimmedColor = color.trim().toLowerCase();

  // transparent 关键字视为不可见
  if (trimmedColor === 'transparent') {
    return false;
  }

  // 处理 rgba 格式
  const rgbaMatch = color.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/i);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10);
    const g = parseInt(rgbaMatch[2], 10);
    const b = parseInt(rgbaMatch[3], 10);
    // 验证 RGB 值有效性，且 alpha > 0 视为可见
    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      const alpha = parseFloat(rgbaMatch[4]);
      return alpha > 0;
    }
  }

  // 处理 hsla 格式
  const hslaMatch = color.match(/^hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d.]+)\s*\)$/i);
  if (hslaMatch) {
    const h = parseInt(hslaMatch[1], 10);
    const s = parseInt(hslaMatch[2], 10);
    const l = parseInt(hslaMatch[3], 10);
    // 验证 HSL 值有效性，且 alpha > 0 视为可见
    if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
      const alpha = parseFloat(hslaMatch[4]);
      return alpha > 0;
    }
  }

  // 处理 rgb 格式（无 alpha 通道，默认可见）
  const rgbMatch = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    // 验证 RGB 值有效性，有效则视为可见
    return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
  }

  // 处理十六进制颜色（#RRGGBB, #RGB, #RRGGBBAA, #RGBA）
  const hexMatch = color.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hexMatch) {
    const hex = hexMatch[1].toLowerCase();
    let alphaHex = 'ff'; // 默认不透明

    // 提取透明度部分
    if (hex.length === 4) {
      alphaHex = hex[3] + hex[3]; // #RGBA 格式
    } else if (hex.length === 8) {
      alphaHex = hex.substring(6, 8); // #RRGGBBAA 格式
    }

    // alpha > 0 视为可见
    const alpha = parseInt(alphaHex, 16) / 255;
    return alpha > 0;
  }

  // 处理 hsl 格式（无 alpha 通道，默认可见）
  const hslMatch = color.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i);
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10);
    const s = parseInt(hslMatch[2], 10);
    const l = parseInt(hslMatch[3], 10);
    // 验证 HSL 值有效性，有效则视为可见
    return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
  }

  // 处理颜色名称（除 transparent 外均视为可见）
  // 注：实际应用中可扩展为完整的 CSS 颜色名称列表验证
  const validColorNames = new Set([
    'white', 'black', 'red', 'green', 'blue', 'yellow',
    'purple', 'orange', 'pink', 'gray', 'grey', 'cyan', 'magenta'
  ]);
  return validColorNames.has(trimmedColor);
}

export default {
  isVisibleColor,
}