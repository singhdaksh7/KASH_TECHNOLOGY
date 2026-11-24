"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useToast } from "@/components/admin/ToastContext";
import { newId } from "@/lib/admin-client/ids";
import { adminClient, errorMessage, type ArticleItem } from "@/lib/admin-client";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { Plus, Trash2 } from "lucide-react";

const blank = (): ArticleItem => ({
  id: newId("new"), title: "", slug: "", status: "Draft", excerpt: "", category: "Technology for Businesses", authorName: "KASH Technology", authorRole: "",
  cover: "", publishedAt: new Date().toISOString().slice(0, 10), readTime: "5 min read", body: "", relatedSlugs: [], updatedAt: "",
  seo: { title: "", metaDescription: "", slug: "", canonicalUrl: "", focusKeyword: "", secondaryKeywords: "", ogTitle: "", ogDescription: "", ogImage: "", index: true, follow: true },
});

const input = "w-full px-3 py-2 border border-[#E8E5E2] rounded-lg text-xs focus:outline-none focus:border-[#FF5A00]";

export default function InsightsAdminPage() {
  const { addToast } = useToast();
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [sel, setSel] = useState<ArticleItem | null>(null);
  const [pickCover, setPickCover] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { setArticles(await adminClient.getArticles()); } catch (e) { addToast({ title: "Could not load articles", message: errorMessage(e), type: "error" }); }
  };
  useEffect(() => {
    let alive = true;
    adminClient.getArticles().then((d) => alive && setArticles(d)).catch(() => undefined);
    return () => { alive = false; };
  }, []);

  const save = async (status: ArticleItem["status"]) => {
    if (!sel) return;
    setSaving(true);
    try {
      const saved = await adminClient.saveArticle({ ...sel, status });
      setSel(saved);
      await load();
      addToast({ title: status === "Published" ? "Article published" : "Draft saved", message: saved.title, type: "success" });
    } catch (e) {
      addToast({ title: "Save failed", message: errorMessage(e), type: "error" });
    } finally { setSaving(false); }
  };
  const remove = async () => {
    if (!sel || !confirm(`Delete "${sel.title}"?`)) return;
    try { if (!sel.id.startsWith("new-")) await adminClient.deleteArticle(sel.id); setSel(null); await load(); } catch (e) { addToast({ title: "Delete failed", message: errorMessage(e), type: "error" }); }
  };
  const set = <K extends keyof ArticleItem>(k: K, v: ArticleItem[K]) => sel && setSel({ ...sel, [k]: v });
  const setSeo = (k: keyof ArticleItem["seo"], v: string | boolean) => sel && setSel({ ...sel, seo: { ...sel.seo, [k]: v } });

  return (
    <div className="space-y-6">
      <AdminHeader title="Insights" subtitle="Articles shown on /insights. Content falls back to the built-in articles until published articles exist." breadcrumbs={[{ label: "Content" }, { label: "Insights" }]}
        actions={<button onClick={() => setSel(blank())} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF5A00] text-white text-xs font-bold"><Plus className="w-3.5 h-3.5" />New article</button>} />
      <div className="px-4 sm:px-6 grid gap-5 lg:grid-cols-[320px_1fr] items-start">
        <ul className="bg-white rounded-xl border border-[#E8E5E2] divide-y divide-[#E8E5E2] shadow-xs">
          {articles.map((a) => (
            <li key={a.id}><button onClick={() => setSel(a)} className={`w-full text-left p-3 text-xs hover:bg-[#FFF9F4] ${sel?.id === a.id ? "bg-[#FFF3E9]" : ""}`}>
              <b className="block">{a.title}</b><span className="text-stone-500">{a.category} · {a.status}</span></button></li>
          ))}
          {!articles.length && <li className="p-4 text-xs text-stone-400">No articles stored yet.</li>}
        </ul>
        {sel ? (
          <div className="bg-white rounded-xl border border-[#E8E5E2] p-5 shadow-xs space-y-3 text-xs">
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="font-semibold">Title<input className={`${input} mt-1`} value={sel.title} onChange={(e) => set("title", e.target.value)} /></label>
              <label className="font-semibold">Slug<input className={`${input} mt-1 font-mono`} value={sel.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} /></label>
              <label className="font-semibold">Category<input className={`${input} mt-1`} value={sel.category} onChange={(e) => set("category", e.target.value)} /></label>
              <label className="font-semibold">Published (date or label)<input className={`${input} mt-1`} value={sel.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} /></label>
              <label className="font-semibold">Author<input className={`${input} mt-1`} value={sel.authorName} onChange={(e) => set("authorName", e.target.value)} /></label>
              <label className="font-semibold">Author role<input className={`${input} mt-1`} value={sel.authorRole} onChange={(e) => set("authorRole", e.target.value)} /></label>
              <label className="font-semibold">Read time<input className={`${input} mt-1`} value={sel.readTime} onChange={(e) => set("readTime", e.target.value)} /></label>
              <label className="font-semibold">Related slugs (comma separated)<input className={`${input} mt-1 font-mono`} value={sel.relatedSlugs.join(",")} onChange={(e) => set("relatedSlugs", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} /></label>
            </div>
            <label className="block font-semibold">Excerpt<textarea rows={2} className={`${input} mt-1`} value={sel.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></label>
            <div className="font-semibold">Cover image
              <div className="flex gap-2 mt-1"><input className={`${input} font-mono`} value={sel.cover} onChange={(e) => set("cover", e.target.value)} /><button type="button" onClick={() => setPickCover(true)} className="px-3 bg-[#FFF3E9] text-[#FF5A00] rounded-lg font-semibold">Browse</button></div></div>
            <label className="block font-semibold">Body (blank line between paragraphs; basic HTML is sanitised)<textarea rows={12} className={`${input} mt-1`} value={sel.body} onChange={(e) => set("body", e.target.value)} /></label>
            <fieldset className="grid sm:grid-cols-2 gap-3 border-t border-[#E8E5E2] pt-3"><legend className="font-bold uppercase tracking-wider text-[10px] text-stone-400 pb-1">SEO</legend>
              <label className="font-semibold">SEO title<input className={`${input} mt-1`} value={sel.seo.title} onChange={(e) => setSeo("title", e.target.value)} /></label>
              <label className="font-semibold">Meta description<input className={`${input} mt-1`} value={sel.seo.metaDescription} onChange={(e) => setSeo("metaDescription", e.target.value)} /></label>
              <label className="font-semibold">OG image<input className={`${input} mt-1 font-mono`} value={sel.seo.ogImage} onChange={(e) => setSeo("ogImage", e.target.value)} /></label>
              <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={sel.seo.index} onChange={(e) => setSeo("index", e.target.checked)} />Allow indexing</label>
            </fieldset>
            <div className="flex gap-2 pt-2">
              <button disabled={saving} onClick={() => save("Draft")} className="px-4 py-2 bg-stone-100 rounded-lg font-semibold">Save draft</button>
              <button disabled={saving} onClick={() => save("Published")} className="px-4 py-2 bg-[#FF5A00] text-white rounded-lg font-bold">Publish</button>
              <button onClick={remove} className="ml-auto text-red-600 flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" />Delete</button>
            </div>
            <MediaPickerModal isOpen={pickCover} onClose={() => setPickCover(false)} onSelect={(m) => { set("cover", m.url); setPickCover(false); }} />
          </div>
        ) : <p className="text-xs text-stone-400">Select or create an article.</p>}
      </div>
    </div>
  );
}
