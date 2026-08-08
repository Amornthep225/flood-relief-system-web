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
                        หน้านี้สำหรับขอรับสิ่งของช่วยเหลือจากศูนย์ เช่น อาหาร น้ำ ยา และของใช้จำเป็น
                        หากเป็นเหตุฉุกเฉินที่ต้องการเจ้าหน้าที่เข้าช่วยทันที กรุณาใช้เมนู SOS ฉุกเฉิน
                    </p>
                </div>

                <Link
                    href="/user/sos-form"
                    className={buttons.userHome.sos}
                >
                    <span className="material-symbols-outlined text-red-500">
                        inventory_2
                    </span>

                    ขอรับสิ่งของช่วยเหลือ
                </Link>
            </div>
        </section>
    );
}