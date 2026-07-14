import Link from "next/link";
import { buttons } from "@/constants/buttons";
import { cards } from "@/constants/cards";

export default function UserHero() {
    return (
        <section className={cards.userHome.hero}>
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[300px] -translate-y-20 translate-x-20 text-white">
                    shield
                </span>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        สวัสดีครับ
                    </h1>

                    <p className="text-sky-50 text-lg opacity-95 leading-relaxed font-light">
                        เราพร้อมอยู่เคียงข้างคุณเสมอ ขอให้คุณและครอบครัวปลอดภัย
                        หากต้องการความช่วยเหลือเร่งด่วน กรุณากดปุ่ม SOS
                    </p>
                </div>

                <Link
                    href="/user/sos-form"
                    className={buttons.userHome.sos}
                >
                    <span className="material-symbols-outlined text-red-500">
                        emergency
                    </span>

                    แจ้งขอความช่วยเหลือ (SOS)
                </Link>
            </div>
        </section>
    );
}