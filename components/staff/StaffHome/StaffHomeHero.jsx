import Link from "next/link";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";

export default function StaffHomeHero() {
    return (
        <section className={cards.staffHome.hero}>
            <div className="absolute -right-10 -bottom-10 opacity-10">
                <span className="material-symbols-outlined text-[240px] text-white">
                    support_agent
                </span>
            </div>

            <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                        สวัสดีครับ เจ้าหน้าที่
                    </h1>
                    <p className="text-blue-100 text-lg mt-2">
                        เจ้าหน้าที่ประจำศูนย์ประสานงานกลาง
                    </p>
                </div>

                <Link
                    href="/staff/staff-sos"
                    className={buttons.staffHome.hero}
                >
                    <span className="material-symbols-outlined">
                        emergency
                    </span>
                    ดูรายการ SOS
                </Link>
            </div>
        </section>
    );
}