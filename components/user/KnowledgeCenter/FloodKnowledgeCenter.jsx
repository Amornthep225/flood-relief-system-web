"use client";

import { useMemo, useState } from "react";

const KNOWLEDGE_ITEMS = [
  {
    id: "prepare",
    icon: "🎒",
    title: "ก่อนเกิดน้ำท่วม",
    summary: "เตรียมของจำเป็น เอกสาร ยา และแผนอพยพให้พร้อม",
    keywords: ["เตรียมตัว", "ก่อนน้ำท่วม", "ของจำเป็น", "กระเป๋าฉุกเฉิน"],
    tips: [
      "ติดตามประกาศระดับน้ำและสภาพอากาศจากหน่วยงานที่เชื่อถือได้",
      "เตรียมน้ำดื่ม อาหารแห้ง ยาประจำตัว ไฟฉาย แบตสำรอง และของใช้จำเป็น",
      "ใส่เอกสารสำคัญและโทรศัพท์ในถุงหรือภาชนะกันน้ำ",
      "วางแผนเส้นทางอพยพและจุดนัดพบของสมาชิกในครอบครัว",
      "ย้ายของมีค่าและเครื่องใช้ไฟฟ้าขึ้นที่สูง หากทำได้อย่างปลอดภัย",
    ],
  },
  {
    id: "high-water",
    icon: "🌊",
    title: "เมื่อน้ำเริ่มสูง",
    summary: "ย้ายขึ้นพื้นที่สูง หลีกเลี่ยงกระแสน้ำ และเตรียมอพยพ",
    keywords: ["น้ำสูง", "น้ำขึ้น", "น้ำท่วมสูง", "น้ำเข้าบ้าน"],
    tips: [
      "ย้ายคน เด็ก ผู้สูงอายุ สัตว์เลี้ยง และของจำเป็นไปยังพื้นที่สูง",
      "หลีกเลี่ยงการเดินลุยน้ำที่ไหลแรงหรือมีระดับน้ำที่มองพื้นไม่เห็น",
      "อย่าเข้าใกล้เสาไฟ สายไฟ หรืออุปกรณ์ไฟฟ้าที่อยู่ในน้ำ",
      "เตรียมพร้อมอพยพหากระดับน้ำยังเพิ่มขึ้นหรือมีคำสั่งจากเจ้าหน้าที่",
      "เก็บโทรศัพท์และแบตสำรองไว้พร้อมใช้งานเพื่อรับข้อมูลข่าวสาร",
    ],
  },
  {
    id: "electricity",
    icon: "⚡",
    title: "ไฟฟ้าและน้ำท่วม",
    summary: "หลีกเลี่ยงอุปกรณ์ไฟฟ้าและตัดไฟเฉพาะเมื่อทำได้อย่างปลอดภัย",
    keywords: ["ไฟฟ้า", "ไฟรั่ว", "ปลั๊ก", "สายไฟ", "ตัดไฟ"],
    tips: [
      "ห้ามสัมผัสปลั๊ก สายไฟ หรือเครื่องใช้ไฟฟ้าขณะตัวเปียกหรือยืนอยู่ในน้ำ",
      "หากเข้าถึงเมนสวิตช์ได้โดยไม่ต้องลุยน้ำ ให้ปิดกระแสไฟก่อนน้ำเข้าถึงอุปกรณ์ไฟฟ้า",
      "หากเมนสวิตช์อยู่ในพื้นที่น้ำท่วม อย่าเข้าไปปิดด้วยตนเอง",
      "พบสายไฟขาดหรือเสาไฟล้ม ให้เว้นระยะห่างและแจ้งเจ้าหน้าที่ที่เกี่ยวข้อง",
      "หลังน้ำลด ควรให้ผู้มีความรู้ตรวจระบบไฟฟ้าก่อนเปิดใช้งานอีกครั้ง",
    ],
  },
  {
    id: "evacuation",
    icon: "🏃",
    title: "การอพยพ",
    summary: "ออกจากพื้นที่เมื่อเริ่มไม่ปลอดภัย และพกเฉพาะสิ่งจำเป็น",
    keywords: ["อพยพ", "ออกจากบ้าน", "หนีน้ำ", "ย้ายที่"],
    tips: [
      "ปฏิบัติตามคำแนะนำของเจ้าหน้าที่และออกจากพื้นที่เมื่อมีคำสั่งอพยพ",
      "พกน้ำดื่ม ยา เอกสาร โทรศัพท์ แบตสำรอง และเสื้อผ้าที่จำเป็น",
      "ช่วยเด็ก ผู้สูงอายุ ผู้ป่วย และผู้ที่เคลื่อนไหวลำบากเป็นลำดับแรก",
      "หลีกเลี่ยงเส้นทางที่มีน้ำไหลแรง สะพานที่เสียหาย หรือพื้นที่ที่มองไม่เห็นพื้น",
      "แจ้งสมาชิกในครอบครัวหรือผู้ใกล้ชิดว่ากำลังอพยพไปที่ใด",
    ],
  },
  {
    id: "food-water",
    icon: "💧",
    title: "อาหารและน้ำดื่ม",
    summary: "เลือกน้ำสะอาดและหลีกเลี่ยงอาหารที่สัมผัสน้ำท่วม",
    keywords: ["อาหาร", "น้ำดื่ม", "กิน", "น้ำสะอาด", "อาหารเสีย"],
    tips: [
      "ดื่มน้ำบรรจุขวดที่ปิดสนิทหรือน้ำที่ผ่านการทำให้ปลอดภัยแล้ว",
      "ทิ้งอาหารที่สัมผัสน้ำท่วมหรือมีกลิ่น สี หรือสภาพผิดปกติ",
      "เก็บอาหารในภาชนะที่ปิดสนิทและอยู่เหนือระดับน้ำ",
      "ล้างมือด้วยน้ำสะอาดและสบู่ก่อนเตรียมหรือรับประทานอาหาร",
      "หากไม่แน่ใจว่าอาหารปลอดภัยหรือไม่ ควรหลีกเลี่ยงการรับประทาน",
    ],
  },
  {
    id: "vulnerable",
    icon: "👨‍👩‍👧",
    title: "เด็ก ผู้สูงอายุ และผู้ป่วย",
    summary: "ให้ความสำคัญกับการอพยพ ยา และการดูแลเป็นพิเศษ",
    keywords: ["เด็ก", "ผู้สูงอายุ", "คนแก่", "ผู้ป่วย", "ยา"],
    tips: [
      "เตรียมยาประจำตัวและข้อมูลการรักษาที่จำเป็นไว้ในภาชนะกันน้ำ",
      "อย่าปล่อยเด็กอยู่ใกล้น้ำท่วมโดยไม่มีผู้ดูแล",
      "จัดผู้ช่วยสำหรับผู้สูงอายุหรือผู้ที่เดินทางลำบากก่อนอพยพ",
      "เตรียมอาหารเฉพาะบุคคลและอุปกรณ์ช่วยเหลือที่จำเป็น",
      "หลีกเลี่ยงการให้ผู้ที่มีสุขภาพเปราะบางสัมผัสน้ำท่วมโดยตรง",
    ],
  },
  {
    id: "animals",
    icon: "🐍",
    title: "งูและสัตว์มีพิษ",
    summary: "อย่าเข้าใกล้หรือจับเอง เพราะสัตว์อาจหนีน้ำเข้าที่พักอาศัย",
    keywords: ["งู", "สัตว์มีพิษ", "แมลง", "ตะขาบ", "แมงป่อง"],
    tips: [
      "ตรวจพื้นที่ก่อนหยิบของหรือเข้าไปในมุมมืดหลังน้ำท่วม",
      "สวมรองเท้าหุ้มส้นและถุงมือเมื่อทำความสะอาดพื้นที่",
      "หากพบงูหรือสัตว์มีพิษ อย่าเข้าใกล้ จับ หรือไล่ด้วยตนเอง",
      "ปิดช่องทางที่สัตว์อาจเข้าบ้านได้เมื่อสถานการณ์ปลอดภัย",
      "หากถูกกัดหรือต่อย ให้ขอความช่วยเหลือทางการแพทย์โดยเร็ว",
    ],
  },
  {
    id: "after-flood",
    icon: "🏠",
    title: "หลังน้ำลด",
    summary: "ตรวจโครงสร้าง ไฟฟ้า น้ำ และความสะอาดก่อนกลับมาใช้พื้นที่",
    keywords: ["น้ำลด", "หลังน้ำท่วม", "กลับบ้าน", "ทำความสะอาด"],
    tips: [
      "ตรวจความมั่นคงของพื้น ผนัง บันได และโครงสร้างก่อนเข้าอาคาร",
      "อย่าเปิดระบบไฟฟ้าหรือเครื่องใช้ไฟฟ้าที่เปียกน้ำทันที",
      "สวมรองเท้า ถุงมือ และอุปกรณ์ป้องกันขณะทำความสะอาด",
      "ทำความสะอาดและฆ่าเชื้อพื้นผิวที่สัมผัสน้ำท่วม",
      "ระวังของมีคม สัตว์มีพิษ เชื้อรา และน้ำสกปรกที่ตกค้าง",
    ],
  },
];

export default function FloodKnowledgeCenter() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(KNOWLEDGE_ITEMS[0].id);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return KNOWLEDGE_ITEMS;

    return KNOWLEDGE_ITEMS.filter((item) =>
      [item.title, item.summary, ...item.keywords, ...item.tips]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  const selectedItem =
    filteredItems.find((item) => item.id === selectedId) ||
    filteredItems[0] ||
    null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-7">
        <p className="mb-2 text-sm font-semibold text-blue-600">FLOOD SAFETY KNOWLEDGE</p>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          ศูนย์ความรู้ภัยน้ำท่วม
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          รวมคำแนะนำพื้นฐานสำหรับการเตรียมตัว รับมือสถานการณ์น้ำท่วม การอพยพ และการกลับเข้าพื้นที่หลังน้ำลด
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="knowledge-search" className="mb-2 block text-sm font-medium text-slate-700">
          ค้นหาหัวข้อที่ต้องการ
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
          <input
            id="knowledge-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="เช่น น้ำท่วมสูง, ไฟฟ้า, อพยพ, น้ำดื่ม..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-base text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
          <div className="text-3xl">🔎</div>
          <p className="mt-3 font-semibold text-slate-800">ยังไม่พบหัวข้อที่ตรงกับคำค้น</p>
          <p className="mt-1 text-sm text-slate-500">ลองค้นด้วยคำสั้น ๆ เช่น “น้ำสูง”, “ไฟฟ้า” หรือ “อพยพ”</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`flex min-w-0 items-start gap-3 rounded-2xl border p-4 text-left transition ${
                  selectedItem?.id === item.id
                    ? "border-blue-300 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-slate-900">{item.title}</span>
                  <span className="mt-1 block text-sm leading-5 text-slate-500">{item.summary}</span>
                </span>
              </button>
            ))}
          </div>

          {selectedItem && (
            <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-start gap-4 border-b border-slate-100 pb-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  {selectedItem.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{selectedItem.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base">{selectedItem.summary}</p>
                </div>
              </div>

              <h3 className="mb-4 font-semibold text-slate-900">ข้อแนะนำเบื้องต้น</h3>
              <div className="space-y-3">
                {selectedItem.tips.map((tip, index) => (
                  <div key={`${selectedItem.id}-${index}`} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="pt-0.5 text-sm leading-6 text-slate-700 sm:text-base">{tip}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm leading-6 text-amber-900">
                  <strong>หมายเหตุ:</strong> ข้อมูลในหน้านี้เป็นคำแนะนำทั่วไป หากสถานการณ์ไม่ปลอดภัย ควรปฏิบัติตามคำแนะนำของเจ้าหน้าที่ในพื้นที่เป็นหลัก
                </p>
              </div>
            </article>
          )}
        </div>
      )}
    </section>
  );
}
