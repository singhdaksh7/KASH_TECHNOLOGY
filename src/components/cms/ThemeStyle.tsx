import { getThemeConfig } from "@/lib/cms";
import { themeToCss } from "@/lib/theme/theme";

/** Emits the CSS-variable theme layer. Values are validated in resolveTheme(), so inlining is safe. */
export async function ThemeStyle() {
  const theme = await getThemeConfig();
  return <style id="kash-theme" dangerouslySetInnerHTML={{ __html: themeToCss(theme) }} />;
}
