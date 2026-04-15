import { getSettings, getString } from "@/lib/settings";

export async function AnnouncementBar() {
  const settings = await getSettings();
  const text = getString(settings, "announcement_text");
  const rawColor = getString(settings, "announcement_color");
  const color = rawColor.toLowerCase() === "#e53e3e" ? "#0F172A" : rawColor;

  if (!text) return null;

  return (
    <div
      data-announcement-bar="true"
      className="py-2 text-center text-sm font-medium text-white"
      style={{ backgroundColor: color || "#0F172A" }}
    >
      {text}
    </div>
  );
}
